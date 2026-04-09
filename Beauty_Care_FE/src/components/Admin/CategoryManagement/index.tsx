import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Upload,
  message,
  Spin,
} from "antd";
import {
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./style.scss";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../../hooks/product";
import type { ICategory } from "../../../api/product";

const { Title, Text } = Typography;

const CategoryManagementComponent: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: categoriesRes, isLoading: isLoadingCategories } =
    useGetCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesRes?.data || [];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  type TimelineRow = { name: string } & Record<string, number | string>;

  const timelineByPeriod = useMemo(() => {
    const week: TimelineRow[] = [
      { name: "T2", "Làm sạch": 32, "Chống nắng": 28, "Tinh chất": 22, "Dưỡng ẩm": 18, "Trang điểm": 12 },
      { name: "T3", "Làm sạch": 35, "Chống nắng": 30, "Tinh chất": 20, "Dưỡng ẩm": 16, "Trang điểm": 10 },
      { name: "T4", "Làm sạch": 28, "Chống nắng": 26, "Tinh chất": 24, "Dưỡng ẩm": 19, "Trang điểm": 14 },
      { name: "T5", "Làm sạch": 40, "Chống nắng": 33, "Tinh chất": 26, "Dưỡng ẩm": 22, "Trang điểm": 15 },
      { name: "T6", "Làm sạch": 34, "Chống nắng": 29, "Tinh chất": 23, "Dưỡng ẩm": 20, "Trang điểm": 13 },
      { name: "T7", "Làm sạch": 46, "Chống nắng": 38, "Tinh chất": 30, "Dưỡng ẩm": 25, "Trang điểm": 18 },
      { name: "CN", "Làm sạch": 38, "Chống nắng": 34, "Tinh chất": 27, "Dưỡng ẩm": 21, "Trang điểm": 16 },
    ];

    const month: TimelineRow[] = [
      { name: "Tuần 1", "Làm sạch": 180, "Chống nắng": 160, "Tinh chất": 140, "Dưỡng ẩm": 120, "Trang điểm": 90 },
      { name: "Tuần 2", "Làm sạch": 210, "Chống nắng": 190, "Tinh chất": 170, "Dưỡng ẩm": 150, "Trang điểm": 110 },
      { name: "Tuần 3", "Làm sạch": 195, "Chống nắng": 175, "Tinh chất": 165, "Dưỡng ẩm": 140, "Trang điểm": 105 },
      { name: "Tuần 4", "Làm sạch": 235, "Chống nắng": 210, "Tinh chất": 190, "Dưỡng ẩm": 165, "Trang điểm": 120 },
    ];

    const year: TimelineRow[] = [
      { name: "Tháng 1", "Làm sạch": 620, "Chống nắng": 540, "Tinh chất": 510, "Dưỡng ẩm": 430, "Trang điểm": 320 },
      { name: "Tháng 2", "Làm sạch": 590, "Chống nắng": 520, "Tinh chất": 480, "Dưỡng ẩm": 410, "Trang điểm": 300 },
      { name: "Tháng 3", "Làm sạch": 680, "Chống nắng": 600, "Tinh chất": 560, "Dưỡng ẩm": 470, "Trang điểm": 350 },
      { name: "Tháng 4", "Làm sạch": 650, "Chống nắng": 580, "Tinh chất": 540, "Dưỡng ẩm": 455, "Trang điểm": 335 },
      { name: "Tháng 5", "Làm sạch": 710, "Chống nắng": 620, "Tinh chất": 590, "Dưỡng ẩm": 490, "Trang điểm": 365 },
      { name: "Tháng 6", "Làm sạch": 740, "Chống nắng": 640, "Tinh chất": 610, "Dưỡng ẩm": 510, "Trang điểm": 380 },
    ];

    return { week, month, year };
  }, []);

  const top3CategoryNames = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const row of timelineByPeriod[period]) {
      for (const [key, value] of Object.entries(row)) {
        if (key === "name") continue;
        if (typeof value !== "number") continue;
        totals[key] = (totals[key] ?? 0) + value;
      }
    }
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);
  }, [period, timelineByPeriod]);

  const chartData = useMemo(() => {
    const [firstName, secondName, thirdName] = top3CategoryNames;
    return timelineByPeriod[period].map((row) => ({
      name: row.name,
      first: (row[firstName] as number) ?? 0,
      second: (row[secondName] as number) ?? 0,
      third: (row[thirdName] as number) ?? 0,
    }));
  }, [period, timelineByPeriod, top3CategoryNames]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const totalCategories = categories.length;
  const visibleCategories = categories.length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productsCount || 0),
    0,
  );

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: ICategory) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa danh mục này không?",
      onOk: async () => {
        try {
          await deleteCategoryMutation.mutateAsync(id);
          message.success("Đã xóa danh mục");
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
          await updateCategoryMutation.mutateAsync({
            id: editingCategory.id,
            ...values,
          });
          message.success("Đã cập nhật danh mục");
        } else {
          await createCategoryMutation.mutateAsync({
            ...values,
            image:
              values.image ||
              "https://api.dicebear.com/7.x/shapes/svg?seed=" +
                Date.now().toString(),
          });
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
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (src: string) => (
        <Image
          src={src || "https://via.placeholder.com/48"}
          width={48}
          height={48}
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text || "" }} />
      ),
    },
    {
      title: "Số SP",
      dataIndex: "productsCount",
      key: "productsCount",
      width: 90,
      sorter: (a: ICategory, b: ICategory) =>
        (a.productsCount || 0) - (b.productsCount || 0),
      render: (v: number) => <Tag color="blue">{v || 0}</Tag>,
    },
    {
      title: "Đã bán",
      dataIndex: "soldQty",
      key: "soldQty",
      width: 110,
      sorter: (a: ICategory, b: ICategory) =>
        (a.soldQty || 0) - (b.soldQty || 0),
      render: (v: number) => <Tag color="geekblue">{v || 0}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
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
      render: (_: unknown, record: ICategory) => (
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
    <div className="category-management">
      <Title level={2}>Quản lý danh mục</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="category-stat-card">
            <Statistic
              title="Tổng danh mục"
              value={totalCategories}
              prefix={<TagsOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="category-stat-card">
            <Statistic title="Đang hiển thị" value={visibleCategories} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="category-stat-card">
            <Statistic title="Tổng sản phẩm" value={totalProducts} />
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
                  <BarChartOutlined /> Top 3 danh mục bán nhiều nhất
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
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="first"
                    fill="#1890ff"
                    name={top3CategoryNames[0] ?? "Top 1"}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="second"
                    fill="#52c41a"
                    name={top3CategoryNames[1] ?? "Top 2"}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="third"
                    fill="#faad14"
                    name={top3CategoryNames[2] ?? "Top 3"}
                    radius={[6, 6, 0, 0]}
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
            <TagsOutlined /> Danh sách danh mục
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm danh mục..."
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm danh mục
            </Button>
          </Space>
        }
      >
        <Spin spinning={isLoadingCategories}>
          <Table columns={columns} dataSource={filteredCategories} rowKey="id" />
        </Spin>
      </Card>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={720}
        confirmLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
              >
                <Input placeholder="Ví dụ: Làm sạch" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            className="quill-editor-item"
          >
            <ReactQuill
              theme="snow"
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập mô tả chi tiết danh mục..."
              style={{ height: 220, marginBottom: 50 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="active"
              >
                <Select
                  options={[
                    { value: "active", label: "Hiển thị" },
                    { value: "inactive", label: "Ẩn" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="image" label="Link hình ảnh">
                <Input placeholder="Nhập link hình ảnh hoặc dùng mặc định" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementComponent;
