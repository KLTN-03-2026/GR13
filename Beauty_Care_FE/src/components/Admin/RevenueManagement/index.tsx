import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Statistic, Select, Table, Space, Divider, Button, DatePicker, Spin, message } from "antd";
import { ArrowLeftOutlined, BarChartOutlined, DollarOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import { getAdminAnalytics } from "../../../api/admin";
import "./style.scss";

const { Title, Text } = Typography;

interface RevenueData {
  name: string;
  revenue: number;
}

interface TopProduct {
  key: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  status: string;
}

interface AnalyticsData {
  revenueDataByPeriod: {
    week: RevenueData[];
    month: RevenueData[];
    year: RevenueData[];
    custom: RevenueData[];
  };
  topProducts: TopProduct[];
  totals: {
    totalRevenue: number;
    growth: number;
    avgOrder: number;
  };
}

const RevenueManagementComponent: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"week" | "month" | "year" | "custom">("month");
  const [customDateRange, setCustomDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAdminAnalytics();
        if (response.err === 0) {
          setAnalyticsData(response.data);
        } else {
          message.error(response.mess || "Lỗi khi lấy dữ liệu");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        message.error("Lỗi khi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const detailedRevenueData = useMemo(() => {
    if (!analyticsData?.revenueDataByPeriod) {
      return {
        week: [],
        month: [],
        year: [],
        custom: [],
      };
    }
    return analyticsData.revenueDataByPeriod;
  }, [analyticsData]);

  const topProducts = useMemo(() => {
    if (!analyticsData?.topProducts) return [];
    return analyticsData.topProducts;
  }, [analyticsData]);

  const totals = useMemo(() => {
    if (!analyticsData?.totals) {
      return { totalRevenue: 0, growth: 0, avgOrder: 0 };
    }
    return analyticsData.totals;
  }, [analyticsData]);

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
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")} />
              <Title level={2} style={{ margin: 0 }}>Thống kê doanh thu</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Select
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "Theo Tuần", value: "week" },
                  { label: "Theo Tháng", value: "month" },
                  { label: "Theo Năm", value: "year" },
                  { label: "Tùy chọn", value: "custom" },
                ]}
                style={{ width: 140 }}
              />
              {period === "custom" && (
                <DatePicker.RangePicker
                  value={customDateRange}
                  onChange={(dates) => setCustomDateRange(dates)}
                  style={{ width: 250 }}
                  format="DD/MM/YYYY"
                />
              )}
            </Space>
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
              <Statistic title="Tăng trưởng" value={totals.growth} suffix="%" prefix={<ArrowUpOutlined />} valueStyle={{ color: totals.growth >= 0 ? "#3f8600" : "#cf1322" }} />
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
        {topProducts.length > 0 ? (
          <Table columns={columnsProducts} dataSource={topProducts} pagination={false} size="small" scroll={{ x: "max-content" }} />
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
            <Typography.Text type="secondary">Chưa có sản phẩm nào được bán ra</Typography.Text>
          </div>
        )}
        </Card>
      </Spin>
    </div>
  );
};

export default RevenueManagementComponent;
