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

const { Title, Text } = Typography;

type Period = "week" | "month" | "year";

type CategoryStatus = "Hiển thị" | "Ẩn";

interface CategoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
  productsCount: number;
  soldQty: number;
  status: CategoryStatus;
}

const CategoryManagementComponent: React.FC = () => {
  const [period, setPeriod] = useState<Period>("week");
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null,
  );
  const [form] = Form.useForm();

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

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 1,
      name: "Làm sạch",
      description: "Sữa rửa mặt, tẩy trang, toner…",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=cleanser",
      productsCount: 42,
      soldQty: 1280,
      status: "Hiển thị",
    },
    {
      id: 2,
      name: "Chống nắng",
      description: "Kem chống nắng, xịt chống nắng…",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=sunscreen",
      productsCount: 25,
      soldQty: 980,
      status: "Hiển thị",
    },
    {
      id: 3,
      name: "Tinh chất",
      description: "Serum, ampoule…",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=serum",
      productsCount: 36,
      soldQty: 860,
      status: "Hiển thị",
    },
    {
      id: 4,
      name: "Dưỡng ẩm",
      description: "Kem dưỡng, lotion…",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=moisturizer",
      productsCount: 31,
      soldQty: 740,
      status: "Hiển thị",
    },
    {
      id: 5,
      name: "Trang điểm",
      description: "Son, phấn, kem nền…",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=makeup",
      productsCount: 18,
      soldQty: 520,
      status: "Ẩn",
    },
  ]);

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

    return { week, month, year } satisfies Record<Period, TimelineRow[]>;
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
        c.description.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const totalCategories = categories.length;
  const visibleCategories = categories.filter((c) => c.status === "Hiển thị").length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productsCount, 0);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({ status: "Hiển thị" });
    setIsModalVisible(true);
  };

  const handleEdit = (record: CategoryItem) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa danh mục này không?",
      onOk: () => {
        setCategories(categories.filter((c) => c.id !== id));
        message.success("Đã xóa danh mục");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  ...values,
                }
              : c,
          ),
        );
        message.success("Đã cập nhật danh mục");
      } else {
        const newCategory: CategoryItem = {
          id: Date.now(),
          image:
            "https://api.dicebear.com/7.x/shapes/svg?seed=" + Date.now().toString(),
          soldQty: 0,
          ...values,
        };
        setCategories([...categories, newCategory]);
        message.success("Đã thêm danh mục mới");
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (src: string) => (
        <Image src={src} width={48} height={48} style={{ borderRadius: 8 }} />
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
    },
    {
      title: "Số SP",
      dataIndex: "productsCount",
      key: "productsCount",
      width: 90,
      sorter: (a: CategoryItem, b: CategoryItem) => a.productsCount - b.productsCount,
      render: (v: number) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Đã bán",
      dataIndex: "soldQty",
      key: "soldQty",
      width: 110,
      sorter: (a: CategoryItem, b: CategoryItem) => a.soldQty - b.soldQty,
      render: (v: number) => <Tag color="geekblue">{v}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: CategoryStatus) => (
        <Badge
          status={status === "Hiển thị" ? "success" : "default"}
          text={status}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: CategoryItem) => (
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
        <Table columns={columns} dataSource={filteredCategories} rowKey="id" />
      </Card>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={720}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
              >
                <Input placeholder="Ví dụ: Làm sạch" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productsCount"
                label="Số sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập số sản phẩm" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
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
              <Form.Item name="status" label="Trạng thái" initialValue="Hiển thị">
                <Select
                  options={[
                    { value: "Hiển thị", label: "Hiển thị" },
                    { value: "Ẩn", label: "Ẩn" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hình ảnh">
                <Upload listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementComponent;
