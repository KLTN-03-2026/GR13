import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Upload,
  message,
  Image,
  Tag,
  Select,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./style.scss";

const { Title } = Typography;

const ProductManagementComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [form] = Form.useForm();

  // Quill modules configuration
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

  // Mock data for Products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Sữa rửa mặt Cetaphil",
      brand: "Cetaphil",
      category: "Làm sạch",
      description: "Dịu nhẹ cho da nhạy cảm",
      image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=1",
      oldPrice: 350000,
      newPrice: 280000,
      stock: 120,
      origin: "Canada",
      volume: "500ml",
      status: "Đang bán",
      importQty: 200,
      soldQty: 150,
    },
    {
      id: 2,
      name: "Serum B5 La Roche-Posay",
      brand: "La Roche-Posay",
      category: "Tinh chất",
      description: "Phục hồi da chuyên sâu",
      image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=2",
      oldPrice: 950000,
      newPrice: 820000,
      stock: 45,
      origin: "Pháp",
      volume: "30ml",
      status: "Bán chạy",
      importQty: 100,
      soldQty: 45,
    },
  ]);

  // Mock data for Stats by Period
  const statsDataByPeriod = {
    week: [
      { name: "T2", import: 45, sold: 32 },
      { name: "T3", import: 52, sold: 41 },
      { name: "T4", import: 38, sold: 45 },
      { name: "T5", import: 65, sold: 50 },
      { name: "T6", import: 48, sold: 38 },
      { name: "T7", import: 70, sold: 62 },
      { name: "CN", import: 55, sold: 48 },
    ],
    month: [
      { name: "Tuần 1", import: 320, sold: 280 },
      { name: "Tuần 2", import: 410, sold: 350 },
      { name: "Tuần 3", import: 380, sold: 420 },
      { name: "Tuần 4", import: 450, sold: 390 },
    ],
    year: [
      { name: "Tháng 1", import: 1200, sold: 950 },
      { name: "Tháng 2", import: 1100, sold: 1050 },
      { name: "Tháng 3", import: 1500, sold: 1300 },
      { name: "Tháng 4", import: 1300, sold: 1150 },
      { name: "Tháng 5", import: 1400, sold: 1200 },
      { name: "Tháng 6", import: 1600, sold: 1450 },
    ],
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk: () => {
        setProducts(products.filter((p) => p.id !== id));
        message.success("Đã xóa sản phẩm");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? { ...p, ...values } : p
          )
        );
        message.success("Đã cập nhật sản phẩm");
      } else {
        const newProduct = {
          id: Date.now(),
          ...values,
          image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + Date.now(),
          importQty: 0,
          soldQty: 0,
        };
        setProducts([...products, newProduct]);
        message.success("Đã thêm sản phẩm mới");
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (src: string) => <Image src={src} width={50} height={50} style={{ borderRadius: 4 }} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Giá",
      key: "price",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text delete type="secondary" style={{ fontSize: 12 }}>
            {record.oldPrice?.toLocaleString()}đ
          </Text>
          <Text strong type="danger">
            {record.newPrice?.toLocaleString()}đ
          </Text>
        </Space>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: any, b: any) => a.stock - b.stock,
      render: (stock: number) => (
        <Text type={stock < 10 ? "danger" : "secondary"}>{stock}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge 
          status={status === "Bán chạy" ? "warning" : status === "Hết hàng" ? "error" : "success"} 
          text={status} 
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
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

  const { Text } = Typography;

  return (
    <div className="product-management">
      <Title level={2}>Quản lý sản phẩm đang bán</Title>

      {/* Chart Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space><BarChartOutlined /> Thống kê Nhập - Xuất hàng hóa</Space>
                <Select
                  value={period}
                  onChange={(value) => setPeriod(value)}
                  style={{ width: 120 }}
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
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={statsDataByPeriod[period]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="import" fill="#52c41a" name="Nhập kho" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sold" fill="#1890ff" name="Đã bán" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Card
        title="Danh sách sản phẩm"
        bordered={false}
        extra={
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Tìm sản phẩm..." style={{ width: 250 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm sản phẩm
            </Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={products} rowKey="id" />
      </Card>

      {/* Modal CRUD */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}>
                <Input placeholder="Ví dụ: Cetaphil, Olay..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Chọn danh mục" }]}>
                <Select placeholder="Chọn danh mục">
                  <Select.Option value="Làm sạch">Làm sạch</Select.Option>
                  <Select.Option value="Tinh chất">Tinh chất</Select.Option>
                  <Select.Option value="Chống nắng">Chống nắng</Select.Option>
                  <Select.Option value="Trang điểm">Trang điểm</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="origin" label="Xuất xứ">
                <Input placeholder="Ví dụ: Pháp, Hàn Quốc..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="volume" label="Dung tích/Trọng lượng">
                <Input placeholder="Ví dụ: 50ml, 100g..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="description" 
            label="Mô tả sản phẩm"
            className="quill-editor-item"
          >
            <ReactQuill 
              theme="snow" 
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập mô tả chi tiết sản phẩm..."
              style={{ height: 250, marginBottom: 50 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="oldPrice" label="Giá gốc (đ)" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="newPrice" label="Giá bán (đ)" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="stock" label="Số lượng tồn" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Trạng thái" initialValue="Đang bán">
                <Select>
                  <Select.Option value="Đang bán">Đang bán</Select.Option>
                  <Select.Option value="Bán chạy">Bán chạy</Select.Option>
                  <Select.Option value="Hết hàng">Hết hàng</Select.Option>
                  <Select.Option value="Ẩn">Ẩn</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Hình ảnh sản phẩm">
            <Upload listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementComponent;
