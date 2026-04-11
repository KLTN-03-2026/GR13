import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Statistic, Select, Space, Table, Divider, Button } from "antd";
import { ArrowLeftOutlined, BarChartOutlined, CheckCircleOutlined, CloseCircleOutlined, OrderedListOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "./style.scss";

const { Title, Text } = Typography;

type Period = "week" | "month" | "year";

const OrderSuccessManagementComponent: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");

  const totals = useMemo(() => {
    const success = 456;
    const failed = 38;
    const cancelled = 22;
    const total = success + failed + cancelled;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
    return { success, failed, cancelled, total, successRate };
  }, []);

  const deliveryRegions = useMemo(
    () => [
      { region: "TP. HCM", deliveries: 210 },
      { region: "Hà Nội", deliveries: 160 },
      { region: "Đà Nẵng", deliveries: 95 },
      { region: "Cần Thơ", deliveries: 70 },
      { region: "Hải Phòng", deliveries: 55 },
    ],
    []
  );

  const successRateByPeriod = useMemo(
    () => ({
      week: [
        { name: "T2", success: 62, failed: 6, cancelled: 3 },
        { name: "T3", success: 58, failed: 4, cancelled: 2 },
        { name: "T4", success: 70, failed: 5, cancelled: 4 },
        { name: "T5", success: 66, failed: 7, cancelled: 3 },
        { name: "T6", success: 75, failed: 6, cancelled: 2 },
        { name: "T7", success: 82, failed: 5, cancelled: 3 },
        { name: "CN", success: 71, failed: 5, cancelled: 5 },
      ],
      month: [
        { name: "Tuần 1", success: 160, failed: 12, cancelled: 8 },
        { name: "Tuần 2", success: 185, failed: 10, cancelled: 6 },
        { name: "Tuần 3", success: 150, failed: 9, cancelled: 5 },
        { name: "Tuần 4", success: 210, failed: 7, cancelled: 3 },
      ],
      year: [
        { name: "T1", success: 620, failed: 45, cancelled: 18 },
        { name: "T2", success: 580, failed: 38, cancelled: 22 },
        { name: "T3", success: 710, failed: 40, cancelled: 25 },
        { name: "T4", success: 660, failed: 35, cancelled: 20 },
        { name: "T5", success: 780, failed: 42, cancelled: 18 },
        { name: "T6", success: 740, failed: 36, cancelled: 21 },
      ],
    }),
    []
  );

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
    </div>
  );
};

export default OrderSuccessManagementComponent;
