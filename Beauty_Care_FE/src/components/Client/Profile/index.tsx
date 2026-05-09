import React, { useEffect, useState, useRef } from "react";
import {
  Menu,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Spin,
  Modal,
  DatePicker,
  notification,
  Tooltip
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  LogoutOutlined,
  GiftOutlined,
  CameraOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { API } from "../../../api/config";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string | null;
  avatar?: string;
  lastUpdated?: string;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChanged'));
    notification.success({ message: "Thành công", description: "Đã đăng xuất" });
    navigate("/");
    window.location.reload();
  };

  // Fetch profile via react-query
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await API.get("/user/current");
      return res.data?.data || res.data;
    },
    enabled: !!token,
  });

  // Fetch orders via react-query
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await API.get("/order");
      return res.data?.data || res.data;
    },
    enabled: !!token && activeTab === "orders",
  });

  useEffect(() => {
    if (profileData) {
      const mappedData = {
        ...profileData,
        email: profileData.Email || profileData.email,
        phone: profileData.Phone || profileData.phone,
        avatar: profileData.Avatar || profileData.avatar,
        lastUpdated: profileData.updatedAt || profileData.updated_at || profileData.lastUpdated
      };
      setProfile(mappedData);
      setPreviewAvatar(mappedData.avatar || null);
      form.setFieldsValue({
        ...mappedData,
        birthday: mappedData.birthday ? dayjs(mappedData.birthday) : null
      });
    }
  }, [profileData, form]);

  useEffect(() => {
    const fetchMocks = async () => {
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
    };

    fetchMocks();
  }, []);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        ...values,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : undefined
      };
      const response = await API.put("/user/update", payload);
      return response.data;
    },
    onSuccess: () => {
      notification.success({ 
        message: "Cập nhật thành công", 
        description: "Thông tin cá nhân của bạn đã được lưu lại." 
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      notification.error({ 
        message: "Cập nhật thất bại", 
        description: "Đã xảy ra lỗi, vui lòng thử lại sau." 
      });
    }
  });

  const handleUpdate = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await API.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: () => {
      notification.success({ 
        message: "Thành công", 
        description: "Cập nhật ảnh đại diện thành công" 
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      notification.error({ 
        message: "Lỗi", 
        description: "Không thể tải ảnh lên. Vui lòng thử lại." 
      });
      setPreviewAvatar(profile?.avatar || null);
    }
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      const response = await API.delete("/user/avatar");
      return response.data;
    },
    onSuccess: () => {
      notification.success({ 
        message: "Thành công", 
        description: "Đã xóa ảnh đại diện" 
      });
      setPreviewAvatar(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      notification.error({ 
        message: "Lỗi", 
        description: "Lỗi khi xóa ảnh đại diện" 
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        notification.error({ message: "Lỗi định dạng", description: "Vui lòng chọn file hình ảnh!" });
        return;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        notification.error({ message: "Dung lượng quá lớn", description: "Ảnh phải nhỏ hơn 5MB!" });
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
      uploadAvatarMutation.mutate(file);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    if (!uploadAvatarMutation.isPending) {
      fileInputRef.current?.click();
    }
  };

  const handleDeleteAvatar = () => {
    Modal.confirm({
      title: 'Xóa ảnh đại diện?',
      content: 'Bạn có chắc chắn muốn xóa ảnh đại diện hiện tại không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        deleteAvatarMutation.mutate();
      }
    });
  };

  // 30 days logic calculation
  const lastUpdated = profile?.lastUpdated ? dayjs(profile.lastUpdated) : null;
  const daysSinceLastUpdate = lastUpdated ? dayjs().diff(lastUpdated, 'day') : 30;
  const canUpdate = daysSinceLastUpdate >= 30;
  const daysRemaining = 30 - daysSinceLastUpdate;

  const columns = [
    { 
      title: "Mã đơn", 
      dataIndex: "id",
      render: (id: string | number) => <span style={{ fontWeight: 500 }}>#{id}</span>
    },
    { 
      title: "Ngày đặt", 
      dataIndex: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const s = (status || "").toUpperCase();
        let color = "default";
        let text = s;
        if (s === "PENDING") { color = "gold"; text = "Chờ Xử Lý"; }
        else if (s === "CONFIRMED") { color = "blue"; text = "Đã Xác Nhận"; }
        else if (s === "SHIPPING") { color = "cyan"; text = "Đang Giao"; }
        else if (s === "SUCCESS" || s === "DELIVERED" || s === "COMPLETED") { color = "green"; text = "Hoàn Thành"; }
        else if (s === "CANCELLED") { color = "red"; text = "Đã Hủy"; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (v: number) => <span style={{ fontWeight: 600 }}>{Number(v || 0).toLocaleString("vi-VN")}₫</span>
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/myorder`)} 
          style={{ padding: 0, fontWeight: 500, color: '#FF5FB1' }}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  if (profileLoading) return <Spin className="loading-spinner" size="large" />;

  const realOrders = Array.isArray(ordersData?.items) ? ordersData.items : Array.isArray(ordersData) ? ordersData : [];

  const displayAvatar = previewAvatar || "https://i.pravatar.cc/150?u=beauty";

  return (
    <div className="profile-luxury">
      <div className="container">

        {/* ===== SIDEBAR ===== */}
        <div className="sidebar">
          <div className="user-box">
            <div className="avatar-wrapper" onClick={handleAvatarClick}>
              {uploadAvatarMutation.isPending && (
                <div className="avatar-loading">
                  <Spin />
                </div>
              )}
              <div className="avatar-frame" style={{ backgroundImage: `url(${displayAvatar})` }}>
                {!previewAvatar && !profile?.avatar && <UserOutlined className="default-icon" />}
              </div>
              <div className="avatar-overlay">
                <CameraOutlined />
                <span>Thay đổi</span>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />

            {(profile?.avatar || previewAvatar) && (
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                className="remove-avatar-btn"
                onClick={handleDeleteAvatar}
                loading={deleteAvatarMutation.isPending}
              >
                Gỡ ảnh
              </Button>
            )}

            <h3>{profile?.firstName} {profile?.lastName}</h3>
            <p>{profile?.email}</p>
          </div>

          <Menu
            mode="vertical"
            selectedKeys={[activeTab]}
            onClick={(e) => {
              if (e.key === "logout") {
                handleLogout();
              } else {
                setActiveTab(e.key);
              }
            }}
            items={[
              { key: "profile", icon: <UserOutlined />, label: "Thông tin cá nhân" },
              { key: "orders", icon: <HistoryOutlined />, label: "Đơn hàng" },
              { key: "coupons", icon: <GiftOutlined />, label: "Mã giảm giá" },
              { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true }
            ]}
          />
        </div>

        {/* ===== CONTENT ===== */}
        <div className="content">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="card">
              <h2 className="section-title">Hồ Sơ Cá Nhân</h2>

              <Form layout="vertical" form={form} onFinish={handleUpdate} className="luxury-form">
                <div className="grid">
                  <Form.Item name="firstName" label="Tên"><Input /></Form.Item>
                  <Form.Item name="lastName" label="Họ"><Input /></Form.Item>
                </div>

                <Form.Item name="email" label="Email">
                  <Input disabled className="input-disabled" />
                </Form.Item>

                <Form.Item name="phone" label="Số điện thoại">
                  <Input />
                </Form.Item>

                <Tooltip 
                  title={!canUpdate ? `Bạn chỉ có thể cập nhật thông tin sau mỗi 30 ngày (Còn ${daysRemaining} ngày)` : ""}
                  color="#1a1a1a"
                >
                  <div>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="save-btn"
                      disabled={!canUpdate}
                      loading={updateProfileMutation.isPending}
                      icon={!canUpdate ? <InfoCircleOutlined /> : null}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Tooltip>
              </Form>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="card">
              <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif" }}>Lịch Sử Đơn Hàng</h2>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
              ) : (
                <Table 
                  columns={columns} 
                  dataSource={realOrders} 
                  rowKey="id" 
                  pagination={false} 
                  className="luxury-table"
                />
              )}
            </div>
          )}

          {/* COUPONS */}
          {activeTab === "coupons" && (
            <div className="card">
              <h2 className="section-title">Mã Giảm Giá Của Bạn</h2>

              <div className="coupon-grid">
                {coupons.map((c, i) => (
                  <div key={i} className="coupon-card">
                    <div className="coupon-main">
                      <h3>{c.code}</h3>
                      <p>
                        {c.discount > 100
                          ? `Giảm ${c.discount.toLocaleString()}₫`
                          : `Giảm ${c.discount}%`}
                      </p>
                    </div>

                    <div className="coupon-meta">
                      <span className="expiry-date">
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