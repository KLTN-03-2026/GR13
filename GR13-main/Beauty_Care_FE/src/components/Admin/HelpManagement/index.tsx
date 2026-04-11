import React from "react";
import { Typography, Card, Row, Col, Anchor, Steps, Collapse, Space, Tag, Divider } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Title, Text } = Typography;

const HelpManagementComponent: React.FC = () => {
  const anchorItems = [
    { key: "overview", href: "#overview", title: "Tổng quan" },
    { key: "quick-add", href: "#quick-add", title: "Thêm nhanh" },
    { key: "notifications", href: "#notifications", title: "Thông báo" },
    { key: "users", href: "#users", title: "Người dùng" },
    { key: "products", href: "#products", title: "Sản phẩm" },
    { key: "orders", href: "#orders", title: "Đơn hàng" },
    { key: "bookings", href: "#bookings", title: "Lịch hẹn" },
    { key: "content", href: "#content", title: "Bài viết & đánh giá" },
    { key: "analytics", href: "#analytics", title: "Phân tích hành vi" },
    { key: "settings", href: "#settings", title: "Cài đặt" },
  ];

  const faqItems = [
    {
      key: "faq-1",
      label: "Tôi muốn tạo nhanh sản phẩm / bài viết / lịch hẹn?",
      children: (
        <div>
          <Text>
            Trên thanh Header có nút <Tag icon={<PlusOutlined />} color="blue">Thêm nhanh</Tag>. Nhấn vào và chọn
            chức năng cần tạo, hệ thống sẽ mở form tạo mới tương ứng.
          </Text>
        </div>
      ),
    },
    {
      key: "faq-2",
      label: "Làm sao xem chi tiết doanh thu hoặc đơn hàng thành công?",
      children: (
        <div>
          <Text>
            Tại trang <Text strong>Báo cáo Tổng quan</Text>, nhấn vào thẻ <Text strong>Tổng doanh thu</Text> hoặc{" "}
            <Text strong>Đơn hàng thành công</Text> để chuyển sang trang thống kê chi tiết.
          </Text>
        </div>
      ),
    },
    {
      key: "faq-3",
      label: "Tôi muốn kiểm duyệt bài viết/đánh giá?",
      children: (
        <div>
          <Text>
            Vào mục <Text strong>Nội dung</Text> để quản lý <Text strong>Bài viết</Text> và <Text strong>Đánh giá</Text>.
            Bạn có thể tạo/sửa/xóa bài viết, và duyệt/ẩn/phản hồi đánh giá.
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="help-management">
      <Title level={2} style={{ marginBottom: 0 }}>Hướng dẫn vận hành Admin</Title>
      <Text type="secondary">Tài liệu này giúp bạn thao tác nhanh và quản lý hệ thống hiệu quả.</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={6}>
          <Card bordered={false} className="help-card">
            <Title level={4} style={{ marginTop: 0 }}>Mục lục</Title>
            <Anchor items={anchorItems} affix={false} />
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card bordered={false} className="help-card" id="overview">
              <Title level={4} style={{ marginTop: 0 }}>
                <DashboardOutlined /> Tổng quan hệ thống
              </Title>
              <Steps
                direction="vertical"
                items={[
                  {
                    title: "Bảng điều khiển",
                    description: "Xem nhanh doanh thu, đơn hàng thành công, sản phẩm đang bán, người dùng mới.",
                  },
                  {
                    title: "Điều hướng",
                    description: "Sử dụng menu bên trái để truy cập các phân hệ quản lý.",
                  },
                  {
                    title: "Thống kê chi tiết",
                    description: "Nhấn vào các thẻ thống kê để mở trang phân tích chuyên sâu.",
                  },
                ]}
              />
            </Card>

            <Card bordered={false} className="help-card" id="quick-add">
              <Title level={4} style={{ marginTop: 0 }}>
                <PlusOutlined /> Thêm nhanh
              </Title>
              <Text>
                Nhấn vào dấu <Tag icon={<PlusOutlined />} color="blue">+</Tag> trên Header để tạo nhanh:
              </Text>
              <div style={{ marginTop: 15 }}>
                <Tag icon={<ShoppingOutlined />} color="geekblue">Thêm sản phẩm</Tag>
                <Tag icon={<FileTextOutlined />} color="purple">Thêm bài viết</Tag>
                <Tag icon={<CalendarOutlined />} color="gold">Tạo lịch hẹn</Tag>
              </div>
            </Card>

            <Card bordered={false} className="help-card" id="notifications">
              <Title level={4} style={{ marginTop: 0 }}>
                <BellOutlined /> Thông báo
              </Title>
              <Text>
                Nhấn biểu tượng <Tag icon={<BellOutlined />} color="red">Chuông</Tag> để xem các thông báo như: khách đặt
                hàng mới, giao hàng thành công, lịch hẹn mới, bài viết được duyệt, đánh giá mới.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="users">
              <Title level={4} style={{ marginTop: 0 }}>
                <UserOutlined /> Quản lý người dùng
              </Title>
              <Text>
                Quản lý <Text strong>Quản trị viên</Text>, <Text strong>Nhân viên</Text>, <Text strong>Khách hàng</Text>.
                Bạn có thể thêm/sửa/xóa, lọc theo vai trò và theo dõi thống kê người dùng mới.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="products">
              <Title level={4} style={{ marginTop: 0 }}>
                <ShoppingOutlined /> Quản lý sản phẩm
              </Title>
              <Text>
                Thêm mới, cập nhật giá, tồn kho, hình ảnh. Có thể dùng <Text strong>Thêm nhanh</Text> để mở form tạo sản phẩm.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="orders">
              <Title level={4} style={{ marginTop: 0 }}>
                <OrderedListOutlined /> Quản lý đơn hàng
              </Title>
              <Text>
                Theo dõi trạng thái đơn, xử lý xác nhận/hoàn tất. Trang <Text strong>Đơn hàng thành công</Text> giúp xem tỷ lệ thành công và khu vực giao nhiều nhất.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="bookings">
              <Title level={4} style={{ marginTop: 0 }}>
                <CalendarOutlined /> Quản lý lịch hẹn (Bookings)
              </Title>
              <Text>
                Xem lịch hẹn, lọc theo trạng thái, tìm kiếm theo khách hàng. Có thể tạo lịch hẹn mới từ menu <Text strong>Thêm nhanh</Text>.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="content">
              <Title level={4} style={{ marginTop: 0 }}>
                <FileTextOutlined /> Bài viết & <StarOutlined /> Đánh giá
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ marginTop: 0 }}>Bài viết</Title>
                  <Text>
                    CRUD bài viết gồm: hình ảnh, nội dung, tên bài viết, tác giả, danh mục. Theo dõi bài viết đã đăng/bản nháp/chờ duyệt theo thời gian.
                  </Text>
                </Col>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ marginTop: 0 }}>Đánh giá</Title>
                  <Text>
                    Duyệt/ẩn đánh giá, trả lời phản hồi cho khách. Theo dõi phân bổ số sao và tỷ lệ đánh giá tích cực.
                  </Text>
                </Col>
              </Row>
            </Card>

            <Card bordered={false} className="help-card" id="analytics">
              <Title level={4} style={{ marginTop: 0 }}>
                <BarChartOutlined /> Phân tích hành vi
              </Title>
              <Text>
                Xem top sản phẩm được quan tâm/yêu thích, dịch vụ spa thịnh hành, nhân viên được yêu thích, khung giá mua nhiều/ít/không mua, và khung giờ mua hàng phổ biến.
              </Text>
            </Card>

            <Card bordered={false} className="help-card" id="settings">
              <Title level={4} style={{ marginTop: 0 }}>
                <SettingOutlined /> Cài đặt hệ thống
              </Title>
              <Text>
                Cập nhật thông tin cửa hàng, giờ làm việc, thanh toán, thông báo và tài khoản quản trị.
              </Text>
            </Card>

            <Card bordered={false} className="help-card">
              <Title level={4} style={{ marginTop: 0 }}>Câu hỏi thường gặp</Title>
              <Collapse items={faqItems} />
              <Divider />
              <Text type="secondary">
                Nếu có câu hỏi khác, vui lòng liên hệ với đồng nghiệp hoặc người quản trị hệ thống để biết thêm thông tin.
              </Text>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default HelpManagementComponent;
