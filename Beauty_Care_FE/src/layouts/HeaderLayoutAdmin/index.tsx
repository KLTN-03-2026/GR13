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

  const handleQuickActionClick = ({ key }: { key: string }) => {
    switch (key) {
      case "new-product":
        navigate("/admin/products?action=create");
        break;
      case "new-blog":
        navigate("/admin/blogs?action=create");
        break;
      case "new-booking":
        navigate("/admin/bookings?action=create");
        break;
      default:
        break;
    }
  };

  const handleOpenHelp = () => {
    navigate("/admin/help");
  };

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const notifications = [
    {
      id: 1,
      title: "Thanh Thuý vừa đặt hàng",
      time: "5 phút trước",
      icon: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
      status: "new",
    },
    {
      id: 2,
      title: "Đơn hàng #BC-001 giao thành công",
      time: "15 phút trước",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      status: "success",
    },
    {
      id: 3,
      title: "Lịch hẹn mới: Nguyễn Văn A",
      time: "1 giờ trước",
      icon: <CalendarOutlined style={{ color: "#faad14" }} />,
      status: "appointment",
    },
    {
      id: 4,
      title: "Bài viết của bạn đã được duyệt",
      time: "3 giờ trước",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      status: "info",
    },
    {
      id: 5,
      title: "Có 2 đánh giá mới chưa phản hồi",
      time: "5 giờ trước",
      icon: <BellOutlined style={{ color: "#ff4d4f" }} />,
      status: "alert",
    },
  ];

  const notificationContent = (
    <Card
      title="Thông báo mới"
      extra={<a href="#">Xem tất cả</a>}
      style={{ width: 350, boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08)" }}
      styles={{ body: { padding: 0 } }}
    >
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="notification-item" style={{ padding: "12px 16px", cursor: "pointer" }}>
            <List.Item.Meta
              avatar={<Avatar icon={item.icon} style={{ backgroundColor: "#f0f2f5" }} />}
              title={<Text strong style={{ fontSize: 14 }}>{item.title}</Text>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const quickActionItems: MenuProps["items"] = [
    {
      key: "new-product",
      label: "Thêm sản phẩm mới",
      icon: <PlusOutlined />,
    },
    {
      key: "new-blog",
      label: "Viết bài mới",
      icon: <PlusOutlined />,
    },
    {
      key: "new-booking",
      label: "Tạo lịch hẹn mới",
      icon: <PlusOutlined />,
    },
  ];

  const languageItems: MenuProps["items"] = [
    { key: "vi", label: "Tiếng Việt", icon: <span>🇻🇳</span> },
    { key: "en", label: "English", icon: <span>🇺🇸</span> },
  ];

  return (
    <Header className="header-layout-admin">
      <div className="header-left">
        {setCollapsed && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
          />
        )}
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="header-logo" />
          <Typography.Title level={3} style={{ margin: 0 }} className="header-title">
            Beauty Care
          </Typography.Title>
        </div>
      </div>

      <div className="header-right">
        <Space size={0} split={<Divider type="vertical" />}>
          <div className="header-search-wrapper">
            <Input
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              placeholder="Tìm kiếm hệ thống..."
              variant="borderless"
              className="header-search"
            />
          </div>

          <Space size={16} align="center">
            <Dropdown menu={{ items: quickActionItems, onClick: handleQuickActionClick }} trigger={["click"]}>
              <Tooltip title="Thêm nhanh">
                <Button type="text" icon={<PlusOutlined />} className="action-btn" />
              </Tooltip>
            </Dropdown>

            <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
              <Button
                type="text"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                className="action-btn"
              />
            </Tooltip>

            <Tooltip title="Trợ giúp">
              <Button type="text" icon={<QuestionCircleOutlined />} className="action-btn" onClick={handleOpenHelp} />
            </Tooltip>

            <Dropdown menu={{ items: languageItems }} trigger={["click"]}>
              <Tooltip title="Ngôn ngữ">
                <Button type="text" icon={<GlobalOutlined />} className="action-btn" />
              </Tooltip>
            </Dropdown>

            <Dropdown dropdownRender={() => notificationContent} trigger={["click"]} placement="bottomRight">
              <Badge count={5} size="small" offset={[-2, 10]}>
                <Tooltip title="Thông báo">
                  <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: "18px" }} />}
                    className="action-btn"
                  />
                </Tooltip>
              </Badge>
            </Dropdown>
          </Space>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="user-profile">
              <Avatar
                size="small"
                src={avatarSrc || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                icon={<UserOutlined />}
              />
              <span className="user-name">{displayName}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderLayoutAdmin;
