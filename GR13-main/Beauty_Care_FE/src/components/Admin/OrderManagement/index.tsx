import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip as AntdTooltip,
  Typography,
  message,
} from "antd";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  SearchOutlined,
  SyncOutlined,
  TruckOutlined,
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
import "./style.scss";

const { Title, Text } = Typography;

type Period = "week" | "month" | "year";

type OrderStatus =
  | "Chờ xác nhận"
  | "Đang soạn hàng"
  | "Đang giao"
  | "Thành công"
  | "Thất bại";

type PaymentStatus = "Đã thanh toán" | "Chưa thanh toán";

type OrderType = "Đơn thường" | "Đơn đặt biệt";

interface OrderItemLine {
  name: string;
  qty: number;
  price: number;
}

interface OrderItem {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderType: OrderType;
  createdAt: string;
  total: number;
  note?: string;
  lines: OrderItemLine[];
}

const statusBadge = (status: OrderStatus) => {
  if (status === "Thành công") return <Badge status="success" text={status} />;
  if (status === "Đang giao") return <Badge status="processing" text={status} />;
  if (status === "Thất bại") return <Badge status="error" text={status} />;
  if (status === "Đang soạn hàng") return <Badge status="warning" text={status} />;
  return <Badge status="default" text={status} />;
};

const paymentTag = (payment: PaymentStatus) => {
  return (
    <Tag color={payment === "Đã thanh toán" ? "green" : "red"}>{payment}</Tag>
  );
};

const OrderManagementComponent: React.FC = () => {
  const [period, setPeriod] = useState<Period>("week");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [search, setSearch] = useState("");

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm] = Form.useForm();

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 1,
      code: "BC-OD-0001",
      customerName: "Nguyễn Thị Lan",
      phone: "0912345678",
      address: "Q.1, TP.HCM",
      status: "Chờ xác nhận",
      paymentStatus: "Chưa thanh toán",
      orderType: "Đơn thường",
      createdAt: "Hôm nay 09:40",
      total: 980000,
      note: "Giao giờ hành chính",
      lines: [
        { name: "Sữa rửa mặt Cetaphil", qty: 1, price: 280000 },
        { name: "Kem chống nắng La Roche-Posay", qty: 1, price: 700000 },
      ],
    },
    {
      id: 2,
      code: "BC-OD-0002",
      customerName: "Trần Minh Tâm",
      phone: "0987654321",
      address: "Q.7, TP.HCM",
      status: "Đang soạn hàng",
      paymentStatus: "Đã thanh toán",
      orderType: "Đơn đặt biệt",
      createdAt: "Hôm nay 11:05",
      total: 820000,
      lines: [{ name: "Serum B5 La Roche-Posay", qty: 1, price: 820000 }],
    },
    {
      id: 3,
      code: "BC-OD-0003",
      customerName: "Lê Hồng Nhung",
      phone: "0909090909",
      address: "Thủ Đức, TP.HCM",
      status: "Đang giao",
      paymentStatus: "Chưa thanh toán",
      orderType: "Đơn thường",
      createdAt: "Hôm qua 16:20",
      total: 560000,
      lines: [{ name: "Nước tẩy trang Bioderma", qty: 2, price: 280000 }],
    },
    {
      id: 4,
      code: "BC-OD-0004",
      customerName: "Phạm Minh D",
      phone: "0911223344",
      address: "Đà Nẵng",
      status: "Thành công",
      paymentStatus: "Đã thanh toán",
      orderType: "Đơn thường",
      createdAt: "3 ngày trước",
      total: 1200000,
      lines: [
        { name: "Serum B5 The Ordinary", qty: 1, price: 450000 },
        { name: "Kem dưỡng ẩm", qty: 1, price: 750000 },
      ],
    },
    {
      id: 5,
      code: "BC-OD-0005",
      customerName: "Nguyễn Văn A",
      phone: "0900000000",
      address: "Hà Nội",
      status: "Thất bại",
      paymentStatus: "Chưa thanh toán",
      orderType: "Đơn đặt biệt",
      createdAt: "1 tuần trước",
      total: 380000,
      note: "Sai địa chỉ giao",
      lines: [{ name: "Sữa rửa mặt", qty: 1, price: 380000 }],
    },
  ]);

  const statusCounts = useMemo(() => {
    const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
    return {
      success: count("Thành công"),
      delivering: count("Đang giao"),
      failed: count("Thất bại"),
      packing: count("Đang soạn hàng"),
    };
  }, [orders]);

  const chartByPeriod = useMemo(() => {
    const week = [
      { name: "T2", success: 8, delivering: 5, failed: 1, packing: 6 },
      { name: "T3", success: 10, delivering: 7, failed: 2, packing: 8 },
      { name: "T4", success: 6, delivering: 8, failed: 1, packing: 9 },
      { name: "T5", success: 12, delivering: 6, failed: 1, packing: 7 },
      { name: "T6", success: 9, delivering: 9, failed: 3, packing: 6 },
      { name: "T7", success: 14, delivering: 10, failed: 2, packing: 8 },
      { name: "CN", success: 11, delivering: 8, failed: 1, packing: 5 },
    ];
    const month = [
      { name: "Tuần 1", success: 38, delivering: 24, failed: 6, packing: 21 },
      { name: "Tuần 2", success: 42, delivering: 30, failed: 5, packing: 18 },
      { name: "Tuần 3", success: 35, delivering: 28, failed: 7, packing: 25 },
      { name: "Tuần 4", success: 49, delivering: 32, failed: 4, packing: 19 },
    ];
    const year = [
      { name: "Tháng 1", success: 150, delivering: 92, failed: 18, packing: 70 },
      { name: "Tháng 2", success: 138, delivering: 88, failed: 22, packing: 65 },
      { name: "Tháng 3", success: 165, delivering: 104, failed: 16, packing: 72 },
      { name: "Tháng 4", success: 172, delivering: 110, failed: 20, packing: 78 },
      { name: "Tháng 5", success: 160, delivering: 98, failed: 19, packing: 74 },
      { name: "Tháng 6", success: 180, delivering: 120, failed: 15, packing: 80 },
    ];
    return { week, month, year } satisfies Record<Period, any[]>;
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const okStatus = statusFilter === "all" ? true : o.status === statusFilter;
      const okPayment =
        paymentFilter === "all" ? true : o.paymentStatus === paymentFilter;
      const okSearch =
        !q ||
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q);
      return okStatus && okPayment && okSearch;
    });
  }, [orders, paymentFilter, search, statusFilter]);

  const openDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const updateStatus = (id: number, status: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    message.success("Đã cập nhật trạng thái đơn hàng");
  };

  const deleteOrder = (id: number) => {
    Modal.confirm({
      title: "Xóa đơn hàng?",
      content: "Thao tác này sẽ xóa đơn hàng khỏi danh sách quản trị.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setOrders(orders.filter((o) => o.id !== id));
        message.success("Đã xóa đơn hàng");
      },
    });
  };

  const openCreate = () => {
    createForm.resetFields();
    createForm.setFieldsValue({
      code: `BC-OD-${String(Date.now()).slice(-4)}`,
      orderType: "Đơn thường",
      paymentStatus: "Chưa thanh toán",
      status: "Chờ xác nhận",
      createdAt: dayjs(),
    });
    setIsCreateOpen(true);
  };

  const createOrder = () => {
    createForm.validateFields().then((values) => {
      const nextId = Date.now();
      const newOrder: OrderItem = {
        id: nextId,
        code: values.code,
        customerName: values.customerName,
        phone: values.phone,
        address: values.address,
        orderType: values.orderType,
        paymentStatus: values.paymentStatus,
        status: values.status,
        createdAt: values.createdAt.format("DD/MM/YYYY HH:mm"),
        total: values.total,
        note: values.note,
        lines: [],
      };
      setOrders([newOrder, ...orders]);
      setIsCreateOpen(false);
      message.success("Đã tạo đơn hàng");
    });
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      width: 130,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      ellipsis: true,
      render: (_: unknown, r: OrderItem) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.customerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {r.phone}
          </Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (s: OrderStatus) => statusBadge(s),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 150,
      render: (p: PaymentStatus) => paymentTag(p),
    },
    {
      title: "Loại",
      dataIndex: "orderType",
      key: "orderType",
      width: 120,
      render: (t: OrderType) => (
        <Tag color={t === "Đơn đặt biệt" ? "purple" : "default"}>{t}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 140,
      sorter: (a: OrderItem, b: OrderItem) => a.total - b.total,
      render: (v: number) => <Text strong>{v.toLocaleString()}đ</Text>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 260,
      render: (_: unknown, r: OrderItem) => (
        <Space size={8} className="order-actions">
          <AntdTooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => openDetails(r)} />
          </AntdTooltip>

          {r.status === "Chờ xác nhận" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => updateStatus(r.id, "Đang soạn hàng")}
            >
              Duyệt
            </Button>
          )}

          {r.status === "Đang soạn hàng" && (
            <Button
              icon={<InboxOutlined />}
              onClick={() => updateStatus(r.id, "Đang giao")}
            >
              Bàn giao
            </Button>
          )}

          {r.status === "Đang giao" && (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: "success",
                    label: "Giao thành công",
                    icon: <TruckOutlined />,
                  },
                  {
                    key: "failed",
                    label: "Giao thất bại",
                    icon: <CloseCircleOutlined />,
                    danger: true,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "success") updateStatus(r.id, "Thành công");
                  if (key === "failed") updateStatus(r.id, "Thất bại");
                },
              }}
            >
              <Button icon={<TruckOutlined />}>Cập nhật</Button>
            </Dropdown>
          )}

          <AntdTooltip title="Xóa đơn">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteOrder(r.id)}
            />
          </AntdTooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-management">
      <Title level={2}>Quản lý đơn hàng</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="order-stat-card">
            <Statistic
              title="Giao thành công"
              value={statusCounts.success}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="order-stat-card">
            <Statistic
              title="Đang giao"
              value={statusCounts.delivering}
              prefix={<SyncOutlined spin style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="order-stat-card">
            <Statistic
              title="Giao thất bại"
              value={statusCounts.failed}
              prefix={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="order-stat-card">
            <Statistic
              title="Đang soạn hàng"
              value={statusCounts.packing}
              prefix={<InboxOutlined style={{ color: "#faad14" }} />}
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
                  <BarChartOutlined /> Thống kê đơn theo trạng thái
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
                <BarChart data={chartByPeriod[period]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="packing" fill="#faad14" name="Đang soạn hàng" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="delivering" fill="#1890ff" name="Đang giao" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="success" fill="#52c41a" name="Thành công" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="failed" fill="#f5222d" name="Thất bại" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Duyệt & quản lý đơn hàng"
        bordered={false}
        extra={
          <Space wrap>
            <Select
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              style={{ width: 170 }}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "Chờ xác nhận", label: "Chờ xác nhận" },
                { value: "Đang soạn hàng", label: "Đang soạn hàng" },
                { value: "Đang giao", label: "Đang giao" },
                { value: "Thành công", label: "Thành công" },
                { value: "Thất bại", label: "Thất bại" },
              ]}
            />
            <Select
              value={paymentFilter}
              onChange={(v) => setPaymentFilter(v)}
              style={{ width: 170 }}
              options={[
                { value: "all", label: "Tất cả thanh toán" },
                { value: "Đã thanh toán", label: "Đã thanh toán" },
                { value: "Chưa thanh toán", label: "Chưa thanh toán" },
              ]}
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm theo mã / tên / SĐT..."
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" onClick={openCreate}>
              Tạo đơn
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          size="small"
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={null}
        width={820}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Mã đơn">
                <Text strong>{selectedOrder.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {selectedOrder.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {statusBadge(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {paymentTag(selectedOrder.paymentStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Loại đơn">
                <Tag color={selectedOrder.orderType === "Đơn đặt biệt" ? "purple" : "default"}>
                  {selectedOrder.orderType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong>{selectedOrder.total.toLocaleString()}đ</Text>
              </Descriptions.Item>
            </Descriptions>

            {selectedOrder.note && (
              <>
                <Divider />
                <Text type="secondary">Ghi chú:</Text>
                <div style={{ marginTop: 6 }}>{selectedOrder.note}</div>
              </>
            )}

            <Divider />
            <Title level={5} style={{ marginTop: 0 }}>
              Sản phẩm trong đơn
            </Title>
            {selectedOrder.lines.length === 0 ? (
              <Text type="secondary">Đơn này được tạo thủ công (chưa có dòng sản phẩm).</Text>
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey={(r) => r.name}
                dataSource={selectedOrder.lines}
                columns={[
                  { title: "Sản phẩm", dataIndex: "name", key: "name", ellipsis: true },
                  { title: "SL", dataIndex: "qty", key: "qty", width: 80 },
                  {
                    title: "Đơn giá",
                    dataIndex: "price",
                    key: "price",
                    width: 140,
                    render: (v: number) => `${v.toLocaleString()}đ`,
                  },
                  {
                    title: "Thành tiền",
                    key: "lineTotal",
                    width: 140,
                    render: (_: unknown, r: OrderItemLine) =>
                      `${(r.qty * r.price).toLocaleString()}đ`,
                  },
                ]}
              />
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Tạo đơn hàng"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={createOrder}
        okText="Tạo"
        cancelText="Hủy"
        width={720}
      >
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã đơn"
                rules={[{ required: true, message: "Nhập mã đơn" }]}
              >
                <Input placeholder="Ví dụ: BC-OD-0006" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[{ required: true, message: "Nhập tên khách hàng" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="total"
                label="Tổng tiền (đ)"
                rules={[{ required: true, message: "Nhập tổng tiền" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ giao"
            rules={[{ required: true, message: "Nhập địa chỉ giao" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Thời gian tạo đơn"
            rules={[{ required: true, message: "Chọn thời gian tạo đơn" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày và giờ"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="orderType" label="Loại đơn">
                <Select
                  options={[
                    { value: "Đơn thường", label: "Đơn thường" },
                    { value: "Đơn đặt biệt", label: "Đơn đặt biệt" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentStatus" label="Thanh toán">
                <Select
                  options={[
                    { value: "Chưa thanh toán", label: "Chưa thanh toán" },
                    { value: "Đã thanh toán", label: "Đã thanh toán" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  options={[
                    { value: "Chờ xác nhận", label: "Chờ xác nhận" },
                    { value: "Đang soạn hàng", label: "Đang soạn hàng" },
                    { value: "Đang giao", label: "Đang giao" },
                    { value: "Thành công", label: "Thành công" },
                    { value: "Thất bại", label: "Thất bại" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="note" label="Ghi chú">
            <Input placeholder="Tuỳ chọn" />
          </Form.Item>
          <Text type="secondary">
            Không có chức năng sửa nội dung đơn (sản phẩm trong đơn). Bạn chỉ duyệt
            và cập nhật trạng thái/ thanh toán.
          </Text>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagementComponent;
