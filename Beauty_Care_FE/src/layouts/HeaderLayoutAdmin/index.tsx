import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Input,
  Button,
  Tooltip,
  Divider,
  Typography,
  List,
  Card,
  message
} from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";

import "./style.scss";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderLayoutAdminProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const HeaderLayoutAdmin: React.FC<HeaderLayoutAdminProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as any;
    } catch {
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    if (!currentUser) return "Tài khoản";
    const firstName = currentUser.firstName || "";
    const lastName = currentUser.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || currentUser.email || "Tài khoản";
  }, [currentUser]);

  const avatarSrc = useMemo(() => {
    if (!currentUser) return null;
    return currentUser.avatar || currentUser.img || null;
  }, [currentUser]);



  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/admin/profile");
      return;
    }
    if (key === "settings") {
      navigate("/admin/settings");
      return;
    }
    if (key === "logout") {
      message.success("Đã đăng xuất");
      localStorage.clear();
      window.dispatchEvent(new Event('authChanged'));
      navigate("/");
      window.location.reload();
    }
  };


  // Dữ liệu thông báo (Giữ nguyên hoặc cập nhật thêm icon màu Pastel)
  const notifications = [
    { id: 1, title: "Thanh Thuý vừa đặt hàng", time: "5 phút trước", icon: <ShoppingCartOutlined />, color: "#e6f7ff" },
    { id: 2, title: "Đơn hàng #BC-001 thành công", time: "15 phút trước", icon: <CheckCircleOutlined />, color: "#f6ffed" },
  ];

  const notificationContent = (
    <div className="luxury-notification-dropdown">
      <Card
        title={<span className="card-title">Thông báo hệ thống</span>}
        extra={<Button type="link" size="small">Đánh dấu đã đọc</Button>}
        bordered={false}
      >
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item className="notification-item">
              <List.Item.Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" />}
                title={<Text strong>{item.title}</Text>}
                description={<Text type="secondary">{item.time}</Text>}
              />
            </List.Item>
          )}
        />
        <div className="view-all-btn">Xem tất cả thông báo</div>
      </Card>
    </div>
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
    { key: "settings", label: "Cấu hình hệ thống", icon: <SettingOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất tài khoản", icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <Header className="luxury-admin-header">
      <div className="header-container">
        {/* Left Side */}
        <div className="header-left">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed?.(!collapsed)}
            className="toggle-sidebar-btn"
          />
          <div className="breadcrumb-simple">
            <Text type="secondary">Tổng quan</Text>
            <Divider type="vertical" />
            <Text strong>Dashboard</Text>
          </div>
        </div>

        {/* Right Side */}
        <div className="header-right">
          <div className="search-box-luxury">
            <SearchOutlined className="search-icon" />
            <Input placeholder="Tìm kiếm tài nguyên..." variant="borderless" />
          </div>

          <Space size={8}>
            <Tooltip title="Ngôn ngữ">
              <Button type="text" icon={<GlobalOutlined />} className="icon-btn-luxury" />
            </Tooltip>

            <Tooltip title="Toàn màn hình">
              <Button
                type="text"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                className="icon-btn-luxury"
              />
            </Tooltip>

            <Dropdown dropdownRender={() => notificationContent} trigger={["click"]} placement="bottomRight">
              <Badge count={5} size="small" offset={[-4, 4]} color="#D23175">
                <Button type="text" icon={<BellOutlined />} className="icon-btn-luxury" />
              </Badge>
            </Dropdown>
          </Space>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="luxury-user-profile">
              <div className="avatar-container">
                <Avatar
                  size="small"
                  src={avatarSrc || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                  className="luxury-avatar"
                  icon={<UserOutlined />}
                />
                <span className="status-indicator online"></span>
              </div>
              <div className="user-info">
                <Text strong className="name">{displayName}</Text>
                <Text type="secondary" className="role">{currentUser?.role_code === "R1" ? "Administrator" : "Staff"}</Text>
              </div>
              <DownOutlined className="arrow-icon" />
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default HeaderLayoutAdmin;