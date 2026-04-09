import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Spin,
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
import {
  useGetProducts,
  useGetCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../hooks/product";
import type { IProduct } from "../../../api/product";

const { Title, Text } = Typography;

const ProductManagementComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: productsRes, isLoading: isLoadingProducts } = useGetProducts();
  const { data: categoriesRes } = useGetCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setEditingProduct(null);
      form.resetFields();
      setIsModalVisible(true);
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, form]);

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

  // Mock data for Stats by Period (keep for UI)
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

  const handleEdit = (record: IProduct) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk: async () => {
        try {
          await deleteProductMutation.mutateAsync(id);
          message.success("Đã xóa sản phẩm");
        } catch (error) {
          message.error("Lỗi khi xóa sản phẩm");
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingProduct) {
          // Chỉ gửi các trường cần thiết khi cập nhật
          await updateProductMutation.mutateAsync({
            id: editingProduct.id,
            ...values,
          });
          message.success("Đã cập nhật sản phẩm");
        } else {
          await createProductMutation.mutateAsync({
            ...values,
            image: values.image || "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + Date.now(),
          });
          message.success("Đã thêm sản phẩm mới");
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (src: string) => (
        <Image
          src={src}
          width={40}
          height={40}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string) => (
        <div style={{ width: 180 }}>
          <Text strong ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: 120,
      render: (text: string) => (
        <div style={{ width: 100 }}>
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["categoryData", "name"],
      key: "category",
      width: 140,
      render: (catName: string) => (
        <Tag
          color="blue"
          style={{
            marginRight: 0,
            maxWidth: "130px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <Text ellipsis={{ tooltip: catName }} style={{ color: "inherit" }}>
            {catName || "N/A"}
          </Text>
        </Tag>
      ),
    },
    {
      title: "Giá",
      key: "price",
      width: 110,
      render: (_: any, record: IProduct) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <Space direction="vertical" size={0}>
            {record.discountPrice && record.discountPrice < record.price ? (
              <>
                <Text delete type="secondary" style={{ fontSize: 11 }}>
                  {Number(record.price).toLocaleString()}đ
                </Text>
                <Text strong type="danger" style={{ fontSize: 13 }}>
                  {Number(record.discountPrice).toLocaleString()}đ
                </Text>
              </>
            ) : (
              <Text strong>{Number(record.price).toLocaleString()}đ</Text>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: "Tồn",
      dataIndex: "stock",
      key: "stock",
      width: 60,
      sorter: (a: IProduct, b: IProduct) => a.stock - b.stock,
      render: (stock: number) => (
        <Text type={stock < 10 ? "danger" : "secondary"}>{stock}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <Badge
            status={status === "active" ? "success" : "error"}
            text={status === "active" ? "Đang bán" : "Ẩn"}
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_: any, record: IProduct) => (
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
    <div className="product-management">
      <Title level={2}>Quản lý sản phẩm</Title>

      {/* Chart Section */}
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
                  <BarChartOutlined /> Thống kê Nhập - Xuất hàng hóa
                </Space>
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
                  <Bar
                    dataKey="import"
                    fill="#52c41a"
                    name="Nhập kho"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sold"
                    fill="#1890ff"
                    name="Đã bán"
                    radius={[4, 4, 0, 0]}
                  />
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
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm sản phẩm..."
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm sản phẩm
            </Button>
          </Space>
        }
      >
        <Spin spinning={isLoadingProducts}>
          <Table columns={columns} dataSource={filteredProducts} rowKey="id" />
        </Spin>
      </Card>

      {/* Modal CRUD */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        confirmLoading={
          createProductMutation.isPending || updateProductMutation.isPending
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="brand"
                label="Thương hiệu"
                rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
              >
                <Input placeholder="Ví dụ: Cetaphil, Olay..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usage" label="Công dụng">
                <Input placeholder="Ví dụ: Dưỡng ẩm, sạch sâu..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stock" label="Số lượng tồn">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
            className="quill-editor-item"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
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
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá gốc (đ)"
                rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discountPrice" label="Giá khuyến mãi (đ)">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="active"
              >
                <Select>
                  <Select.Option value="active">Đang bán</Select.Option>
                  <Select.Option value="inactive">Ẩn</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Link hình ảnh (Tạm thời)">
            <Input placeholder="Nhập link hình ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementComponent;
