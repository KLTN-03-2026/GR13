import React, { useState } from "react";
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
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import "./style.scss";

const { Header } = Layout;

interface HeaderLayoutAdminProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const HeaderLayoutAdmin: React.FC<HeaderLayoutAdminProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

          <Space size={4} className="action-icons">
            <Dropdown menu={{ items: quickActionItems }} trigger={["click"]}>
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
              <Button type="text" icon={<QuestionCircleOutlined />} className="action-btn" />
            </Tooltip>

            <Dropdown menu={{ items: languageItems }} trigger={["click"]}>
              <Tooltip title="Ngôn ngữ">
                <Button type="text" icon={<GlobalOutlined />} className="action-btn" />
              </Tooltip>
            </Dropdown>

            <Badge count={5} size="small" offset={[-2, 10]}>
              <Tooltip title="Thông báo">
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: "18px" }} />}
                  className="action-btn"
                />
              </Tooltip>
            </Badge>
          </Space>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="user-profile">
              <Avatar
                size="small"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                icon={<UserOutlined />}
              />
              <span className="user-name">Quản trị viên</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderLayoutAdmin;
