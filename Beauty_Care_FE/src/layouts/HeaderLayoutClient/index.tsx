import React, { useState } from "react";
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
  message,
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
  PlusOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  DownOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
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
            <span className="search-shortcut">⌘ K</span>
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

          <Divider type="vertical" className="luxury-divider" />

          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
            <div className="luxury-user-profile">
              <div className="avatar-container">
                <Avatar 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                  className="luxury-avatar"
                />
                <span className="status-indicator online"></span>
              </div>
              <div className="user-info">
                <Text strong className="name">Đức Nguyễn</Text>
                <Text type="secondary" className="role">Administrator</Text>
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