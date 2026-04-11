import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Tag,
  Image,
  message,
  Row,
  Col,
  Tooltip,
  Upload,
  Statistic,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  UserOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  EditOutlined as FormEditOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./style.scss";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  useGetBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  useGetBlogCategories,
} from "../../../hooks/blog";
import type { IBlog } from "../../../api/blog";



const { Title, Text } = Typography;

const BlogManagementComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  const [search, setSearch] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: blogsRes, isLoading } = useGetBlogs({ q: search });
  const { data: blogCategoriesRes } = useGetBlogCategories();
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const blogs = blogsRes?.data?.items || [];
  const blogCategories = blogCategoriesRes?.data || [];

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setEditingBlog(null);
      setFileList([]);
      form.resetFields();
      setIsModalVisible(true);
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, form]);

  const stats = useMemo(() => {
    const published = blogs.filter((b) => b.status === "published").length;
    const draft = blogs.filter((b) => b.status === "draft").length;
    const archived = blogs.filter((b) => b.status === "archived").length;
    return { published, draft, archived };
  }, [blogs]);

  const chartData = useMemo(() => {
    const week = [
      { name: "T2", published: 2, draft: 1, archived: 1 },
      { name: "T3", published: 3, draft: 2, archived: 0 },
      { name: "T4", published: 1, draft: 1, archived: 2 },
      { name: "T5", published: 4, draft: 0, archived: 1 },
      { name: "T6", published: 2, draft: 3, archived: 1 },
      { name: "T7", published: 5, draft: 1, archived: 0 },
      { name: "CN", published: 3, draft: 1, archived: 1 },
    ];
    const month = [
      { name: "Tuần 1", published: 12, draft: 5, archived: 3 },
      { name: "Tuần 2", published: 15, draft: 4, archived: 6 },
      { name: "Tuần 3", published: 10, draft: 8, archived: 4 },
      { name: "Tuần 4", published: 18, draft: 3, archived: 5 },
    ];
    const year = [
      { name: "Tháng 1", published: 45, draft: 12, archived: 8 },
      { name: "Tháng 2", published: 38, draft: 15, archived: 10 },
      { name: "Tháng 3", published: 52, draft: 10, archived: 12 },
      { name: "Tháng 4", published: 60, draft: 8, archived: 15 },
      { name: "Tháng 5", published: 48, draft: 14, archived: 9 },
      { name: "Tháng 6", published: 55, draft: 11, archived: 11 },
    ];
    return { week, month, year };
  }, []);

  const handleAdd = () => {
    setEditingBlog(null);
    setFileList([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IBlog) => {
    setEditingBlog(record);
    const currentFileList = record.image
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: record.image,
          },
        ]
      : [];
    setFileList(currentFileList);
    form.setFieldsValue({
      ...record,
      image: currentFileList,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBlogMutation.mutateAsync(id);
          message.success("Đã xóa bài viết");
        } catch (error) {
          message.error("Lỗi khi xóa bài viết");
        }
      },
    });
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        let imageUrl = values.image;
        if (fileList.length > 0 && fileList[0].originFileObj) {
          imageUrl = await getBase64(fileList[0].originFileObj);
        } else if (fileList.length > 0 && fileList[0].url) {
          imageUrl = fileList[0].url;
        } else {
          imageUrl = null;
        }

        const blogData = {
          ...values,
          image: imageUrl,
        };

        if (editingBlog) {
          await updateBlogMutation.mutateAsync({
            id: editingBlog.id,
            ...blogData,
          });
          message.success("Đã cập nhật bài viết");
        } else {
          await createBlogMutation.mutateAsync(blogData);
          message.success("Đã thêm bài viết mới");
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img: string) => (
        <Image
          src={img || "https://via.placeholder.com/80"}
          alt="blog"
          width={80}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên bài viết",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Tác giả",
      dataIndex: "authorData",
      key: "author",
      width: 150,
      render: (authorData: any) => (
        <Space>
          <UserOutlined />
          {authorData ? `${authorData.firstName} ${authorData.lastName}` : "N/A"}
        </Space>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      width: 130,
      render: (_: any, record: IBlog) => (
        <Tag color="blue">{record.blogCategoryData?.name || "N/A"}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: "published" | "draft" | "archived") => {
        const config = {
          published: { color: "green", label: "Đã đăng" },
          draft: { color: "orange", label: "Bản nháp" },
          archived: { color: "blue", label: "Lưu trữ" },
        };
        return <Tag color={config[status].color}>{config[status].label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: IBlog) => (
        <Space>
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-management">
      <Title level={2}>Quản lý bài viết</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="blog-stat-card">
            <Statistic
              title="Bài viết đã đăng"
              value={stats.published}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="blog-stat-card">
            <Statistic
              title="Bản nháp"
              value={stats.draft}
              prefix={<FormEditOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="blog-stat-card">
            <Statistic
              title="Lưu trữ"
              value={stats.archived}
              prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Space>
                  <BarChartOutlined /> Thống kê bài viết theo thời gian
                </Space>
                <Select
                  value={period}
                  onChange={(v) => setPeriod(v)}
                  style={{ width: 140 }}
                  options={[
                    { value: "week", label: "Xem Tuần" },
                    { value: "month", label: "Xem Tháng" },
                    { value: "year", label: "Xem Năm" },
                  ]}
                />
              </div>
            }
            bordered={false}
          >
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={chartData[period]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Bar
                    dataKey="published"
                    fill="#52c41a"
                    name="Đã đăng"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="draft"
                    fill="#faad14"
                    name="Bản nháp"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="archived"
                    fill="#1890ff"
                    name="Lưu trữ"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <FileTextOutlined /> Danh sách bài viết
          </Space>
        }
        bordered={false}
        extra={
          <Space wrap>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tiêu đề..."
              style={{ width: 250 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm bài viết
            </Button>
          </Space>
        }
      >
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={blogs}
            rowKey="id"
            size="small"
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        okText={editingBlog ? "Cập nhật" : "Tạo bài viết"}
        cancelText="Hủy"
        confirmLoading={createBlogMutation.isPending || updateBlogMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Tên bài viết"
                rules={[
                  { required: true, message: "Vui lòng nhập tên bài viết" },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="blog_category_id"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {blogCategories.map((cat: any) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="desc"
                label="Mô tả ngắn"
                rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
              >
                <Input placeholder="Nhập mô tả ngắn cho bài viết" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="draft"
              >
                <Select>
                  <Select.Option value="published">Đã đăng</Select.Option>
                  <Select.Option value="draft">Bản nháp</Select.Option>
                  <Select.Option value="archived">Lưu trữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="image"
            label="Hình ảnh bài viết"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bài viết" },
            ]}
          >
            <ReactQuill theme="snow" style={{ height: 300, marginBottom: 50 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagementComponent;