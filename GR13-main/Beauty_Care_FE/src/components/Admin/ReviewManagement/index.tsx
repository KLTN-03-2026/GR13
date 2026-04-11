import React, { useMemo, useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Rate,
  Avatar,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
} from "antd";
import {
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./style.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ReviewItem {
  id: number;
  customerName: string;
  avatar: string;
  productName: string;
  rating: number;
  comment: string;
  adminReply?: string;
  createdAt: string;
  status: "pending" | "approved" | "hidden";
}

const ReviewManagementComponent: React.FC = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [form] = Form.useForm();

  // Mock data for Reviews
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 1,
      customerName: "Nguyễn Thị Lan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
      productName: "Sữa rửa mặt Cetaphil",
      rating: 5,
      comment: "Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ tiếp!",
      createdAt: "2024-04-05",
      status: "approved",
      adminReply: "Cảm ơn bạn Lan đã tin tưởng và ủng hộ Beauty Care!",
    },
    {
      id: 2,
      customerName: "Trần Minh Tâm",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tam",
      productName: "Kem chống nắng La Roche-Posay",
      rating: 4,
      comment: "Kem thấm nhanh, không gây bết rít. Tuy nhiên giá hơi cao một chút.",
      createdAt: "2024-04-04",
      status: "approved",
    },
    {
      id: 3,
      customerName: "Lê Hồng Nhung",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nhung",
      productName: "Serum B5 La Roche-Posay",
      rating: 3,
      comment: "Dùng cũng tạm được, chưa thấy hiệu quả rõ rệt lắm.",
      createdAt: "2024-04-03",
      status: "pending",
    },
    {
      id: 4,
      customerName: "Phạm Minh D",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
      productName: "Nước tẩy trang Bioderma",
      rating: 1,
      comment: "Giao sai mẫu mã, nhắn tin shop không thấy trả lời. Rất thất vọng!",
      createdAt: "2024-04-02",
      status: "hidden",
    },
  ]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
    const pending = reviews.filter((r) => r.status === "pending").length;
    const ratingDist = [1, 2, 3, 4, 5].map((star) => ({
      star: `${star} sao`,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    return { total, avg, pending, ratingDist };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      const okSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
      const okRating = ratingFilter === "all" || r.rating === ratingFilter;
      const okStatus = statusFilter === "all" || r.status === statusFilter;
      return okSearch && okRating && okStatus;
    });
  }, [reviews, search, ratingFilter, statusFilter]);

  const updateStatus = (id: number, status: ReviewItem["status"]) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
    message.success(`Đã cập nhật trạng thái đánh giá`);
  };

  const handleReply = (record: ReviewItem) => {
    setSelectedReview(record);
    form.setFieldsValue({ reply: record.adminReply });
    setIsReplyModalVisible(true);
  };

  const handleReplySubmit = () => {
    form.validateFields().then((values) => {
      if (selectedReview) {
        setReviews(
          reviews.map((r) =>
            r.id === selectedReview.id ? { ...r, adminReply: values.reply, status: "approved" } : r
          )
        );
        message.success("Đã gửi phản hồi đánh giá");
        setIsReplyModalVisible(false);
      }
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa đánh giá này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setReviews(reviews.filter((r) => r.id !== id));
        message.success("Đã xóa đánh giá");
      },
    });
  };

  const columns = [
    {
      title: "Khách hàng & Sản phẩm",
      key: "customer",
      width: 300,
      render: (_: any, r: ReviewItem) => (
        <Space align="start">
          <Avatar src={r.avatar} />
          <Space direction="vertical" size={0}>
            <Text strong>{r.customerName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Sản phẩm: {r.productName}</Text>
            <Rate disabled defaultValue={r.rating} style={{ fontSize: 12 }} />
          </Space>
        </Space>
      ),
    },
    {
      title: "Nội dung đánh giá",
      key: "content",
      render: (_: any, r: ReviewItem) => (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Text>{r.comment}</Text>
          {r.adminReply && (
            <div style={{ background: "#f5f5f5", padding: "8px 12px", borderRadius: 8, marginTop: 4 }}>
              <Text strong style={{ fontSize: 12 }}>Phản hồi của shop:</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 13 }}>{r.adminReply}</Text>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = {
          approved: { color: "green", label: "Đã duyệt" },
          pending: { color: "orange", label: "Chờ duyệt" },
          hidden: { color: "red", label: "Đã ẩn" },
        };
        const s = config[status as keyof typeof config];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: any, record: ReviewItem) => (
        <Space>
          <Tooltip title="Phản hồi">
            <Button icon={<MessageOutlined />} onClick={() => handleReply(record)} />
          </Tooltip>
          {record.status === "pending" && (
            <Tooltip title="Duyệt">
              <Button 
                icon={<CheckCircleOutlined />} 
                style={{ color: "#52c41a" }} 
                onClick={() => updateStatus(record.id, "approved")} 
              />
            </Tooltip>
          )}
          {record.status === "approved" && (
            <Tooltip title="Ẩn">
              <Button 
                icon={<CloseCircleOutlined />} 
                style={{ color: "#faad14" }} 
                onClick={() => updateStatus(record.id, "hidden")} 
              />
            </Tooltip>
          )}
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="review-management">
      <Title level={2}>Quản lý đánh giá</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="review-stat-card">
            <Statistic
              title="Tổng đánh giá"
              value={stats.total}
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="review-stat-card">
            <Statistic
              title="Điểm trung bình"
              value={stats.avg}
              suffix="/ 5"
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="review-stat-card">
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="review-stat-card">
            <Statistic
              title="Đánh giá tích cực"
              value={((reviews.filter(r => r.rating >= 4).length / (reviews.length || 1)) * 100).toFixed(0)}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title={<Space><BarChartOutlined /> Phân bổ số sao</Space>} bordered={false}>
            <div style={{ height: 200, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={stats.ratingDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="star" type="category" width={60} />
                  <ChartTooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {stats.ratingDist.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index >= 3 ? "#52c41a" : index === 2 ? "#faad14" : "#ff4d4f"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <FilterOutlined /> Danh sách đánh giá
          </Space>
        }
        bordered={false}
        extra={
          <Space wrap>
            <Select
              placeholder="Lọc theo sao"
              style={{ width: 130 }}
              value={ratingFilter}
              onChange={(v) => setRatingFilter(v)}
              options={[
                { value: "all", label: "Tất cả sao" },
                { value: 5, label: "5 sao" },
                { value: 4, label: "4 sao" },
                { value: 3, label: "3 sao" },
                { value: 2, label: "2 sao" },
                { value: 1, label: "1 sao" },
              ]}
            />
            <Select
              placeholder="Trạng thái"
              style={{ width: 140 }}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "approved", label: "Đã duyệt" },
                { value: "pending", label: "Chờ duyệt" },
                { value: "hidden", label: "Đã ẩn" },
              ]}
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm khách hàng, nội dung..."
              style={{ width: 250 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          size="small"
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Phản hồi đánh giá"
        open={isReplyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => setIsReplyModalVisible(false)}
        okText="Gửi phản hồi"
        cancelText="Hủy"
      >
        {selectedReview && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Khách hàng: </Text>
            <Text strong>{selectedReview.customerName}</Text>
            <br />
            <Text type="secondary">Nội dung: </Text>
            <Text italic>"{selectedReview.comment}"</Text>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            name="reply"
            label="Nội dung phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập nội dung phản hồi" }]}
          >
            <TextArea rows={4} placeholder="Nhập lời cảm ơn hoặc giải đáp thắc mắc..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewManagementComponent;
