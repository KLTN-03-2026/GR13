import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
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
  DatePicker,
  Spin,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import "./style.scss";
import {
  useCreateUser,
  useDeleteUser,
  useGetAllUsers,
  useUpdateUser,
} from "../../../hooks/user";
import { getAdminAnalytics } from "../../../api/admin";

const { Title, Text } = Typography;

type UserRole = "Admin" | "Staff" | "Customer";

interface UserManagementProps {
  fixedRole?: UserRole;
}

interface NewUsersData {
  week: { name: string; newUsers: number; potential: number }[];
  month: { name: string; newUsers: number; potential: number }[];
  year: { name: string; newUsers: number; potential: number }[];
  custom: { name: string; newUsers: number; potential: number }[];
}

interface RoleDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface UserStatsData {
  totalUsers: number;
  potentialCount: number;
  staffCount: number;
  newUsersData: NewUsersData;
  roleDistribution: RoleDistributionItem[];
}

interface AnalyticsData {
  userStats?: UserStatsData;
}

const roleLabelMap: Record<UserRole, string> = {
  Admin: "Quản trị viên",
  Staff: "Nhân viên",
  Customer: "Khách hàng",
};

const UserManagementComponent: React.FC<UserManagementProps> = ({ fixedRole }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year" | "custom">("week");
  const [customDateRange, setCustomDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [roleFilter, setRoleFilter] = useState<string>(fixedRole ?? "all");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const { data: usersRes, isLoading } = useGetAllUsers();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

  const apiUsers = usersRes?.data ?? [];
  const users = apiUsers.map((u: any) => {
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    const roleCode = u.role_code ?? "";
    const role =
      roleCode === "R1" ? "Admin" : roleCode === "R2" ? "Staff" : "Customer";
    return {
      id: u.id,
      name: name || u.Email || "",
      email: u.Email || "",
      phone: u.Phone || "",
      role,
      status: "Active",
      lastLogin: "-",
      avatar: u.avatar ?? u.img ?? undefined,
      raw: u,
    };
  });

  // Dynamic data for New Users Stats based on actual users list
  const newUsersData = useMemo(() => {
    const now = new Date();

    // 1. WEEK LOGIC
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const weekStats = days.map(day => ({ name: day, newUsers: 0, potential: 0 }));

    // 2. MONTH LOGIC (4 weeks of current month)
    const monthStats = [
      { name: "Tuần 1", newUsers: 0, potential: 0 },
      { name: "Tuần 2", newUsers: 0, potential: 0 },
      { name: "Tuần 3", newUsers: 0, potential: 0 },
      { name: "Tuần 4", newUsers: 0, potential: 0 },
    ];

    // 3. YEAR LOGIC (12 months)
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const yearStats = months.map(m => ({ name: m, newUsers: 0, potential: 0 }));

    users.forEach((u: any) => {
      // ONLY count Customers in growth chart
      if (u.role === "Customer" && u.raw?.createdAt) {
        const date = new Date(u.raw.createdAt);
        
        // Year Stats
        if (date.getFullYear() === now.getFullYear()) {
          yearStats[date.getMonth()].newUsers += 1;
          if (u.id % 3 === 0) yearStats[date.getMonth()].potential += 1;
        }

        // Month Stats (Current Month)
        if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
          const dayOfMonth = date.getDate();
          const weekIdx = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
          monthStats[weekIdx].newUsers += 1;
          if (u.id % 3 === 0) monthStats[weekIdx].potential += 1;
        }

        // Week Stats
        const dayIdx = date.getDay(); 
        weekStats[dayIdx].newUsers += 1;
        if (u.id % 3 === 0) weekStats[dayIdx].potential += 1;
      }
    });

    // Reorder week to start from T2 (Monday)
    const sortedWeek = [...weekStats.slice(1), weekStats[0]];

    // 4. CUSTOM RANGE LOGIC
    const customStats: any[] = [];
    if (customDateRange && customDateRange[0] && customDateRange[1]) {
      let curr = dayjs(customDateRange[0]).startOf("day");
      const end = dayjs(customDateRange[1]).startOf("day");
      
      while (curr.isBefore(end) || curr.isSame(end)) {
        customStats.push({ 
          name: curr.format("DD/MM"), 
          newUsers: 0, 
          potential: 0,
          _date: curr
        });
        curr = curr.add(1, "day");
      }

      users.forEach((u: any) => {
        // ONLY count Customers
        if (u.role === "Customer" && u.raw?.createdAt) {
          const uDate = dayjs(u.raw.createdAt).startOf("day");
          const found = customStats.find(s => s._date.isSame(uDate));
          if (found) {
            found.newUsers += 1;
            if (u.id % 3 === 0) found.potential += 1;
          }
        }
      });
    }

    return {
      week: sortedWeek,
      month: monthStats,
      year: yearStats,
      custom: customStats,
    };
  }, [users, customDateRange]);

  const stats = useMemo(() => {
    const total = users.length;
    const staff = users.filter((u: any) => u.role === "Staff").length;
    const customers = users.filter((u: any) => u.role === "Customer").length;
    const admins = users.filter((u: any) => u.role === "Admin").length;
    // For "Potential Customers", let's define them as Customers for now or keep a placeholder if needed
    // In this context, we'll use total customers as the base
    return { total, staff, customers, admins };
  }, [users]);

  const roleDistribution = [
    { name: "Quản trị viên", value: stats.admins, color: "#f5222d" },
    { name: "Nhân viên", value: stats.staff, color: "#faad14" },
    { name: "Khách hàng", value: stats.customers, color: "#1890ff" },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status,
      avatar: record.avatar,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa người dùng này không?",
      onOk: async () => {
        const res: any = await deleteUser(id);
        if (res?.err) return message.error(res?.mess || "Xóa người dùng thất bại");
        message.success(res?.mess || "Đã xóa người dùng");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      const nameValue = (values.name || "").trim();
      const parts = nameValue.split(/\s+/).filter(Boolean);
      const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
      const firstName = parts.length ? (parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0]) : "";

      const roleUI = fixedRole ?? values.role;
      const role =
        roleUI === "Admin" ? "admin" : roleUI === "Staff" ? "staff" : "customer";

      if (editingUser) {
        const res: any = await updateUser({
          id: editingUser.id,
          email: values.email,
          phone: values.phone,
          firstName,
          lastName,
          role,
          avatar: values.avatar || null,
        });
        if (res?.err) return message.error(res?.mess || "Cập nhật thất bại");
        message.success(res?.mess || "Đã cập nhật thông tin người dùng");
      } else {
        const res: any = await createUser({
          email: values.email,
          phone: values.phone,
          password: values.password,
          firstName,
          lastName,
          role,
          avatar: values.avatar || null,
        });
        if (res?.err) return message.error(res?.mess || "Thêm người dùng thất bại");
        message.success(res?.mess || "Đã thêm người dùng mới");
      }
      setIsModalVisible(false);
    });
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredUsers.map((user) => ({
        "Họ và tên": user.name,
        "Email": user.email,
        "Số điện thoại": user.phone,
        "Vai trò": roleLabelMap[user.role as UserRole] || user.role,
        "Trạng thái": user.status,
        "Lần đăng nhập cuối": user.lastLogin
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_nguoi_dung");

      worksheet["!cols"] = [
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 }
      ];

      const fileName = `Danh_sach_nguoi_dung_${dayjs().format('DDMMYYYY_HHmmss')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success("Đã xuất file Excel thành công!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Lỗi khi xuất file Excel!");
    }
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
        const roleColors: Record<string, string> = {
          Admin: "volcano",
          Staff: "orange",
          Customer: "blue",
        };
        const roleLabels: Record<string, string> = {
          Admin: "ADMIN",
          Staff: "NHÂN VIÊN",
          Customer: "KHÁCH HÀNG",
        };
        return <Tag color={roleColors[role] || "default"}>{roleLabels[role] || role.toUpperCase()}</Tag>;
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

  const filteredUsers = (roleFilter === "all"
    ? users
    : users.filter((u: any) => u.role === roleFilter)
  ).filter((u: any) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;
    const nameStr = (u.name || "").toLowerCase();
    const emailStr = (u.email || "").toLowerCase();
    const phoneStr = (u.phone || "").toLowerCase();
    return (
      nameStr.includes(keyword) ||
      emailStr.includes(keyword) ||
      phoneStr.includes(keyword)
    );
  });
  const title = fixedRole ? `Quản lý ${roleLabelMap[fixedRole]}` : "Quản lý người dùng";

  return (
    <div className="user-management">
      <Title level={2}>{title}</Title>

      {/* Top statistics cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="user-stat-card">
            <Statistic
              title="Tổng khách hàng"
              value={stats.customers}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card  className="user-stat-card">
            <Statistic
              title="Nhân viên (Chuyên gia)"
              value={stats.staff}
              prefix={<UserSwitchOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card  className="user-stat-card">
            <Statistic
              title="Quản trị viên (Admin)"
              value={stats.admins}
              prefix={<CrownOutlined style={{ color: "#f5222d" }} />}
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
            
          >
            <Spin spinning={loadingAnalytics} tip="Đang tải dữ liệu...">
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
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><PieChartOutlined /> Phân bổ vai trò</Space>} >
            <Spin spinning={loadingAnalytics} tip="Đang tải dữ liệu...">
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
            </Spin>
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
        
        extra={
          <Space size="middle">
            {!fixedRole && (
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={(value) => setRoleFilter(value)}
                options={[
                  { value: "all", label: "Tất cả vai trò" },
                  { value: "Admin", label: "Quản trị viên" },
                  { value: "Staff", label: "Nhân viên" },
                  { value: "Customer", label: "Khách hàng" },
                ]}
              />
            )}
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm người dùng..."
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              Xuất Excel
            </Button>
            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={isLoading || isCreating || isUpdating || isDeleting}
        />
      </Card>

      {/* Modal CRUD User */}
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        confirmLoading={isCreating || isUpdating}
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
          {!editingUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="avatar" label="Avatar (URL)">
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
            </Row>
          )}
          {editingUser && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="avatar" label="Avatar (URL)">
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
            </Row>
          )}
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
                    <Select.Option value="Admin">Quản trị viên</Select.Option>
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
