import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Avatar, 
  Badge, 
  Progress, 
  Space,
  Tag,
  Divider,
  Select,
  message
} from "antd";
import { 
  UserOutlined, 
  ShoppingOutlined, 
  OrderedListOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  TrophyOutlined,
  CrownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  SwapOutlined
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import "./style.scss";
import { useGetDashboardStats } from "../../../hooks/admin";

const { Title, Text } = Typography;

const AdminOverviewComponent: React.FC = () => {
  const navigate = useNavigate();
  const [importExportPeriod, setImportExportPeriod] = useState<"week" | "month" | "year">("week");
  const { data: dashboardRes, isLoading, isError } = useGetDashboardStats();

  useEffect(() => {
    if (isError) message.error("Không thể tải thống kê dashboard");
  }, [isError]);

  const dashboard = dashboardRes?.data;
  const totalRevenue = useMemo(() => {
    const n = Number(dashboard?.totalRevenue ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [dashboard?.totalRevenue]);

  // Mock data for Import/Export Chart
  const importExportData = {
    week: [
      { name: "T2", import: 40, export: 24 },
      { name: "T3", import: 30, export: 13 },
      { name: "T4", import: 20, export: 58 },
      { name: "T5", import: 27, export: 39 },
      { name: "T6", import: 18, export: 48 },
      { name: "T7", import: 23, export: 38 },
      { name: "CN", import: 34, export: 43 },
    ],
    month: [
      { name: "Tuần 1", import: 140, export: 124 },
      { name: "Tuần 2", import: 130, export: 113 },
      { name: "Tuần 3", import: 120, export: 158 },
      { name: "Tuần 4", import: 127, export: 139 },
    ],
    year: [
      { name: "Tháng 1", import: 400, export: 240 },
      { name: "Tháng 2", import: 300, export: 130 },
      { name: "Tháng 3", import: 200, export: 580 },
      { name: "Tháng 4", import: 278, export: 390 },
      { name: "Tháng 5", import: 189, export: 480 },
      { name: "Tháng 6", import: 239, export: 380 },
    ],
  };

  // Mock data for Revenue Chart
  const revenueData = [
    { name: "T2", revenue: 4000, orders: 24 },
    { name: "T3", revenue: 3000, orders: 13 },
    { name: "T4", revenue: 2000, orders: 98 },
    { name: "T5", revenue: 2780, orders: 39 },
    { name: "T6", revenue: 1890, orders: 48 },
    { name: "T7", revenue: 2390, orders: 38 },
    { name: "CN", revenue: 3490, orders: 43 },
  ];

  // Mock data for Category Distribution
  const categoryData = [
    { name: "Làm sạch", value: 400 },
    { name: "Chống nắng", value: 300 },
    { name: "Tinh chất", value: 300 },
    { name: "Trang điểm", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Mock data for Top Products
  const topProducts = [
    {
      key: "1",
      name: "Sữa rửa mặt Cetaphil",
      category: "Làm sạch",
      sales: 450,
      stock: 120,
      revenue: "67,500,000đ",
      status: "Bán chạy",
    },
    {
      key: "2",
      name: "Kem chống nắng La Roche-Posay",
      category: "Chống nắng",
      sales: 380,
      stock: 45,
      revenue: "182,400,000đ",
      status: "Bán chạy",
    },
    {
      key: "3",
      name: "Serum B5 The Ordinary",
      category: "Tinh chất",
      sales: 310,
      stock: 80,
      revenue: "93,000,000đ",
      status: "Ổn định",
    },
    {
      key: "4",
      name: "Nước tẩy trang Bioderma",
      category: "Làm sạch",
      sales: 290,
      stock: 150,
      revenue: "110,200,000đ",
      status: "Ổn định",
    },
  ];

  // Mock data for Potential Customers
  const potentialCustomers = [
    {
      key: "1",
      name: "Nguyễn Thị Lan",
      orders: 15,
      totalSpent: "25,400,000đ",
      lastOrder: "2 giờ trước",
      level: "VIP",
    },
    {
      key: "2",
      name: "Trần Minh Tâm",
      orders: 12,
      totalSpent: "18,200,000đ",
      lastOrder: "1 ngày trước",
      level: "VIP",
    },
    {
      key: "3",
      name: "Lê Hồng Nhung",
      orders: 8,
      totalSpent: "12,500,000đ",
      lastOrder: "3 ngày trước",
      level: "Thân thiết",
    },
  ];

  const columnsProducts = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Đã bán",
      dataIndex: "sales",
      key: "sales",
      sorter: (a: any, b: any) => a.sales - b.sales,
      render: (sales: number) => <Tag color="blue">{sales}</Tag>,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={status === "Bán chạy" ? "processing" : "default"} text={status} />
      ),
    },
  ];

  const columnsCustomers = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Đơn",
      dataIndex: "orders",
      key: "orders",
      align: "center" as const,
      width: 70,
    },
    {
      title: "Chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      width: 110,
    },
    {
      title: "Hạng",
      dataIndex: "level",
      key: "level",
      width: 90,
      render: (level: string) => (
        <Tag color={level === "VIP" ? "gold" : "cyan"} style={{ margin: 0 }}>{level}</Tag>
      ),
    },
  ];

  return (
    <div className="admin-overview">
      <Title level={2} className="overview-title">Báo cáo Tổng quan</Title>
      
      {/* Top statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            bordered={false} 
            className="stat-card" 
            hoverable 
            onClick={() => navigate("/admin/revenue")}
            style={{ cursor: "pointer" }}
            loading={isLoading}
          >
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="stat-footer">
              <Text type="success"><ArrowUpOutlined /> 12.5%</Text> so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="stat-card"
            hoverable
            onClick={() => navigate("/admin/orders-success")}
            style={{ cursor: "pointer" }}
            loading={isLoading}
          >
            <Statistic
              title="Đơn hàng thành công"
              value={dashboard?.ordersByStatus?.completed ?? 0}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="stat-footer">
              <Text type="success"><ArrowUpOutlined /> 8.2%</Text> so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            bordered={false} 
            className="stat-card" 
            hoverable 
            onClick={() => navigate("/admin/products")}
            style={{ cursor: "pointer" }}
            loading={isLoading}
          >
            <Statistic
              title="Sản phẩm đang bán"
              value={dashboard?.totalProducts ?? 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
            <div className="stat-footer">
              <Text type="secondary">Tăng 5 sản phẩm mới</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            bordered={false} 
            className="stat-card"
            hoverable 
            onClick={() => navigate("/admin/users-customers")}
            style={{ cursor: "pointer" }}
            loading={isLoading}
          >
            <Statistic
              title="Người dùng"
              value={dashboard?.totalUsers ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div className="stat-footer">
              <Text type="success"><ArrowUpOutlined /> 15%</Text> tỷ lệ tăng trưởng
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={<Space><BarChartOutlined /> Biểu đồ doanh thu tuần này</Space>} bordered={false}>
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1890ff" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><PieChartOutlined /> Cơ cấu danh mục</Space>} bordered={false}>
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Product Stats (Import vs Sold) */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Space><SwapOutlined /> Thống kê Nhập - Xuất hàng hóa</Space>
                <Select
                  value={importExportPeriod}
                  onChange={(value) => setImportExportPeriod(value)}
                  style={{ width: 120 }}
                  options={[
                    { value: 'week', label: 'Xem Tuần' },
                    { value: 'month', label: 'Xem Tháng' },
                    { value: 'year', label: 'Xem Năm' },
                  ]}
                />
              </div>
            } 
            bordered={false}
          >
            <div style={{ height: 400, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={importExportData[importExportPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36}/>
                  <Bar 
                    dataKey="import" 
                    fill="#52c41a" 
                    name="Nhập kho" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                  />
                  <Bar 
                    dataKey="export" 
                    fill="#1890ff" 
                    name="Xuất kho (Bán ra)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <Divider style={{ margin: '24px 0 16px' }} />
            
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <div className="progress-stat">
                  <div className="progress-info">
                    <Text>Tỷ lệ hoàn thành mục tiêu nhập</Text>
                    <Text strong>75%</Text>
                  </div>
                  <Progress percent={75} strokeColor="#52c41a" />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="progress-stat">
                  <div className="progress-info">
                    <Text>Tỷ lệ tăng trưởng xuất kho</Text>
                    <Text strong>+12.4%</Text>
                  </div>
                  <Progress percent={65} strokeColor="#1890ff" status="active" />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} xl={14}>
          <Card 
            title={<Space><TrophyOutlined style={{color: '#faad14'}} /> Top sản phẩm bán chạy nhất</Space>} 
            bordered={false}
          >
            <Table 
              columns={columnsProducts} 
              dataSource={topProducts} 
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card 
            title={<Space><CrownOutlined style={{color: '#fa8c16'}} /> Khách hàng tiềm năng</Space>} 
            bordered={false}
          >
            <Table 
              columns={columnsCustomers} 
              dataSource={potentialCustomers} 
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default AdminOverviewComponent;
