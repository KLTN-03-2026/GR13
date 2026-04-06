import React from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  HeartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarLayoutAdminProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SidebarLayoutAdmin: React.FC<SidebarLayoutAdminProps> = ({
  collapsed,
  onCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current key from pathname
  const currentKey = location.pathname.split("/").pop() || "dashboard";

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/admin/${e.key}`);
  };

  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    {
      type: "divider",
    },
    {
      key: "users-group",
      icon: <TeamOutlined />,
      label: "Quản lý người dùng",
      children: [
        { key: "users-admin", icon: <SafetyCertificateOutlined />, label: "Admin" },
        { key: "users-staff", icon: <TeamOutlined />, label: "Nhân viên" },
        { key: "users-customers", icon: <UserOutlined />, label: "Khách hàng" },
      ],
    },
    {
      key: "catalog",
      icon: <AppstoreOutlined />,
      label: "Danh mục & Sản phẩm",
      children: [
        { key: "categories", label: "Danh mục" },
        { key: "products", icon: <ShoppingOutlined />, label: "Sản phẩm" },
      ],
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: "Đơn hàng",
    },
    {
      key: "bookings",
      icon: <CalendarOutlined />,
      label: "Lịch hẹn",
    },
    {
      key: "content",
      icon: <FileTextOutlined />,
      label: "Nội dung",
      children: [
        { key: "blogs", label: "Bài viết" },
        { key: "reviews", icon: <StarOutlined />, label: "Đánh giá" },
      ],
    },
    {
      key: "wishlist",
      icon: <HeartOutlined />,
      label: "Danh sách yêu thích",
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt hệ thống",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => onCollapse(value)}
      trigger={null}
      width={260}
      theme="light"
      className="sidebar-layout-admin"
    >
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        onClick={handleMenuClick}
        items={menuItems}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default SidebarLayoutAdmin;
