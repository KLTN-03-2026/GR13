import React, { useMemo } from "react";
import { Typography, Card, Row, Col, Space, Table, Tag, Statistic } from "antd";
import {
  ThunderboltOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  ArrowUpOutlined
} from "@ant-design/icons";
import { useGetDashboardStats, useGetAnalyticsStats } from "../../../hooks/admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

const AnalyticsManagementComponent: React.FC = () => {
  const { data: dashboardRes, isLoading: isLoadingDashboard } = useGetDashboardStats() as any;
  const { data: analyticsRes, isLoading: isLoadingAnalytics } = useGetAnalyticsStats() as any;

  const dashboard = (dashboardRes as any)?.data;
  const analytics = (analyticsRes as any)?.data;

  const isLoading = isLoadingDashboard || isLoadingAnalytics;

  const totalRevenue = useMemo(() => {
    const n = Number(dashboard?.totalRevenue ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [dashboard?.totalRevenue]);

  const productInteractions = analytics?.productInteractions || [];
  const priceRangeData = analytics?.priceRangeData || [];
  const peakHoursData = analytics?.peakHoursData || [];
  const trendingFavorites = analytics?.trendingFavorites || [];
  const spaServicesStats = analytics?.spaServicesStats || [];
  const topStaffs = analytics?.topStaffs || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="analytics-management">
      <Title level={2}>Phân tích hành vi người dùng</Title>

      {/* Thống kê tổng quan từ dữ liệu thật */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card" loading={isLoading}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="stat-footer" style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> Dữ liệu thực tế</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card" loading={isLoading}>
            <Statistic
              title="Đơn hàng thành công"
              value={dashboard?.ordersByStatus?.completed ?? 0}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="stat-footer" style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> Dữ liệu thực tế</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card" loading={isLoading}>
            <Statistic
              title="Sản phẩm hệ thống"
              value={dashboard?.totalProducts ?? 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
            <div className="stat-footer" style={{ marginTop: 8 }}>
              <Text type="secondary">Tổng sản phẩm</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card" loading={isLoading}>
            <Statistic
              title="Người dùng"
              value={dashboard?.totalUsers ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div className="stat-footer" style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> Tài khoản đăng ký</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Hàng 1: Sản phẩm & Khung giá */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><ThunderboltOutlined /> Sản phẩm được quan tâm nhất</Space>} 
            bordered={false}
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={productInteractions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} style={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#1890ff" name="Lượt nhấp vào" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="adds" fill="#52c41a" name="Thêm vào giỏ" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<Space><DollarOutlined /> Thống kê theo khung giá</Space>} 
            bordered={false}
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="many" fill="#52c41a" name="Mua nhiều" stackId="a" />
                  <Bar dataKey="little" fill="#faad14" name="Mua ít" stackId="a" />
                  <Bar dataKey="none" fill="#f5222d" name="Không mua" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Hàng 2: Top Sản phẩm yêu thích & Dịch vụ Spa yêu thích */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><HeartOutlined style={{ color: "#ff4d4f" }} /> Top sản phẩm yêu thích thịnh hành</Space>} 
            bordered={false}
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={trendingFavorites}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#ff4d4f" name="Lượt yêu thích" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<Space><StarOutlined style={{ color: "#faad14" }} /> Dịch vụ Spa được yêu thích</Space>} 
            bordered={false}
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={spaServicesStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"

                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  >
                    {spaServicesStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Hàng 3: Nhân viên & Khung giờ */}
        <Col xs={24} lg={14}>
          <Card 
            title={<Space><TeamOutlined /> Nhân viên được yêu thích cao</Space>} 
            bordered={false}
          >
            <Table 
              dataSource={topStaffs} 
              pagination={false} 
              size="small"
              columns={[
                { title: "Nhân viên", dataIndex: "name", key: "name", render: (text) => <Text strong>{text}</Text> },
                { title: "Chuyên môn", dataIndex: "specialty", key: "specialty" },
                { 
                  title: "Đánh giá", 
                  dataIndex: "rating", 
                  key: "rating",
                  render: (val) => <Tag color="gold">{val} ★</Tag>
                },
                { title: "Lượt review", dataIndex: "reviews", key: "reviews", render: (val) => `${val}+` },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            title={<Space><ClockCircleOutlined /> Khung giờ mua hàng phổ biến</Space>} 
            bordered={false}
          >
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer>
                <AreaChart data={peakHoursData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#722ed1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#722ed1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#722ed1" 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                    name="Số đơn hàng"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsManagementComponent;
