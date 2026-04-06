import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
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
  Avatar,
  DatePicker,
  TimePicker,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  BarChartOutlined,
  TeamOutlined,
  PieChartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface BookingItem {
  id: number;
  customerName: string;
  customerAge: number;
  phone: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  status: BookingStatus;
  notes?: string;
  visitCount: number; // For frequency tracking
}

const statusMap: Record<BookingStatus, { color: string; label: string }> = {
  pending: { color: "warning", label: "Chờ xác nhận" },
  confirmed: { color: "processing", label: "Đã xác nhận" },
  completed: { color: "success", label: "Hoàn thành" },
  cancelled: { color: "error", label: "Đã hủy" },
};

const BookingManagementComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsCreateModalVisible(true);
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const [bookings, setOrders] = useState<BookingItem[]>([
    {
      id: 1,
      customerName: "Nguyễn Thị Lan",
      customerAge: 24,
      phone: "0912345678",
      serviceName: "Chăm sóc da mặt chuyên sâu",
      staffName: "Trần Minh Tâm",
      bookingDate: "2024-04-10",
      startTime: "09:00",
      status: "pending",
      visitCount: 15,
    },
    {
      id: 2,
      customerName: "Lê Hồng Nhung",
      customerAge: 32,
      phone: "0909090909",
      serviceName: "Massage body đá nóng",
      staffName: "Nguyễn Văn A",
      bookingDate: "2024-04-10",
      startTime: "10:30",
      status: "confirmed",
      visitCount: 12,
    },
    {
      id: 3,
      customerName: "Phạm Minh D",
      customerAge: 45,
      phone: "0911223344",
      serviceName: "Gội đầu dưỡng sinh",
      staffName: "Trần Minh Tâm",
      bookingDate: "2024-04-09",
      startTime: "14:00",
      status: "completed",
      visitCount: 20,
    },
    {
      id: 4,
      customerName: "Nguyễn Văn B",
      customerAge: 27,
      phone: "0988776655",
      serviceName: "Triệt lông vĩnh viễn",
      staffName: "Lê Thị C",
      bookingDate: "2024-04-11",
      startTime: "15:00",
      status: "pending",
      visitCount: 8,
    },
    {
      id: 5,
      customerName: "Trần Thị E",
      customerAge: 38,
      phone: "0977665544",
      serviceName: "Nặn mụn chuẩn y khoa",
      staffName: "Nguyễn Văn A",
      bookingDate: "2024-04-11",
      startTime: "16:30",
      status: "cancelled",
      visitCount: 1,
    },
    {
      id: 6,
      customerName: "Hoàng Văn F",
      customerAge: 22,
      phone: "0966554433",
      serviceName: "Trắng sáng da mặt",
      staffName: "Lê Thị C",
      bookingDate: "2024-04-12",
      startTime: "08:30",
      status: "pending",
      visitCount: 4,
    },
    {
      id: 7,
      customerName: "Vũ Thị G",
      customerAge: 29,
      phone: "0955443322",
      serviceName: "Nâng cơ trẻ hóa",
      staffName: "Nguyễn Văn A",
      bookingDate: "2024-04-12",
      startTime: "13:00",
      status: "confirmed",
      visitCount: 18,
    },
    {
      id: 8,
      customerName: "Đỗ Minh H",
      customerAge: 41,
      phone: "0944332211",
      serviceName: "Thải độc chì",
      staffName: "Trần Minh Tâm",
      bookingDate: "2024-04-13",
      startTime: "10:00",
      status: "pending",
      visitCount: 6,
    },
  ]);

  // Age group statistics
  const ageStats = useMemo(() => {
    const groups = {
      "20-28": 0,
      "28-39": 0,
      "39-50": 0,
      "Khác": 0,
    };
    bookings.forEach((b) => {
      if (b.customerAge >= 20 && b.customerAge < 28) groups["20-28"]++;
      else if (b.customerAge >= 28 && b.customerAge < 39) groups["28-39"]++;
      else if (b.customerAge >= 39 && b.customerAge <= 50) groups["39-50"]++;
      else groups["Khác"]++;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Frequency statistics (Top customers)
  const frequencyStats = useMemo(() => {
    return [...bookings]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const okStatus = statusFilter === "all" ? true : b.status === statusFilter;
      const okSearch =
        !q ||
        b.customerName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [bookings, search, statusFilter]);

  const updateStatus = (id: number, status: BookingStatus) => {
    setOrders(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
    message.success(`Đã cập nhật trạng thái thành ${statusMap[status].label}`);
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const newBooking: BookingItem = {
        id: Date.now(),
        customerName: values.customerName,
        customerAge: values.customerAge,
        phone: values.phone,
        serviceName: values.serviceName,
        staffName: values.staffName,
        bookingDate: values.date.format("YYYY-MM-DD"),
        startTime: values.time.format("HH:mm"),
        status: "pending",
        visitCount: 1,
      };
      setOrders([newBooking, ...bookings]);
      setIsCreateModalVisible(false);
      form.resetFields();
      message.success("Đã tạo lịch hẹn mới thành công!");
    });
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: any, r: BookingItem) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{r.customerName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.phone} - {r.customerAge} tuổi</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, r: BookingItem) => (
        <Space direction="vertical" size={0}>
          <Text><CalendarOutlined /> {r.bookingDate}</Text>
          <Text type="secondary"><ClockCircleOutlined /> {r.startTime}</Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: BookingStatus) => (
        <Badge status={statusMap[s].color as any} text={statusMap[s].label} />
      ),
    },
    {
      title: "Lượt đến",
      dataIndex: "visitCount",
      key: "visitCount",
      sorter: (a: BookingItem, b: BookingItem) => a.visitCount - b.visitCount,
      render: (v: number) => <Tag color="blue">{v} lần</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, r: BookingItem) => (
        <Space>
          {r.status === "pending" && (
            <Button
              type="primary"
              size="small"
              onClick={() => updateStatus(r.id, "confirmed")}
            >
              Xác nhận
            </Button>
          )}
          {r.status === "confirmed" && (
            <Button
              type="primary"
              size="small"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => updateStatus(r.id, "completed")}
            >
              Hoàn thành
            </Button>
          )}
          {(r.status === "pending" || r.status === "confirmed") && (
            <Button
              danger
              size="small"
              onClick={() => updateStatus(r.id, "cancelled")}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="booking-management">
      <Title level={2}>Quản lý đặt lịch (Bookings)</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<Space><PieChartOutlined /> Phân bổ khách hàng theo độ tuổi</Space>} bordered={false}>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ageStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {ageStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Space><BarChartOutlined /> Khách hàng thân thiết (Đến thường xuyên)</Space>} bordered={false}>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={frequencyStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="customerName" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitCount" fill="#1890ff" name="Số lượt đến" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Space><CalendarOutlined /> Danh sách đặt lịch</Space>}
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
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "completed", label: "Hoàn thành" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tên khách / SĐT / dịch vụ..."
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
              Thêm lịch hẹn
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          size="small"
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Tạo lịch hẹn mới"
        open={isCreateModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Tạo lịch hẹn"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="customerName"
                label="Họ tên khách hàng"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="customerAge"
                label="Tuổi"
                rules={[{ required: true, message: "Nhập tuổi" }]}
              >
                <Input type="number" placeholder="25" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
              >
                <Input placeholder="09xxxxxxxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceName"
                label="Dịch vụ"
                rules={[{ required: true, message: "Chọn dịch vụ" }]}
              >
                <Select placeholder="Chọn dịch vụ Spa">
                  <Select.Option value="Chăm sóc da mặt chuyên sâu">Chăm sóc da mặt chuyên sâu</Select.Option>
                  <Select.Option value="Massage body đá nóng">Massage body đá nóng</Select.Option>
                  <Select.Option value="Gội đầu dưỡng sinh">Gội đầu dưỡng sinh</Select.Option>
                  <Select.Option value="Triệt lông vĩnh viễn">Triệt lông vĩnh viễn</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="staffName"
                label="Nhân viên thực hiện"
                rules={[{ required: true, message: "Chọn nhân viên" }]}
              >
                <Select placeholder="Chọn kỹ thuật viên">
                  <Select.Option value="Trần Minh Tâm">Trần Minh Tâm</Select.Option>
                  <Select.Option value="Nguyễn Văn A">Nguyễn Văn A</Select.Option>
                  <Select.Option value="Lê Thị C">Lê Thị C</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày hẹn"
                rules={[{ required: true, message: "Chọn ngày" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="time"
            label="Giờ hẹn"
            rules={[{ required: true, message: "Chọn giờ" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Yêu cầu đặc biệt nếu có..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingManagementComponent;
