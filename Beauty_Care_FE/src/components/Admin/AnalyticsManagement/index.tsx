import React, { useMemo } from "react";
import { Typography, Card, Row, Col, Space, Table, Tag } from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ThunderboltOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

const AnalyticsManagementComponent: React.FC = () => {
  // 1. Dữ liệu Sản phẩm được Quan tâm (Nhấp vào vs Thêm vào giỏ)
  const productInteractions = [
    { name: "Sữa rửa mặt Cetaphil", clicks: 450, adds: 120 },
    { name: "Kem chống nắng LRP", clicks: 380, adds: 95 },
    { name: "Serum B5 LRP", clicks: 310, adds: 80 },
    { name: "Tẩy trang Bioderma", clicks: 290, adds: 110 },
    { name: "Kem dưỡng ẩm", clicks: 250, adds: 60 },
  ];

  // 2. Dữ liệu Phân tích Khung giá (Mua nhiều, ít, không mua)
  const priceRangeData = [
    { range: "0 - 200k", many: 150, little: 45, none: 20 },
    { range: "200k - 500k", many: 280, little: 60, none: 15 },
    { range: "500k - 1tr", many: 120, little: 80, none: 40 },
    { range: "Trên 1tr", many: 40, little: 30, none: 55 },
  ];

  // 3. Dữ liệu Khung giờ mua hàng (Peak Hours)
  const peakHoursData = [
    { hour: "00:00", orders: 5 },
    { hour: "04:00", orders: 12 },
    { hour: "08:00", orders: 85 },
    { hour: "12:00", orders: 65 },
    { hour: "16:00", orders: 110 },
    { hour: "20:00", orders: 95 },
    { hour: "23:59", orders: 40 },
  ];

  // 4. Top Sản phẩm Yêu thích Thịnh hành
  const trendingFavorites = [
    { name: "Serum B5 The Ordinary", likes: 1250 },
    { name: "Kem chống nắng LRP", likes: 980 },
    { name: "Sữa rửa mặt Cetaphil", likes: 850 },
    { name: "Tẩy trang Bioderma", likes: 720 },
    { name: "Mặt nạ ngủ Laneige", likes: 640 },
  ];

  // 5. Top Dịch vụ Spa Thịnh hành
  const spaServicesStats = [
    { name: "Chăm sóc da mặt chuyên sâu", value: 45 },
    { name: "Massage body đá nóng", value: 25 },
    { name: "Gội đầu dưỡng sinh", value: 15 },
    { name: "Triệt lông vĩnh viễn", value: 10 },
    { name: "Nâng cơ trẻ hóa", value: 5 },
  ];

  // 6. Danh sách Nhân viên được yêu thích cao
  const topStaffs = [
    { key: "1", name: "Trần Minh Tâm", specialty: "Chuyên viên Da liễu", rating: 4.9, reviews: 150 },
    { key: "2", name: "Nguyễn Lan Anh", specialty: "Kỹ thuật viên Massage", rating: 4.8, reviews: 120 },
    { key: "3", name: "Lê Mai Chi", specialty: "Kỹ thuật viên Spa", rating: 4.7, reviews: 95 },
    { key: "4", name: "Phạm Quốc Đạt", specialty: "Chuyên viên Tư vấn", rating: 4.6, reviews: 80 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="analytics-management">
      <Title level={2}>Phân tích hành vi người dùng</Title>

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
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {spaServicesStats.map((entry, index) => (
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
