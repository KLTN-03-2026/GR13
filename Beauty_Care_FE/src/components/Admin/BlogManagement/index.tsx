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
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

const { Title, Text } = Typography;

type BlogStatus = "published" | "draft" | "pending";

interface BlogItem {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
  status: BlogStatus;
}

const BlogManagementComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [search, setSearch] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [form] = Form.useForm();

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

  // Mock data for Blogs
  const [blogs, setBlogs] = useState<BlogItem[]>([
    {
      id: 1,
      title: "5 Bí quyết chăm sóc da mặt tại nhà",
      author: "Admin",
      category: "Chăm sóc da",
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2022-08/istockphoto-921797424-612x612.jpg",
      content: "<p>Nội dung chi tiết về cách chăm sóc da mặt tại nhà...</p>",
      createdAt: "2024-04-01",
      status: "published",
    },
    {
      id: 2,
      title: "Tác dụng của kem chống nắng hằng ngày",
      author: "Nguyễn Thu Thảo",
      category: "Chăm sóc da",
      image: "https://hongngochospital.vn/wp-content/uploads/2020/02/cham-soc-da-dep.jpg",
      content: "<p>Tầm quan trọng của việc sử dụng kem chống nắng mỗi ngày...</p>",
      createdAt: "2024-04-03",
      status: "published",
    },
    {
      id: 3,
      title: "Xu hướng trang điểm tự nhiên 2024",
      author: "Lê Minh Anh",
      category: "Trang điểm",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      content: "<p>Những phong cách trang điểm tự nhiên đang lên ngôi...</p>",
      createdAt: "2024-04-05",
      status: "draft",
    },
    {
      id: 4,
      title: "Quy trình chăm sóc da mụn đúng cách",
      author: "Trần Văn B",
      category: "Chăm sóc da",
      image: "https://thammyquoctednd.vn/wp-content/uploads/2024/06/cham-soc-da-chuyen-sau.jpg",
      content: "<p>Các bước chăm sóc da mụn...</p>",
      createdAt: "2024-04-06",
      status: "pending",
    },
  ]);

  const stats = useMemo(() => {
    const published = blogs.filter(b => b.status === "published").length;
    const draft = blogs.filter(b => b.status === "draft").length;
    const pending = blogs.filter(b => b.status === "pending").length;
    return { published, draft, pending };
  }, [blogs]);

  const chartData = useMemo(() => {
    const week = [
      { name: "T2", published: 2, draft: 1, pending: 1 },
      { name: "T3", published: 3, draft: 2, pending: 0 },
      { name: "T4", published: 1, draft: 1, pending: 2 },
      { name: "T5", published: 4, draft: 0, pending: 1 },
      { name: "T6", published: 2, draft: 3, pending: 1 },
      { name: "T7", published: 5, draft: 1, pending: 0 },
      { name: "CN", published: 3, draft: 1, pending: 1 },
    ];
    const month = [
      { name: "Tuần 1", published: 12, draft: 5, pending: 3 },
      { name: "Tuần 2", published: 15, draft: 4, pending: 6 },
      { name: "Tuần 3", published: 10, draft: 8, pending: 4 },
      { name: "Tuần 4", published: 18, draft: 3, pending: 5 },
    ];
    const year = [
      { name: "Tháng 1", published: 45, draft: 12, pending: 8 },
      { name: "Tháng 2", published: 38, draft: 15, pending: 10 },
      { name: "Tháng 3", published: 52, draft: 10, pending: 12 },
      { name: "Tháng 4", published: 60, draft: 8, pending: 15 },
      { name: "Tháng 5", published: 48, draft: 14, pending: 9 },
      { name: "Tháng 6", published: 55, draft: 11, pending: 11 },
    ];
    return { week, month, year };
  }, []);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const handleAdd = () => {
    setEditingBlog(null);
    setFileList([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: BlogItem) => {
    setEditingBlog(record);
    const currentFileList = [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: record.image,
      },
    ];
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
      onOk: () => {
        setBlogs(blogs.filter((b) => b.id !== id));
        message.success("Đã xóa bài viết");
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
      let imageUrl = values.image;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        imageUrl = await getBase64(fileList[0].originFileObj);
      } else if (fileList.length > 0 && fileList[0].url) {
        imageUrl = fileList[0].url;
      }

      const blogData = {
        ...values,
        image: imageUrl,
      };

      if (editingBlog) {
        setBlogs(
          blogs.map((b) =>
            b.id === editingBlog.id ? { ...b, ...blogData } : b
          )
        );
        message.success("Đã cập nhật bài viết");
      } else {
        const newBlog: BlogItem = {
          id: Date.now(),
          ...blogData,
          createdAt: new Date().toISOString().split("T")[0],
          status: values.status || "draft",
        };
        setBlogs([newBlog, ...blogs]);
        message.success("Đã thêm bài viết mới");
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img: string) => (
        <Image src={img} alt="blog" width={80} style={{ borderRadius: 4 }} />
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
      dataIndex: "author",
      key: "author",
      width: 150,
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 130,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: BlogStatus) => {
        const config = {
          published: { color: "green", label: "Đã đăng" },
          draft: { color: "orange", label: "Bản nháp" },
          pending: { color: "blue", label: "Chờ duyệt" },
        };
        return <Tag color={config[status].color}>{config[status].label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: BlogItem) => (
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
              title="Chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space><BarChartOutlined /> Thống kê bài viết theo thời gian</Space>
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
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="published" fill="#52c41a" name="Đã đăng" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="draft" fill="#faad14" name="Bản nháp" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#1890ff" name="Chờ duyệt" radius={[4, 4, 0, 0]} />
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
              placeholder="Tìm theo tiêu đề, tác giả..."
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
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          size="small"
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        okText={editingBlog ? "Cập nhật" : "Tạo bài viết"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Tên bài viết"
                rules={[{ required: true, message: "Vui lòng nhập tên bài viết" }]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Select.Option value="Chăm sóc da">Chăm sóc da</Select.Option>
                  <Select.Option value="Trang điểm">Trang điểm</Select.Option>
                  <Select.Option value="Tư vấn">Tư vấn</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Tác giả"
                rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
              >
                <Input placeholder="Tên người viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="draft"
              >
                <Select>
                  <Select.Option value="published">Đã đăng</Select.Option>
                  <Select.Option value="draft">Bản nháp</Select.Option>
                  <Select.Option value="pending">Chờ duyệt</Select.Option>
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
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
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
            rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết" }]}
          >
            <ReactQuill theme="snow" style={{ height: 300, marginBottom: 50 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagementComponent;
