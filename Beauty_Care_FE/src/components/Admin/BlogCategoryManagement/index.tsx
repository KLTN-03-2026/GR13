import React, { useState, useMemo } from "react";
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
  message,
  Row,
  Col,
  Statistic,
  Spin,
  Badge,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
  useGetBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
} from "../../../hooks/blog";
import type { IBlogCategory } from "../../../api/blog";

const { Title, Text } = Typography;

const BlogCategoryManagementComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IBlogCategory | null>(null);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: categoriesRes, isLoading } = useGetBlogCategories();
  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  const categories = categoriesRes?.data || [];

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === "active").length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [categories]);

  // Mock data for chart
  const chartData = useMemo(() => {
    const data = {
      week: [
        { name: "T2", blogs: 12 },
        { name: "T3", blogs: 18 },
        { name: "T4", blogs: 15 },
        { name: "T5", blogs: 22 },
        { name: "T6", blogs: 20 },
        { name: "T7", blogs: 25 },
        { name: "CN", blogs: 10 },
      ],
      month: [
        { name: "Tuần 1", blogs: 80 },
        { name: "Tuần 2", blogs: 95 },
        { name: "Tuần 3", blogs: 70 },
        { name: "Tuần 4", blogs: 110 },
      ],
      year: [
        { name: "Tháng 1", blogs: 300 },
        { name: "Tháng 2", blogs: 280 },
        { name: "Tháng 3", blogs: 350 },
        { name: "Tháng 4", blogs: 400 },
        { name: "Tháng 5", blogs: 320 },
        { name: "Tháng 6", blogs: 380 },
      ],
    };
    return data;
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IBlogCategory) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa danh mục này không? Các bài viết thuộc danh mục này sẽ bị mất liên kết.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Đã xóa danh mục bài viết");
        } catch (error) {
          message.error("Lỗi khi xóa danh mục");
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingCategory) {
          await updateMutation.mutateAsync({
            id: editingCategory.id,
            ...values,
          });
          message.success("Đã cập nhật danh mục");
        } else {
          await createMutation.mutateAsync(values);
          message.success("Đã thêm danh mục mới");
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text || "N/A" }} />,
    },
    {
      title: "Số bài viết",
      dataIndex: "blogsCount",
      key: "blogsCount",
      width: 120,
      render: (count: number) => <Tag color="blue">{count || 0} bài</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: "active" | "inactive") => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status === "active" ? "Hiển thị" : "Ẩn"}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: IBlogCategory) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-category-management">
      <Title level={2}>Quản lý danh mục bài viết</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Tổng danh mục"
              value={stats.total}
              prefix={<TagsOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Đang hiển thị"
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Đang ẩn"
              value={stats.inactive}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space><BarChartOutlined /> Thống kê bài viết theo danh mục</Space>
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
                    dataKey="blogs"
                    fill="#1890ff"
                    name="Số lượng bài viết"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Space><TagsOutlined /> Danh sách danh mục</Space>}
        bordered={false}
        extra={
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm danh mục..."
              style={{ width: 250 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm danh mục
            </Button>
          </Space>
        }
      >
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            size="small"
          />
        </Spin>
      </Card>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
              >
                <Input placeholder="Nhập tên danh mục bài viết" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="active"
              >
                <Select>
                  <Select.Option value="active">Hiển thị</Select.Option>
                  <Select.Option value="inactive">Ẩn</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <ReactQuill theme="snow" style={{ height: 200, marginBottom: 50 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogCategoryManagementComponent;