import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Switch,
  Space,
  message,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./style.scss";
import { useGetCurrentUser, useUpdateCurrentUser } from "../../../hooks/user";

const { Title, Text } = Typography;

type Profile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
};

const ProfileManagementComponent: React.FC = () => {
  const navigate = useNavigate();
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const currentUserQuery = useGetCurrentUser();
  const updateUserMutation = useUpdateCurrentUser();

  const [profile, setProfile] = useState<Profile>({
    fullName: "Quản trị viên",
    username: "admin_beauty",
    email: "admin@beautycare.com",
    phone: "0123456789",
    role: "Quản trị viên",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  });

  useEffect(() => {
    const u: any = currentUserQuery.data?.data;
    if (!u) return;

    const email = u.Email ?? u.email ?? "";
    const phone = u.Phone ?? u.phone ?? "";
    const firstName = u.firstName ?? "";
    const lastName = u.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || email;
    const username = email ? email.split("@")[0] : `user_${u.id ?? ""}`;
    const roleCode = u.role_code ?? "";
    const role =
      roleCode === "R1"
        ? "Quản trị viên"
        : roleCode === "R2"
          ? "Nhân viên"
          : "Khách hàng";
    const avatar = u.avatar ?? u.img ?? profile.avatar;

    const nextProfile: Profile = {
      fullName,
      username,
      email,
      phone,
      role,
      avatar,
    };
    setProfile(nextProfile);

    profileForm.setFieldsValue({
      fullName: nextProfile.fullName,
      email: nextProfile.email,
      phone: nextProfile.phone,
      avatar: nextProfile.avatar
        ? [
            {
              uid: "-1",
              name: "avatar.png",
              status: "done",
              url: nextProfile.avatar,
            },
          ]
        : [],
    });

    const normalizedUser = {
      id: u.id,
      email,
      firstName,
      lastName,
      role_code: roleCode,
      avatar: u.avatar ?? u.img ?? null,
    };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }, [currentUserQuery.data?.data, profile.avatar, profileForm]);

  const [preferences, setPreferences] = useState({
    notifyOrders: true,
    notifyBookings: true,
    notifyReviews: true,
  });

  const stats = useMemo(
    () => ({
      lastLogin: "Hôm nay, 09:15",
      actions7d: 42,
      securityLevel: "Tốt",
    }),
    []
  );

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSaveProfile = () => {
    profileForm.validateFields().then(async (values) => {
      setLoading(true);
      try {
        let avatarUrl = profile.avatar;
        if (values.avatar?.length && values.avatar[0]?.originFileObj) {
          avatarUrl = await getBase64(values.avatar[0].originFileObj);
        }
        const fullNameStr = String(values.fullName || "").trim();
        const tokens = fullNameStr.split(/\s+/).filter(Boolean);
        const current: any = currentUserQuery.data?.data ?? {};
        const firstName =
          tokens.length >= 2 ? tokens[0] : tokens[0] || current.firstName || "";
        const lastName =
          tokens.length >= 2
            ? tokens.slice(1).join(" ")
            : current.lastName || "";

        const res = await updateUserMutation.mutateAsync({
          firstName,
          lastName,
          email: values.email,
          phone: values.phone,
          avatar: avatarUrl,
        } as any);

        if (res.err) {
          message.error(res.mess || "Cập nhật thất bại");
          return;
        }

        const u: any = res.data;
        const email = u?.Email ?? values.email;
        const phone = u?.Phone ?? values.phone;
        const roleCode = u?.role_code ?? current.role_code ?? "";
        const role =
          roleCode === "R1"
            ? "Quản trị viên"
            : roleCode === "R2"
              ? "Nhân viên"
              : "Khách hàng";

        const next: Profile = {
          ...profile,
          fullName: `${u?.firstName ?? firstName} ${u?.lastName ?? lastName}`.trim(),
          email,
          phone,
          role,
          avatar: u?.avatar ?? u?.img ?? avatarUrl,
        };
        setProfile(next);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: u?.id ?? current.id,
            email,
            firstName: u?.firstName ?? firstName,
            lastName: u?.lastName ?? lastName,
            role_code: roleCode,
            avatar: u?.avatar ?? u?.img ?? avatarUrl ?? null,
          }),
        );
        message.success("Đã cập nhật thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleChangePassword = () => {
    securityForm.validateFields().then(() => {
      securityForm.resetFields();
      message.success("Đã cập nhật mật khẩu");
    });
  };

  return (
    <div className="profile-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")} />
            <Title level={2} style={{ margin: 0 }}>Thông tin cá nhân</Title>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="profile-card">
            <Space direction="vertical" size={12} style={{ width: "100%" }} align="center">
              <Avatar size={96} src={profile.avatar} icon={<UserOutlined />} />
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ fontSize: 16 }}>{profile.fullName}</Text>
                <br />
                <Text type="secondary">@{profile.username}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">{profile.role}</Text>
                </div>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <Row gutter={[12, 12]} style={{ width: "100%" }}>
                <Col span={12}>
                  <Statistic title="Lần đăng nhập" value={stats.lastLogin} valueStyle={{ fontSize: 14 }} />
                </Col>
                <Col span={12}>
                  <Statistic title="Hoạt động 7 ngày" value={stats.actions7d} valueStyle={{ fontSize: 14 }} />
                </Col>
              </Row>
              <Divider style={{ margin: "8px 0" }} />
              <Space>
                <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
                <Text>Trạng thái bảo mật: <Text strong>{stats.securityLevel}</Text></Text>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card bordered={false} className="profile-card" title="Cập nhật thông tin" loading={currentUserQuery.isLoading}>
            <Form
              form={profileForm}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tên đăng nhập">
                    <Input value={profile.username} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>

              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveProfile} loading={loading}>
                Lưu thay đổi
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card bordered={false} className="profile-card" title="Thông báo">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Row justify="space-between" align="middle">
                <Space>
                  <BellOutlined style={{ color: "#1890ff" }} />
                  <Text>Thông báo đơn hàng</Text>
                </Space>
                <Switch
                  checked={preferences.notifyOrders}
                  onChange={(v) => setPreferences({ ...preferences, notifyOrders: v })}
                />
              </Row>
              <Row justify="space-between" align="middle">
                <Space>
                  <BellOutlined style={{ color: "#faad14" }} />
                  <Text>Thông báo lịch hẹn</Text>
                </Space>
                <Switch
                  checked={preferences.notifyBookings}
                  onChange={(v) => setPreferences({ ...preferences, notifyBookings: v })}
                />
              </Row>
              <Row justify="space-between" align="middle">
                <Space>
                  <BellOutlined style={{ color: "#ff4d4f" }} />
                  <Text>Thông báo đánh giá</Text>
                </Space>
                <Switch
                  checked={preferences.notifyReviews}
                  onChange={(v) => setPreferences({ ...preferences, notifyReviews: v })}
                />
              </Row>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => message.success("Đã lưu cài đặt thông báo")}
              >
                Lưu cài đặt
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card bordered={false} className="profile-card" title="Bảo mật">
            <Form form={securityForm} layout="vertical">
              <Form.Item
                name="oldPassword"
                label="Mật khẩu hiện tại"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleChangePassword}>
                Đổi mật khẩu
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileManagementComponent;
