import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Statistic, Select, Table, Space, Divider, Button } from "antd";
import { ArrowLeftOutlined, BarChartOutlined, DollarOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

const RevenueManagementComponent: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const detailedRevenueData = useMemo(
    () => ({
      week: [
        { name: "T2", revenue: 4000000 },
        { name: "T3", revenue: 3000000 },
        { name: "T4", revenue: 5000000 },
        { name: "T5", revenue: 4500000 },
        { name: "T6", revenue: 6000000 },
        { name: "T7", revenue: 8000000 },
        { name: "CN", revenue: 7500000 },
      ],
      month: [
        { name: "Tuần 1", revenue: 25000000 },
        { name: "Tuần 2", revenue: 32000000 },
        { name: "Tuần 3", revenue: 28000000 },
        { name: "Tuần 4", revenue: 45000000 },
      ],
      year: [
        { name: "T1", revenue: 120000000 },
        { name: "T2", revenue: 150000000 },
        { name: "T3", revenue: 180000000 },
        { name: "T4", revenue: 140000000 },
        { name: "T5", revenue: 210000000 },
        { name: "T6", revenue: 190000000 },
      ],
    }),
    []
  );

  const topProducts = useMemo(
    () => [
      {
        key: "1",
        name: "Kem chống nắng La Roche-Posay",
        category: "Chống nắng",
        sales: 380,
        revenue: 182400000,
        status: "Bán chạy",
      },
      {
        key: "2",
        name: "Nước tẩy trang Bioderma",
        category: "Làm sạch",
        sales: 290,
        revenue: 110200000,
        status: "Ổn định",
      },
      {
        key: "3",
        name: "Serum B5 The Ordinary",
        category: "Tinh chất",
        sales: 310,
        revenue: 93000000,
        status: "Ổn định",
      },
      {
        key: "4",
        name: "Sữa rửa mặt Cetaphil",
        category: "Làm sạch",
        sales: 450,
        revenue: 67500000,
        status: "Bán chạy",
      },
    ],
    []
  );

  const totals = useMemo(() => {
    const totalRevenue = detailedRevenueData[period].reduce((sum, i) => sum + i.revenue, 0);
    const growth = 12.5;
    const avgOrder = 333000;
    return { totalRevenue, growth, avgOrder };
  }, [detailedRevenueData, period]);

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
      width: 140,
    },
    {
      title: "Đã bán",
      dataIndex: "sales",
      key: "sales",
      width: 90,
      render: (sales: number) => <Text>{sales}</Text>,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      width: 140,
      render: (v: number) => <Text strong>{`${v.toLocaleString()}đ`}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => <Text type={status === "Bán chạy" ? "success" : "secondary"}>{status}</Text>,
    },
  ];

  return (
    <div className="revenue-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")} />
            <Title level={2} style={{ margin: 0 }}>Thống kê doanh thu</Title>
          </Space>
        </Col>
        <Col>
          <Select
            value={period}
            onChange={(v) => setPeriod(v)}
            options={[
              { label: "Theo Tuần", value: "week" },
              { label: "Theo Tháng", value: "month" },
              { label: "Theo Năm", value: "year" },
            ]}
            style={{ width: 120 }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="revenue-stat-card">
            <Statistic title="Tổng doanh thu" value={totals.totalRevenue} suffix="đ" prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="revenue-stat-card">
            <Statistic title="Tăng trưởng" value={totals.growth} suffix="%" prefix={<ArrowUpOutlined />} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="revenue-stat-card">
            <Statistic title="Trung bình/Đơn" value={totals.avgOrder} suffix="đ" />
          </Card>
        </Col>
      </Row>

      <Card title={<Space><BarChartOutlined /> Doanh thu theo thời gian</Space>} bordered={false}>
        <div style={{ height: 360, width: "100%" }}>
          <ResponsiveContainer>
            <AreaChart data={detailedRevenueData[period]}>
              <defs>
                <linearGradient id="colorRevenueDetailPage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#722ed1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#722ed1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(val) => `${Math.round(Number(val) / 1000000)}M`} />
              <ChartTooltip
                formatter={(value: any) => {
                  const n = typeof value === "number" ? value : Number(value ?? 0);
                  return [`${n.toLocaleString()}đ`, "Doanh thu"];
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#722ed1" fillOpacity={1} fill="url(#colorRevenueDetailPage)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <Divider orientation={"left" as any}>Top sản phẩm doanh thu cao</Divider>
        <Table columns={columnsProducts} dataSource={topProducts} pagination={false} size="small" scroll={{ x: "max-content" }} />
      </Card>
    </div>
  );
};

export default RevenueManagementComponent;
