import React, { useState } from "react";
import {
  Typography,
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Row,
  Col,
  Switch,
  TimePicker,
  Upload,
  message,
  Space,
  Divider,
  Avatar,
} from "antd";
import {
  SettingOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  BellOutlined,
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  LockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./style.scss";

const { Title, Text } = Typography;

const SettingsManagementComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    console.log("Success:", values);
    setTimeout(() => {
      setLoading(false);
      message.success("Cập nhật cài đặt thành công!");
    }, 1000);
  };

  const items = [
    {
      key: "1",
      label: (
        <span>
          <GlobalOutlined /> Cài đặt chung
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Thông tin cửa hàng</Title>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              storeName: "Beauty Care Spa",
              email: "contact@beautycare.com",
              phone: "0123456789",
              address: "123 Đường ABC, Quận 1, TP. HCM",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên cửa hàng" name="storeName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email liên hệ" name="email">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Logo cửa hàng">
              <Upload listType="picture-card" maxCount={1}>
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <ClockCircleOutlined /> Giờ làm việc
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Cấu hình thời gian hoạt động</Title>
          <Form layout="vertical" onFinish={onFinish}>
            {[
              "Thứ Hai",
              "Thứ Ba",
              "Thứ Tư",
              "Thứ Năm",
              "Thứ Sáu",
              "Thứ Bảy",
              "Chủ Nhật",
            ].map((day) => (
              <Row key={day} gutter={16} align="middle" style={{ marginBottom: 16 }}>
                <Col span={4}>
                  <Text strong>{day}</Text>
                </Col>
                <Col span={4}>
                  <Switch defaultChecked />
                </Col>
                <Col span={8}>
                  <TimePicker.RangePicker
                    format="HH:mm"
                    defaultValue={[dayjs("08:00", "HH:mm"), dayjs("20:00", "HH:mm")]}
                  />
                </Col>
              </Row>
            ))}
            <Divider />
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
              Lưu giờ làm việc
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <CreditCardOutlined /> Thanh toán
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Phương thức thanh toán</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Card size="small" title="Thanh toán khi nhận hàng (COD)">
                <Row justify="space-between" align="middle">
                  <Text>Cho phép khách hàng thanh toán sau khi nhận dịch vụ/sản phẩm</Text>
                  <Switch defaultChecked />
                </Row>
              </Card>
              <Card size="small" title="Chuyển khoản ngân hàng">
                <Row justify="space-between" align="middle">
                  <Text>Hiển thị thông tin tài khoản ngân hàng để khách chuyển khoản</Text>
                  <Switch defaultChecked />
                </Row>
                <div style={{ marginTop: 16 }}>
                  <Form.Item label="Thông tin tài khoản (Số TK, Ngân hàng, Chủ TK)">
                    <Input.TextArea rows={3} defaultValue="STK: 123456789 - Ngân hàng VCB - Chủ TK: BEAUTY CARE SPA" />
                  </Form.Item>
                </div>
              </Card>
              <Card size="small" title="Ví điện tử (Momo/ZaloPay)">
                <Row justify="space-between" align="middle">
                  <Text>Tích hợp cổng thanh toán trực tuyến</Text>
                  <Switch />
                </Row>
              </Card>
            </Space>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                Cập nhật phương thức
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <BellOutlined /> Thông báo
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Cài đặt thông báo</Title>
          <Form layout="vertical">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Row justify="space-between" align="middle">
                <div>
                  <Text strong>Thông báo đơn hàng mới</Text>
                  <br />
                  <Text type="secondary">Gửi thông báo khi có đơn hàng mới được đặt</Text>
                </div>
                <Switch defaultChecked />
              </Row>
              <Row justify="space-between" align="middle">
                <div>
                  <Text strong>Thông báo đặt lịch mới</Text>
                  <br />
                  <Text type="secondary">Gửi thông báo khi khách hàng đặt lịch hẹn</Text>
                </div>
                <Switch defaultChecked />
              </Row>
              <Row justify="space-between" align="middle">
                <div>
                  <Text strong>Email nhắc hẹn</Text>
                  <br />
                  <Text type="secondary">Tự động gửi email nhắc khách trước 2 tiếng</Text>
                </div>
                <Switch />
              </Row>
            </Space>
          </Form>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <span>
          <UserOutlined /> Tài khoản
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Hồ sơ cá nhân</Title>
          <Row gutter={32}>
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar size={120} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
              <div style={{ marginTop: 16 }}>
                <Upload showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Đổi ảnh đại diện</Button>
                </Upload>
              </div>
            </Col>
            <Col span={18}>
              <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  fullName: "Quản trị viên",
                  username: "admin_beauty",
                  email: "admin@beautycare.com",
                }}
              >
                <Form.Item label="Họ và tên" name="fullName">
                  <Input />
                </Form.Item>
                <Form.Item label="Tên đăng nhập" name="username">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
                <Divider orientation={"left" as any}><LockOutlined /> Đổi mật khẩu</Divider>
                <Form.Item label="Mật khẩu hiện tại" name="oldPassword">
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item label="Mật khẩu mới" name="newPassword">
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                  Cập nhật hồ sơ
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="settings-management">
      <Title level={2}>Cài đặt hệ thống</Title>

      <Card bordered={false} className="settings-card">
        <Tabs defaultActiveKey="1" tabPosition="left" items={items} />
      </Card>
    </div>
  );
};

export default SettingsManagementComponent;
