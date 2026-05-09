import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Statistic, Select, Space, Table, Divider, Button, Spin, message } from "antd";
import { ArrowLeftOutlined, BarChartOutlined, CheckCircleOutlined, CloseCircleOutlined, OrderedListOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getAdminAnalytics } from "../../../api/admin";
import "./style.scss";

const { Title, Text } = Typography;

type Period = "week" | "month" | "year";

interface OrderStatsData {
  totals: {
    total: number;
    success: number;
    failed: number;
    cancelled: number;
    successRate: number;
  };
  orderStatsByPeriod: {
    week: { name: string; success: number; failed: number; cancelled: number }[];
    month: { name: string; success: number; failed: number; cancelled: number }[];
    year: { name: string; success: number; failed: number; cancelled: number }[];
  };
  deliveryRegions: { region: string; deliveries: number }[];
}

interface AnalyticsData {
  orderStats?: OrderStatsData;
}

const OrderSuccessManagementComponent: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");
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

  const totals = useMemo(() => {
    if (!analyticsData?.orderStats?.totals) {
      return { success: 0, failed: 0, cancelled: 0, total: 0, successRate: 0 };
    }
    return analyticsData.orderStats.totals;
  }, [analyticsData]);

  const deliveryRegions = useMemo(() => {
    if (!analyticsData?.orderStats?.deliveryRegions) return [];
    return analyticsData.orderStats.deliveryRegions;
  }, [analyticsData]);

  const successRateByPeriod = useMemo(() => {
    if (!analyticsData?.orderStats?.orderStatsByPeriod) {
      return {
        week: [],
        month: [],
        year: []
      };
    }
    return analyticsData.orderStats.orderStatsByPeriod;
  }, [analyticsData]);

  const donutData = useMemo(
    () => [
      { name: "Thành công", value: totals.success, color: "#52c41a" },
      { name: "Thất bại", value: totals.failed, color: "#ff4d4f" },
      { name: "Hủy", value: totals.cancelled, color: "#faad14" },
    ],
    [totals]
  );

  const regionColumns = [
    {
      title: "Khu vực",
      dataIndex: "region",
      key: "region",
      render: (t: string) => <Text strong>{t}</Text>,
    },
    {
      title: "Số đơn giao",
      dataIndex: "deliveries",
      key: "deliveries",
      width: 120,
      render: (v: number) => <Text>{v}</Text>,
    },
  ];

  return (
    <div className="order-success-management">
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")} />
              <Title level={2} style={{ margin: 0 }}>Thống kê đơn hàng thành công</Title>
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
          <Col xs={24} md={6}>
            <Card bordered={false} className="order-stat-card">
              <Statistic title="Tổng đơn" value={totals.total} prefix={<OrderedListOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} className="order-stat-card">
              <Statistic title="Thành công" value={totals.success} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} className="order-stat-card">
              <Statistic title="Thất bại" value={totals.failed} prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} className="order-stat-card">
              <Statistic title="Tỷ lệ thành công" value={totals.successRate} suffix="%" valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title={<Space><BarChartOutlined /> Tỷ lệ theo thời gian</Space>} bordered={false}>
              <div style={{ height: 360, width: "100%" }}>
                <ResponsiveContainer>
                  <BarChart data={successRateByPeriod[period]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="success" fill="#52c41a" name="Thành công" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" fill="#ff4d4f" name="Thất bại" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cancelled" fill="#faad14" name="Hủy" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<Space><OrderedListOutlined /> Cơ cấu trạng thái</Space>} bordered={false}>
              <div style={{ height: 360, width: "100%" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={donutData} dataKey="value" innerRadius={70} outerRadius={95} paddingAngle={4} label>
                      {donutData.map((d, idx) => (
                        <Cell key={String(idx)} fill={d.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title={<Space><BarChartOutlined /> Khu vực giao hàng nhiều nhất</Space>} bordered={false}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                  <div style={{ height: 300, width: "100%" }}>
                    <ResponsiveContainer>
                      <BarChart data={deliveryRegions} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="region" type="category" width={120} />
                        <ChartTooltip />
                        <Bar dataKey="deliveries" fill="#1890ff" name="Số đơn giao" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                <Col xs={24} lg={10}>
                  <Divider orientation={"left" as any} style={{ marginTop: 0 }}>Top khu vực</Divider>
                  <Table columns={regionColumns} dataSource={deliveryRegions.map((d, i) => ({ key: String(i), ...d }))} pagination={false} size="small" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default OrderSuccessManagementComponent;
