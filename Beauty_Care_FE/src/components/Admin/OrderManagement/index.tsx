import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  ReloadOutlined,
  DownloadOutlined,
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./style.scss";

const { Title, Text } = Typography;

type Period = "week" | "month" | "year" | "custom";

type OrderStatus = "pending" | "paid" | "shipping" | "completed" | "cancelled";

type PaymentStatus = string;

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
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderType: OrderType;
  createdAt: string;
  total: number;
  note?: string;
  lines: OrderItemLine[];
}

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "thành công")
    return <Badge status="success" text="Thành công" />;
  if (s === "shipping" || s === "đang giao")
    return <Badge status="processing" text="Đang giao" />;
  if (s === "cancelled" || s === "thất bại")
    return <Badge status="error" text="Đã hủy" />;
  if (s === "paid" || s === "đang soạn hàng")
    return <Badge status="warning" text="Đang soạn hàng" />;
  return <Badge status="default" text="Chờ xác nhận" />;
};

const paymentTag = (status: string) => {
  const s = status?.toLowerCase();
  const isPaid = s === "paid" || s === "shipping" || s === "completed";
  return (
    <Tag color={isPaid ? "green" : "red"}>
      {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
    </Tag>
  );
};

const OrderManagementComponent: React.FC = () => {
  const [period, setPeriod] = useState<Period>("week");
  const [customDateRange, setCustomDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<string | "all">("all");
  const [search, setSearch] = useState("");

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await (
        await import("../../../api/order")
      ).getAllOrdersAdmin();
      if (res?.err === 0) {
        const transformedData = (res.data || []).map((order: any) => ({
          id: order.id,
          code: order.orderCode ? `#${order.orderCode}` : `BC-OD-${order.id}`,
          customerName: order.userData
            ? `${order.userData.firstName} ${order.userData.lastName}`
            : "Khách hàng",
          phone: order.phone || order.userData?.Phone || "N/A",
          address: order.shippingAddress || "N/A",
          status: order.status,
          paymentStatus: order.status,
          paymentMethod: order.paymentMethod,
          orderType:
            order.paymentMethod === "COD" ? "Đơn thường" : "Đơn đặt biệt",
          createdAt: dayjs(order.createdAt).format("DD/MM/YYYY HH:mm"),
          total: Number(order.totalAmount),
          note: order.note || "",
          lines:
            order.orderItems?.map((item: any) => ({
              name: item.productData?.name || "Sản phẩm",
              qty: item.quantity,
              price: Number(item.price),
            })) || [],
        }));
        setOrders(transformedData);
        // Tự động kiểm tra thanh toán cho các đơn hàng PAYOS đang pending
        const pendingPayOSOrders = transformedData.filter(
          (o: any) =>
            o.status === "pending" &&
            o.paymentMethod?.toUpperCase() === "PAYOS",
        );

        if (pendingPayOSOrders.length > 0) {
          message.loading({
            content: "Đang tự động kiểm tra trạng thái thanh toán...",
            key: "autoVerify",
          });

          Promise.all(
            pendingPayOSOrders.map((o: any) =>
              import("../../../api/payment").then((api) =>
                api.verifyPayment(o.id),
              ),
            ),
          ).then((results) => {
            const updatedCount = results.filter(
              (r) => r?.err === 0 && r?.data?.status === "PAID",
            ).length;
            if (updatedCount > 0) {
              message.success({
                content: `Đã tự động cập nhật ${updatedCount} đơn hàng thanh toán thành công`,
                key: "autoVerify",
              });
              // Refresh lại danh sách sau khi verify xong
              fetchOrders();
            } else {
              message.destroy("autoVerify");
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusCounts = useMemo(() => {
    const count = (s: string) =>
      orders.filter((o) => o.status?.toLowerCase() === s.toLowerCase()).length;
    return {
      success: count("completed"),
      delivering: count("shipping"),
      failed: count("cancelled"),
      packing: count("paid"),
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
      {
        name: "Tháng 1",
        success: 150,
        delivering: 92,
        failed: 18,
        packing: 70,
      },
      {
        name: "Tháng 2",
        success: 138,
        delivering: 88,
        failed: 22,
        packing: 65,
      },
      {
        name: "Tháng 3",
        success: 165,
        delivering: 104,
        failed: 16,
        packing: 72,
      },
      {
        name: "Tháng 4",
        success: 172,
        delivering: 110,
        failed: 20,
        packing: 78,
      },
      {
        name: "Tháng 5",
        success: 160,
        delivering: 98,
        failed: 19,
        packing: 74,
      },
      {
        name: "Tháng 6",
        success: 180,
        delivering: 120,
        failed: 15,
        packing: 80,
      },
    ];
    const custom = [
      { name: "15/04", success: 10, delivering: 6, failed: 1, packing: 7 },
      { name: "16/04", success: 12, delivering: 8, failed: 2, packing: 9 },
      { name: "17/04", success: 8, delivering: 7, failed: 1, packing: 8 },
      { name: "18/04", success: 14, delivering: 9, failed: 1, packing: 10 },
      { name: "19/04", success: 11, delivering: 8, failed: 2, packing: 8 },
    ];
    return { week, month, year, custom } satisfies Record<Period, any[]>;
  }, []);

  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (statusFilter !== "all") {
      data = data.filter(
        (o) => o.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    if (paymentFilter !== "all") {
      data = data.filter((o) => {
        const s = o.status?.toLowerCase();
        const isPaid = s === "paid" || s === "shipping" || s === "completed";
        const target = paymentFilter === "Đã thanh toán";
        return isPaid === target;
      });
    }
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.code.toLowerCase().includes(s) ||
          o.customerName.toLowerCase().includes(s) ||
          o.phone.toLowerCase().includes(s),
      );
    }
    return data;
  }, [orders, statusFilter, paymentFilter, search]);

  const openDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await (
        await import("../../../api/order")
      ).updateOrderStatusAdmin(Number(id), status);
      if (res?.err === 0) {
        setOrders(
          orders.map((o) =>
            o.id === id ? { ...o, status: status, paymentStatus: status } : o,
          ),
        );
        message.success("Đã cập nhật trạng thái đơn hàng");
      } else {
        message.error(res?.mess || "Lỗi cập nhật");
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi cập nhật");
    }
  };

  const handleVerifyPayment = async (orderId: number) => {
    try {
      const res = await (
        await import("../../../api/payment")
      ).verifyPayment(orderId);
      if (res?.err === 0) {
        if (res.data?.status === "PAID") {
          message.success("Thanh toán đã được xác nhận thành công!");
        } else {
          message.info(`Trạng thái thanh toán hiện tại: ${res.data?.status}`);
        }
        fetchOrders();
      } else {
        message.error(res?.mess || "Kiểm tra thanh toán thất bại");
      }
    } catch (e) {
      console.error(e);
      message.error("Có lỗi xảy ra khi kiểm tra thanh toán");
    }
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
      paymentStatus: "pending",
      paymentMethod: "COD",
      status: "pending",
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
        paymentMethod: values.paymentMethod,
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

  const getStatusText = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "completed" || s === "thành công") return "Thành công";
    if (s === "shipping" || s === "đang giao") return "Đang giao";
    if (s === "cancelled" || s === "thất bại") return "Đã hủy";
    if (s === "paid" || s === "đang soạn hàng") return "Đang soạn hàng";
    return "Chờ xác nhận";
  };

  const getPaymentText = (status: string) => {
    const s = status?.toLowerCase();
    const isPaid = s === "paid" || s === "shipping" || s === "completed";
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh_sach_don_hang");

      worksheet.properties.defaultRowHeight = 20;
      worksheet.views = [{ state: 'frozen', ySplit: 3 }];
      worksheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: 3, column: 11 }
      };

      const titleRow1 = worksheet.addRow(["BÁO CÁO DANH SÁCH ĐƠN HÀNG"]);
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
        "Mã đơn",
        "Khách hàng",
        "Số điện thoại",
        "Địa chỉ",
        "Trạng thái",
        "Thanh toán",
        "Loại đơn",
        "Tổng tiền",
        "Thời gian",
        "Ghi chú"
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

      filteredOrders.forEach((order, index) => {
        const row = worksheet.addRow([
          order.id,
          order.code,
          order.customerName,
          order.phone,
          order.address,
          getStatusText(order.status),
          getPaymentText(order.status),
          order.orderType,
          Number(order.total || 0),
          order.createdAt,
          order.note || ""
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

          if (colNumber === 9) {
            cell.alignment = { vertical: "middle", horizontal: "right" };
            cell.numFmt = '#,##0"đ"';
          } else if (colNumber === 1 || colNumber === 2) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }
        });
      });

      worksheet.columns = [
        { width: 8 },
        { width: 18 },
        { width: 25 },
        { width: 15 },
        { width: 40 },
        { width: 15 },
        { width: 18 },
        { width: 15 },
        { width: 18 },
        { width: 20 },
        { width: 30 }
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fileName = `Bao_cao_don_hang_${dayjs().format('DDMMYYYY_HHmmss')}.xlsx`;
      saveAs(blob, fileName);
      message.success("Đã xuất file Excel chuyên nghiệp thành công!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Lỗi khi xuất file Excel!");
    }
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
      render: (s: string) => statusBadge(s),
    },
    {
      title: "Thanh toán",
      dataIndex: "status",
      key: "paymentStatus",
      width: 150,
      render: (s: string) => paymentTag(s),
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
      sorter: (a: OrderItem, b: OrderItem) => (a.total || 0) - (b.total || 0),
      render: (v: number) => (
        <Text strong>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(v || 0))}
        </Text>
      ),
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

          {r.paymentMethod === "PAYOS" && r.status === "pending" && (
            <AntdTooltip title="Kiểm tra thanh toán">
              <Button
                icon={<ReloadOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleVerifyPayment(r.id)}
              />
            </AntdTooltip>
          )}

          {r.status === "pending" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => updateStatus(r.id, "paid")}
            >
              Duyệt
            </Button>
          )}

          {r.status === "paid" && (
            <Button
              icon={<InboxOutlined />}
              onClick={() => updateStatus(r.id, "shipping")}
            >
              Bàn giao
            </Button>
          )}

          {r.status === "shipping" && (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: "completed",
                    label: "Giao thành công",
                    icon: <TruckOutlined />,
                    onClick: () => updateStatus(r.id, "completed"),
                  },
                  {
                    key: "cancelled",
                    label: "Giao thất bại",
                    icon: <CloseCircleOutlined />,
                    onClick: () => updateStatus(r.id, "cancelled"),
                  },
                ],
              }}
            >
              <Button icon={<SyncOutlined />}>Cập nhật vận chuyển</Button>
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
                <Space>
                  <Select
                    value={period}
                    onChange={(v) => setPeriod(v)}
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
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={chartByPeriod[period]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="packing"
                    fill="#faad14"
                    name="Đang soạn hàng"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="delivering"
                    fill="#1890ff"
                    name="Đang giao"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="success"
                    fill="#52c41a"
                    name="Thành công"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="failed"
                    fill="#f5222d"
                    name="Thất bại"
                    radius={[6, 6, 0, 0]}
                  />
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
                { value: "pending", label: "Chờ xác nhận" },
                { value: "paid", label: "Đang soạn hàng" },
                { value: "shipping", label: "Đang giao" },
                { value: "completed", label: "Thành công" },
                { value: "cancelled", label: "Thất bại" },
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
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              Xuất Excel
            </Button>
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
                <Tag
                  color={
                    selectedOrder.orderType === "Đơn đặt biệt"
                      ? "purple"
                      : "default"
                  }
                >
                  {selectedOrder.orderType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <Text type="danger" strong style={{ fontSize: 18 }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(selectedOrder.total || 0))}
                </Text>
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
              <Text type="secondary">
                Đơn này được tạo thủ công (chưa có dòng sản phẩm).
              </Text>
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey={(r) => r.name}
                dataSource={selectedOrder.lines}
                columns={[
                  {
                    title: "Sản phẩm",
                    dataIndex: "name",
                    key: "name",
                    ellipsis: true,
                  },
                  { title: "SL", dataIndex: "qty", key: "qty", width: 80 },
                  {
                    title: "Đơn giá",
                    dataIndex: "price",
                    key: "price",
                    width: 140,
                    render: (v: number) => (
                      <Text>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(v || 0))}
                      </Text>
                    ),
                  },
                  {
                    title: "Thành tiền",
                    key: "lineTotal",
                    width: 140,
                    render: (_: unknown, r: OrderItemLine) => (
                      <Text strong>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number((r.qty || 0) * (r.price || 0)))}
                      </Text>
                    ),
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
            <Col span={12}>
              <Form.Item name="orderType" label="Loại đơn">
                <Select
                  options={[
                    { value: "Đơn thường", label: "Đơn thường" },
                    { value: "Đơn đặt biệt", label: "Đơn đặt biệt" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                <Select
                  options={[
                    { value: "COD", label: "Tiền mặt (COD)" },
                    { value: "PAYOS", label: "Chuyển khoản (PayOS)" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="paymentStatus" label="Thanh toán">
                <Select
                  options={[
                    { value: "pending", label: "Chưa thanh toán" },
                    { value: "paid", label: "Đã thanh toán" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  options={[
                    { value: "pending", label: "Chờ xác nhận" },
                    { value: "paid", label: "Đang soạn hàng" },
                    { value: "shipping", label: "Đang giao" },
                    { value: "completed", label: "Thành công" },
                    { value: "cancelled", label: "Thất bại" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="note" label="Ghi chú">
            <Input placeholder="Tuỳ chọn" />
          </Form.Item>
          <Text type="secondary">
            Không có chức năng sửa nội dung đơn (sản phẩm trong đơn). Bạn chỉ
            duyệt và cập nhật trạng thái/ thanh toán.
          </Text>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagementComponent;
