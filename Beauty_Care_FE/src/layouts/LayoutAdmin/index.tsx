import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderLayoutAdmin from "../HeaderLayoutAdmin";
import SidebarLayoutAdmin from "../SidebarLayoutAdmin";
import "./style.scss";

const { Content } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="layout-admin-container">
      {/* Header stays at the top */}
      <HeaderLayoutAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout className="layout-admin-body">
        {/* Sidebar below Header */}
        <SidebarLayoutAdmin 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)} 
        />
        
        {/* Content area */}
        <Content className="layout-admin-content">
          <div className="content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
