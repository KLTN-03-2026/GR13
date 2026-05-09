import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
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
  message,
  Image,
  Tag,
  Select,
  Badge,
  Spin,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BarChartOutlined,
  DownloadOutlined,
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
import { useGetAnalyticsStats } from "../../../hooks/admin";
import type { IProduct } from "../../../api/product";

const { Title, Text } = Typography;

const ProductManagementComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year" | "custom">("week");
  const [customDateRange, setCustomDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: productsRes, isLoading: isLoadingProducts } = useGetProducts();
  const { data: categoriesRes } = useGetCategories();
  const { data: analyticsRes, isLoading: isLoadingAnalytics } = useGetAnalyticsStats() as any;
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const analytics = (analyticsRes as any)?.data;

  const defaultImportExport = { week: [], month: [], year: [], custom: [] };
  const statsDataByPeriod = useMemo(() => {
    if (!analytics?.importExportData) {
      return defaultImportExport;
    }
    return analytics.importExportData;
  }, [analytics]);

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

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setSearchText("");
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
        console.log("Creating/Updating product with values:", values);
        
        if (editingProduct) {
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
        
        setSearchText("");
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error creating/updating product:", error);
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh_sach_san_pham");

      worksheet.properties.defaultRowHeight = 20;
      worksheet.views = [{ state: "frozen", ySplit: 3 }];
      worksheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: 3, column: 11 }
      };

      const titleRow1 = worksheet.addRow(["BÁO CÁO DANH SÁCH SẢN PHẨM"]);
      titleRow1.font = { 
        size: 18, 
        bold: true, 
        color: { argb: "FF1F4E79" } 
      };
      titleRow1.alignment = { 
        vertical: "middle", 
        horizontal: "center" 
      };
      worksheet.mergeCells("A1:K1");

      const titleRow2 = worksheet.addRow([`Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`]);
      titleRow2.font = { 
        size: 12, 
        italic: true, 
        color: { argb: "FF666666" } 
      };
      titleRow2.alignment = { 
        vertical: "middle", 
        horizontal: "center" 
      };
      worksheet.mergeCells("A2:K2");

      const headers = [
        "ID",
        "Tên sản phẩm",
        "Thương hiệu",
        "Danh mục",
        "Công dụng",
        "Giá gốc",
        "Giá khuyến mãi",
        "Số lượng tồn",
        "Trạng thái",
        "Ngày tạo",
        "Ngày cập nhật"
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.height = 30;

      const headerStyle = {
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F4E79" }
        },
        font: {
          bold: true,
          size: 11,
          color: { argb: "FFFFFFFF" }
        },
        alignment: {
          vertical: "middle",
          horizontal: "center",
          wrapText: true
        },
        border: {
          top: { style: "thin", color: { argb: "FFFFFFFF" } },
          left: { style: "thin", color: { argb: "FFFFFFFF" } },
          bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
          right: { style: "thin", color: { argb: "FFFFFFFF" } }
        }
      };

      headerRow.eachCell((cell) => {
        Object.assign(cell, headerStyle);
      });

      filteredProducts.forEach((product, index) => {
        const row = worksheet.addRow([
          product.id,
          product.name,
          product.brand || "N/A",
          product.categoryData?.name || "N/A",
          product.usage || "N/A",
          product.price,
          product.discountPrice || 0,
          product.stock,
          product.status === "active" ? "Đang bán" : "Ẩn",
          product.createdAt ? dayjs(product.createdAt).format("DD/MM/YYYY HH:mm") : "N/A",
          product.updatedAt ? dayjs(product.updatedAt).format("DD/MM/YYYY HH:mm") : "N/A"
        ]);

        row.height = 22;

        const isEven = index % 2 === 0;
        const rowFillColor = isEven ? { argb: "FFF5F8FA" } : { argb: "FFFFFFFF" };

        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD0D7E3" } },
            left: { style: "thin", color: { argb: "FFD0D7E3" } },
            bottom: { style: "thin", color: { argb: "FFD0D7E3" } },
            right: { style: "thin", color: { argb: "FFD0D7E3" } }
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: rowFillColor
          };

          if (colNumber === 6 || colNumber === 7) {
            cell.alignment = { vertical: "middle", horizontal: "right" };
            cell.numFmt = '#,##0"đ"';
          } else if (colNumber === 1 || colNumber === 8) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }

          if (colNumber === 8 && product.stock < 10) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFE6E6" }
            };
            cell.font = { color: { argb: "FFC00000" }, bold: true };
          }

          if (colNumber === 9) {
            if (product.status === "active") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE6FFE6" }
              };
              cell.font = { color: { argb: "FF007A33" }, bold: true };
            } else {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFF0E6" }
              };
              cell.font = { color: { argb: "FFCC6600" }, bold: true };
            }
          }
        });
      });

      worksheet.columns = [
        { width: 8 },
        { width: 35 },
        { width: 18 },
        { width: 18 },
        { width: 25 },
        { width: 15 },
        { width: 18 },
        { width: 12 },
        { width: 12 },
        { width: 18 },
        { width: 18 }
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fileName = `Bao_cao_san_pham_${dayjs().format('DDMMYYYY_HHmmss')}.xlsx`;
      saveAs(blob, fileName);
      message.success("Đã xuất file Excel chuyên nghiệp thành công!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Lỗi khi xuất file Excel!");
    }
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
                <Space>
                  <Select
                    value={period}
                    onChange={(value) => setPeriod(value)}
                    style={{ width: 140 }}
                    options={[
                      { value: "week", label: "Xem Tuần" },
                      { value: "month", label: "Xem Tháng" },
                      { value: "year", label: "Xem Năm" },
                      { value: "custom", label: "Tùy chọn" },
                    ]}
                  />
                  {period === "custom" && (
                    <DatePicker.RangePicker
                      value={customDateRange}
                      onChange={(dates) => setCustomDateRange(dates)}
                      style={{ width: 250 }}
                      format="DD/MM/YYYY"
                    />
                  )}
                </Space>
              </div>
            }
            bordered={false}
          >
            <Spin spinning={isLoadingAnalytics} tip="Đang tải dữ liệu...">
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
                      dataKey="export"
                      fill="#1890ff"
                      name="Xuất kho (Bán ra)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Spin>
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
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              Xuất Excel
            </Button>
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
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item name="usage" label="Công dụng">
                <Input placeholder="Ví dụ: Dưỡng ẩm, sạch sâu..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="advice_id" label="Phân loại tư vấn (AI)">
                <Select placeholder="Chọn loại tư vấn">
                  <Select.Option value={1}>1 - Da khỏe mạnh</Select.Option>
                  <Select.Option value={2}>2 - Mụn sưng viêm</Select.Option>
                  <Select.Option value={3}>3 - Mụn đầu đen & Lỗ chân lông</Select.Option>
                  <Select.Option value={4}>4 - Thâm nám</Select.Option>
                  <Select.Option value={5}>5 - Lão hóa</Select.Option>
                  <Select.Option value={6}>6 - Da nhạy cảm</Select.Option>
                  <Select.Option value={7}>7 - Da khô</Select.Option>
                  <Select.Option value={8}>8 - Da dầu</Select.Option>
                  <Select.Option value={9}>9 - Hỗn hợp Thiên dầu</Select.Option>
                  <Select.Option value={10}>10 - Hỗn hợp Thiên khô</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
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
