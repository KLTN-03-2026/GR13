import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orderApi from "../../../api/order";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  ShopOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Spin, Empty, Modal, Rate, Input, message } from "antd";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import "./style.scss";

const { TextArea } = Input;

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data: ordersResp, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
  });
  const orders: any[] = ordersResp?.data ?? [];

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    const s = status.toUpperCase();
    switch (s) {
      case "PAID": return "ĐÃ THANH TOÁN";
      case "PENDING": return "CHỜ XỬ LÝ";
      case "REFUNDED": return "ĐÃ HOÀN TIỀN";
      case "SHIPPING": return "ĐANG VẬN CHUYỂN";
      case "DELIVERED":
      case "COMPLETED": return "HOÀN THÀNH";
      case "PROCESSING": return "ĐANG XỬ LÝ";
      case "CANCELLED": return "ĐÃ HỦY";
      default: return s;
    }
  };

  const handleOpenReview = (product: any) => {
    setSelectedProduct(product);
    setReviewRating(5);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "http://localhost:8088/api/v1/review",
        {
          productId: selectedProduct.id,
          rating: reviewRating,
          comment: reviewComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      message.success("Cảm ơn bạn đã đánh giá sản phẩm!");
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Logic for Product Detail sync happens via invalidating product queries if they share keys or just refreshing
    },
    onError: () => {
      message.error("Gửi đánh giá thất bại. Vui lòng thử lại!");
    }
  });

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => {
        const s = o.status?.toUpperCase();
        if (activeTab === "Processing") return s === "PROCESSING" || s === "PENDING" || s === "SHIPPING";
        if (activeTab === "Delivered") return s === "DELIVERED" || s === "COMPLETED";
        return s === activeTab.toUpperCase();
      });

  return (
    <div className="orderPage">
      <div className="container">
        {/* BREADCRUMB */}
        <nav className="breadcrumb">
          <span onClick={() => navigate("/")}>Trang Chủ</span>
          <RightOutlined />
          <span onClick={() => navigate("/profile")}>Hồ Sơ</span>
          <RightOutlined />
          <span className="current">Đơn Hàng Của Tôi</span>
        </nav>

        {/* HEADER */}
        <header className="header">
          <div className="titleContent">
            <button className="backBtn" onClick={() => navigate("/profile")}>
              <ArrowLeftOutlined /> TRỞ VỀ HỒ SƠ
            </button>
            <h1>Đơn Hàng Của Tôi</h1>
            <p>Theo dõi và quản lý những tuyệt phẩm chăm sóc da của bạn.</p>
          </div>
          <div className="headerActions">
            <button className="outlineBtn">
              <DownloadOutlined /> XUẤT LỊCH SỬ
            </button>
            <button className="primaryBtn">
              <ShoppingOutlined /> MUA LẠI NGAY
            </button>
          </div>
        </header>

        {/* TABS FILTER */}
        <div className="tabs">
          {[
            { key: "All", label: "Tất Cả" },
            { key: "Processing", label: "Chờ xử lý" },
            { key: "Delivered", label: "Hoàn thành" },
            { key: "Cancelled", label: "Đã hủy" }
          ].map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "activeTab" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ORDERS LIST */}
        <div className="orders-list">
          {isLoading ? (
            <div className="loading-wrap"><Spin size="large" /></div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="card-header">
                  <div className="shop-info">
                    <ShopOutlined />
                    <span className="shop-name">Beauty Care Elite</span>
                  </div>
                  <div className={`order-status ${(order.status || "").toLowerCase()}`}>
                    {getStatusLabel(order.status || "")}
                  </div>
                </div>

                {/* Giả định đơn hàng có danh sách sản phẩm. */}
                <div className="products-container">
                  {(order.items || []).map((item: any) => (
                    <div className="product-row" key={item.id}>
                      <div className="product-img">
                        <img 
                          src={item.productData?.image || (item.productData?.images && item.productData?.images[0]) || "https://placehold.co/200x200?text=Beauty+Care"} 
                          alt="product" 
                        />
                      </div>
                      <div className="product-details">
                        <div className="p-name">{item.productData?.name}</div>
                        <div className="p-meta">Phân loại: Cao cấp • Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}</div>
                        <div className="p-qty">Số lượng: x{item.quantity}</div>
                      </div>
                      <div className="p-price-actions">
                        <div className="p-price">{formatVND(Number(item.price || 0))}</div>
                        {(order.status?.toUpperCase() === "COMPLETED" || order.status?.toUpperCase() === "DELIVERED") && (
                          <button className="btn-review-item" onClick={() => handleOpenReview(item.productData)}>
                             <StarOutlined /> Đánh giá
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="total-section">
                    <span className="total-label">Thành tiền:</span>
                    <span className="total-amount">{formatVND(Number(order.totalAmount || 0))}</span>
                  </div>
                  <div className="footer-actions">
                    <button className="btn-reorder">MUA LẠI</button>
                    <button 
                      className="btn-details"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      XEM CHI TIẾT
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <ShoppingOutlined />
              <h2>Chưa có đơn hàng nào</h2>
              <p>Hãy khám phá những bộ sưu tập mới nhất của chúng tôi.</p>
              <button className="primaryBtn" style={{ marginTop: 30 }} onClick={() => navigate("/products")}>
                MUA SẮM NGAY
              </button>
            </div>
          )}
        </div>

        {/* SUPPORT BANNER */}
        <div className="contactBanner">
          <div className="contactContent">
            <div className="iconBox">
              <CustomerServiceOutlined />
            </div>
            <div className="text">
              <h3>Bạn cần hỗ trợ về đơn hàng?</h3>
              <p>Đội ngũ chuyên viên BeautyCare luôn sẵn sàng phục vụ bạn 24/7.</p>
            </div>
          </div>
          <button className="contactBtn">LIÊN HỆ TRỢ LÝ SẮC ĐẸP</button>
        </div>
      </div>

      {/* REVIEW MODAL */}
      <Modal
        title="Đánh giá sản phẩm"
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        onOk={() => submitReviewMutation.mutate()}
        confirmLoading={submitReviewMutation.isPending}
        className="luxury-review-modal"
        okText="Gửi đánh giá"
        cancelText="Hủy"
      >
        {selectedProduct && (
          <div className="review-form">
            <div className="p-info-mini">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <div>
                <h4>{selectedProduct.name}</h4>
                <p>Chia sẻ cảm nhận của bạn về sản phẩm</p>
              </div>
            </div>
            <div className="rating-input">
              <Rate value={reviewRating} onChange={setReviewRating} />
              <span className="rating-label">{reviewRating}/5 Sao</span>
            </div>
            <TextArea 
              rows={4} 
              placeholder="Sản phẩm dùng rất tốt, bao bì đẹp..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="luxury-input"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;