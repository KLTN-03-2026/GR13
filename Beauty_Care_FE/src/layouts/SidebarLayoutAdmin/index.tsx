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
  SettingOutlined,
  BarChartOutlined as AnalyticsOutlined,
  MessageOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
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
  const { user: contextUser } = useAuth();

  // Get current key from pathname
  const currentKey = location.pathname.split("/").pop() || "dashboard";

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/admin/${e.key}`);
  };

  // Try to get user from context first, then fallback to localStorage
  let user = contextUser;
  if (!user) {
    try {
      const userRaw = localStorage.getItem("user");
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
      user = null;
    }
  }

  const roleCode = (user as any)?.role_code;

  let menuItems: MenuItem[] = [
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
        { key: "users-admin", icon: <SafetyCertificateOutlined />, label: "Quản trị viên" },
        { key: "users-staff", icon: <TeamOutlined />, label: "Chuyên Gia  " },
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
        { key: "discounts", icon: <PercentageOutlined />, label: "Khuyến mãi" },
      ],
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: "Đơn hàng",
    },

    {
      key: "chat",
      icon: <MessageOutlined />,
      label: "Tư vấn khách hàng",
    },
    {
      key: "content",
      icon: <FileTextOutlined />,
      label: "Nội dung",
      children: [
        { key: "blog-categories", label: "Danh mục bài viết" },
        { key: "blogs", label: "Bài viết" },
        // { key: "reviews", icon: <StarOutlined />, label: "Đánh giá" },
        { key: "advice", label: "Tư vấn soi da" },
      ],
    },

    {
      key: "analytics",
      icon: <AnalyticsOutlined />,
      label: "Phân tích hành vi",
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

  // Role-based filtering for Staff (R2)
  if (roleCode === "R2") {
    const allowedKeys = ["chat", "blogs", "reviews"];
    
    menuItems = menuItems.map(item => {
      if (!item) return null;
      
      // If it's a top-level item with no children
      if (!('children' in item)) {
        return allowedKeys.includes(item.key as string) ? item : null;
      }
      
      // If it's a top-level item with children (like "Nội dung")
      const filteredChildren = (item.children as any[]).filter(child => 
        allowedKeys.includes(child.key as string)
      );
      
      if (filteredChildren.length > 0) {
        // Return a copy with filtered children
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      return null;
    }).filter(item => item !== null) as MenuItem[];
    
    // Add dividers back if needed (or just filter them out for simplicity)
    menuItems = menuItems.filter(item => item && item.type !== "divider");
  }

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
