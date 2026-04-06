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
  Select,
  Tag,
  Avatar,
  Badge,
  message,
  Statistic,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  LineChartOutlined,
  PieChartOutlined,
  UserAddOutlined,
  CrownOutlined,
  UserSwitchOutlined,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

type UserRole = "Admin" | "Staff" | "Customer";

interface UserManagementProps {
  fixedRole?: UserRole;
}

const roleLabelMap: Record<UserRole, string> = {
  Admin: "Admin",
  Staff: "Nhân viên",
  Customer: "Khách hàng",
};

const UserManagementComponent: React.FC<UserManagementProps> = ({ fixedRole }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [roleFilter, setRoleFilter] = useState<string>(fixedRole ?? "all");
  const [form] = Form.useForm();

  // Mock data for Users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      phone: "0912345678",
      role: "Admin",
      status: "Active",
      lastLogin: "10 phút trước",
      orders: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin1",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@gmail.com",
      phone: "0987654321",
      role: "Staff",
      status: "Active",
      lastLogin: "2 giờ trước",
      orders: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Staff1",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "vanc@gmail.com",
      phone: "0909090909",
      role: "Customer",
      status: "Active",
      lastLogin: "1 ngày trước",
      orders: 15,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer1",
    },
    {
      id: 4,
      name: "Phạm Minh D",
      email: "minhd@gmail.com",
      phone: "0911223344",
      role: "Customer",
      status: "Inactive",
      lastLogin: "5 ngày trước",
      orders: 8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer2",
    },
  ]);

  // Mock data for New Users Stats
  const newUsersData = {
    week: [
      { name: "T2", newUsers: 12, potential: 5 },
      { name: "T3", newUsers: 15, potential: 8 },
      { name: "T4", newUsers: 10, potential: 4 },
      { name: "T5", newUsers: 18, potential: 9 },
      { name: "T6", newUsers: 22, potential: 12 },
      { name: "T7", newUsers: 30, potential: 15 },
      { name: "CN", newUsers: 25, potential: 10 },
    ],
    month: [
      { name: "Tuần 1", newUsers: 85, potential: 35 },
      { name: "Tuần 2", newUsers: 95, potential: 42 },
      { name: "Tuần 3", newUsers: 78, potential: 30 },
      { name: "Tuần 4", newUsers: 110, potential: 55 },
    ],
    year: [
      { name: "Tháng 1", newUsers: 450, potential: 120 },
      { name: "Tháng 2", newUsers: 400, potential: 110 },
      { name: "Tháng 3", newUsers: 550, potential: 180 },
      { name: "Tháng 4", newUsers: 600, potential: 220 },
      { name: "Tháng 5", newUsers: 580, potential: 200 },
      { name: "Tháng 6", newUsers: 650, potential: 250 },
    ],
  };

  const roleDistribution = [
    { name: "Admin", value: 3, color: "#f5222d" },
    { name: "Staff", value: 12, color: "#faad14" },
    { name: "Customer", value: 850, color: "#1890ff" },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa người dùng này không?",
      onOk: () => {
        setUsers(users.filter((u) => u.id !== id));
        message.success("Đã xóa người dùng");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const normalizedValues = {
        ...values,
        role: fixedRole ?? values.role,
      };
      if (editingUser) {
        setUsers(
          users.map((u) =>
            u.id === editingUser.id ? { ...u, ...normalizedValues } : u
          )
        );
        message.success("Đã cập nhật thông tin người dùng");
      } else {
        const newUser = {
          id: Date.now(),
          ...normalizedValues,
          lastLogin: "Vừa mới đây",
          orders: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        };
        setUsers([...users, newUser]);
        message.success("Đã thêm người dùng mới");
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_: any, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = role === "Admin" ? "volcano" : role === "Staff" ? "orange" : "blue";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={status === "Active" ? "success" : "error"} text={status} />
      ),
    },
    {
      title: "Lần đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (text: string) => <Text type="secondary">{text}</Text>,
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

  const filteredUsers = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);
  const title = fixedRole ? `Quản lý ${roleLabelMap[fixedRole]}` : "Quản lý người dùng";

  return (
    <div className="user-management">
      <Title level={2}>{title}</Title>

      {/* Top statistics cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="user-stat-card">
            <Statistic
              title="Tổng người dùng"
              value={865}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="user-stat-card">
            <Statistic
              title="Khách hàng tiềm năng"
              value={42}
              prefix={<CrownOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="user-stat-card">
            <Statistic
              title="Nhân viên"
              value={12}
              prefix={<UserSwitchOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space><LineChartOutlined /> Thống kê Người dùng mới & Tiềm năng</Space>
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
                <BarChart data={newUsersData[period]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newUsers" fill="#1890ff" name="Người dùng mới" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="potential" fill="#faad14" name="Tiềm năng" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><PieChartOutlined /> Phân bổ vai trò</Space>} bordered={false}>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Card
        title={
          <Space>
            <TeamOutlined /> Danh sách người dùng
          </Space>
        }
        bordered={false}
        extra={
          <Space size="middle">
            {!fixedRole && (
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={(value) => setRoleFilter(value)}
                options={[
                  { value: "all", label: "Tất cả vai trò" },
                  { value: "Admin", label: "Admin" },
                  { value: "Staff", label: "Nhân viên" },
                  { value: "Customer", label: "Khách hàng" },
                ]}
              />
            )}
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm người dùng..."
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={filteredUsers} rowKey="id" />
      </Card>

      {/* Modal CRUD User */}
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                <Input placeholder="Nhập tên người dùng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}>
                <Input placeholder="example@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                <Input placeholder="0xxxxxxxxx" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {!fixedRole && (
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Vai trò"
                  rules={[{ required: true, message: "Chọn vai trò" }]}
                  initialValue="Customer"
                >
                  <Select>
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="Staff">Nhân viên</Select.Option>
                    <Select.Option value="Customer">Khách hàng</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="Active">
                <Select>
                  <Select.Option value="Active">Hoạt động</Select.Option>
                  <Select.Option value="Inactive">Ngừng hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementComponent;
