import React, { useEffect, useState } from "react";
import {
  Avatar,
  Menu,
  Form,
  Input,
  Button,
  Table,
  Tag,
  message,
  Spin
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  LogoutOutlined,
  GiftOutlined
} from "@ant-design/icons";
import axios from "axios";
import "./style.scss";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
};

type Coupon = {
  code: string;
  discount: number;
  expiry: string;
  status: "active" | "expired";
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8088/api/v1/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data?.data || res.data;
        setProfile(data);
        form.setFieldsValue(data);

        // MOCK orders
        setOrders([
          {
            id: "#BC001",
            createdAt: "2026-04-20",
            status: "delivered",
            total: 1200000
          },
          {
            id: "#BC002",
            createdAt: "2026-04-18",
            status: "shipping",
            total: 800000
          }
        ]);

        // MOCK coupons
        setCoupons([
          {
            code: "BEAUTY50",
            discount: 50000,
            expiry: "2026-05-30",
            status: "active"
          },
          {
            code: "SKINCARE10",
            discount: 10,
            expiry: "2026-04-01",
            status: "expired"
          }
        ]);
      } catch {
        message.error("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, token]);

  // ================= UPDATE =================
  const handleUpdate = async (values: Profile) => {
    try {
      await axios.put(
        "http://localhost:8088/api/v1/user/profile",
        values,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      message.success("Cập nhật thành công");
    } catch {
      message.error("Lỗi cập nhật");
    }
  };

  // ================= TABLE =================
  const columns = [
    { title: "Mã đơn", dataIndex: "id" },
    { title: "Ngày", dataIndex: "createdAt" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const map: any = {
          delivered: { color: "green", text: "Thành công" },
          shipping: { color: "orange", text: "Đang giao" },
          cancelled: { color: "red", text: "Đã hủy" }
        };
        return <Tag color={map[status]?.color}>{map[status]?.text}</Tag>;
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (v: number) => `${v.toLocaleString()}₫`
    }
  ];

  if (loading) return <Spin className="loading" />;

  return (
    <div className="profile-luxury">
      <div className="container">

        {/* ===== SIDEBAR ===== */}
        <div className="sidebar">
          <div className="user-box">
            <Avatar size={80} icon={<UserOutlined />} />
            <h3>{profile?.firstName} {profile?.lastName}</h3>
            <p>{profile?.email}</p>
          </div>

          <Menu
            mode="vertical"
            selectedKeys={[activeTab]}
            onClick={(e) => setActiveTab(e.key)}
            items={[
              { key: "profile", icon: <UserOutlined />, label: "Thông tin cá nhân" },
              { key: "orders", icon: <HistoryOutlined />, label: "Đơn hàng" },
              { key: "coupons", icon: <GiftOutlined />, label: "Mã giảm giá" },
              { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" }
            ]}
          />
        </div>

        {/* ===== CONTENT ===== */}
        <div className="content">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="card">
              <h2>Thông tin cá nhân</h2>

              <Form layout="vertical" form={form} onFinish={handleUpdate}>
                <div className="grid">
                  <Form.Item name="firstName" label="Tên"><Input /></Form.Item>
                  <Form.Item name="lastName" label="Họ"><Input /></Form.Item>
                </div>

                <Form.Item name="email" label="Email">
                  <Input disabled />
                </Form.Item>

                <Form.Item name="phone" label="Số điện thoại">
                  <Input />
                </Form.Item>

                <Form.Item name="birthday" label="Ngày sinh">
                  <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" className="save-btn">
                  Lưu thay đổi
                </Button>
              </Form>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="card">
              <h2>Lịch sử đơn hàng</h2>
              <Table columns={columns} dataSource={orders} rowKey="id" pagination={false} />
            </div>
          )}

          {/* COUPONS */}
          {activeTab === "coupons" && (
            <div className="card">
              <h2>Mã giảm giá</h2>

              <div className="coupon-grid">
                {coupons.map((c, i) => (
                  <div key={i} className="coupon-card">
                    <div>
                      <h3>{c.code}</h3>
                      <p>
                        {c.discount > 100
                          ? `Giảm ${c.discount.toLocaleString()}₫`
                          : `Giảm ${c.discount}%`}
                      </p>
                    </div>

                    <div>
                      <span>
                        HSD: {new Date(c.expiry).toLocaleDateString("vi-VN")}
                      </span>
                      <Tag color={c.status === "active" ? "green" : "red"}>
                        {c.status === "active" ? "Còn hạn" : "Hết hạn"}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;