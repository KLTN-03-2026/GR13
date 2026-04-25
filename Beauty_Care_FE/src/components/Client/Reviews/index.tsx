import React, { useState } from "react";
import { UserOutlined, MessageOutlined, CheckCircleFilled, CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Modal, Rate } from "antd";
import "./style.scss";

type ReviewFormData = {
  name: string;
  rating: number;
  comment: string;
};

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  productImg: string;   // Thêm ảnh sản phẩm
  productName: string;  // Thêm tên sản phẩm
};

const ReviewForm: React.FC = () => {
  const [formData, setFormData] = useState<ReviewFormData>({ name: "", rating: 0, comment: "" });
  const [reviews, setReviews] = useState<ReviewItem[]>([
    { 
      id: 1, 
      name: "Nguyễn Trung Đức", 
      rating: 5, 
      comment: "Serum này dùng cực kỳ mướt da, thấm nhanh và không gây bết rít. Mình dùng được 1 tuần thấy da sáng hẳn lên.", 
      date: "12/03/2026",
      productImg: "https://res.cloudinary.com/dfsv98v6q/image/upload/v1740674100/659620060006da09be0bc90c_Hero_Image_p-800_dqzvxz.webp",
      productName: "Serum Phục Hồi Skin Reset"
    },
    { 
      id: 2, 
      name: "Trần Baaaaaa33333", 
      rating: 4, 
      comment: "Sản phẩm đóng gói rất sang trọng, nhân viên tư vấn nhiệt tình. Sẽ tiếp tục ủng hộ shop lâu dài.", 
      date: "10/03/2026",
      productImg: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
      productName: "Kem Dưỡng Glow & Hydrate"
    },
    { 
      id: 2, 
      name: "Trần Bấddasd", 
      rating: 4, 
      comment: "Sản phẩm đóng gói rất sang trọng, nhân viên tư vấn nhiệt tình. Sẽ tiếp tục ủng hộ shop lâu dài.", 
      date: "10/03/2026",
      productImg: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
      productName: "Kem Dưỡng Glow & Hydrate"
    },
  ]);

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) return alert("Vui lòng chọn số sao!");

    const newReview: ReviewItem = {
      id: Date.now(),
      name: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toLocaleDateString('vi-VN'),
      productImg: "https://placehold.co/400x500?text=Beauty+Product", // Ảnh mặc định cho review mới
      productName: "Sản phẩm của Beauty Care"
    };

    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", rating: 0, comment: "" });
  };

  const renderStars = (isInteractive: boolean, ratingValue: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isActive = star <= (isInteractive ? (hoverRating || formData.rating) : ratingValue);
      return (
        <span
          key={star}
          className={`review-star ${isActive ? "review-star--active" : ""}`}
          onMouseEnter={() => isInteractive && setHoverRating(star)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          onClick={() => isInteractive && setFormData(p => ({ ...p, rating: star }))}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="ReviewPage">
      <div className="reviewFormSection">
        <section className="banner-left"></section>
        <section className="main-form-content">
          <div className="form-header">
            <MessageOutlined className="header-icon" />
            <h2 className="review-title">Chia Sẻ Trải Nghiệm</h2>
          </div>

          {submitted ? (
            <div className="review-success-box">
              <CheckCircleFilled className="success-icon" />
              <p>Cảm ơn bạn đã gửi đánh giá!</p>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="review-group">
                <label className="review-label">Tên của bạn</label>
                <input type="text" className="review-input" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="review-group">
                <label className="review-label">Đánh giá</label>
                <div className="review-stars-container">{renderStars(true, 0)}</div>
              </div>
              <div className="review-group">
                <label className="review-label">Nhận xét</label>
                <textarea className="review-textarea" value={formData.comment} onChange={(e)=>setFormData({...formData, comment: e.target.value})} rows={4} required />
              </div>
              <button type="submit" className="review-submit-btn">GỬI ĐÁNH GIÁ</button>
            </form>
          )}
        </section>
        <section className="banner-right"></section>
      </div>

      <div className="reviewListSection">
        <div className="container">
          <h3 className="section-title">Đánh giá từ khách hàng</h3>
          <div className="review-grid">
            {reviews.map((item) => (
              <div key={item.id} className="review-card-luxury" onClick={() => setSelectedReview(item)}>
                <div className="card-header">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <div className="user-info">
                    <span className="user-name">{item.name}</span>
                    <span className="review-date">{item.date}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="stars-row">{renderStars(false, item.rating)}</div>
                  <p className="comment-preview">{item.comment}</p>
                  <div className="product-tag-mini">
                    <img src={item.productImg} alt="product" />
                    <span>Xem chi tiết</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL HIỂN THỊ TO - LUXURY STYLE */}
      <Modal
        open={!!selectedReview}
        onCancel={() => setSelectedReview(null)}
        footer={null}
        width={950}
        centered
        closeIcon={<CloseOutlined className="modal-close-icon" />}
        className="luxury-review-modal"
      >
        {selectedReview && (
          <div className="modal-review-content">
            <div className="modal-left">
              <img src={selectedReview.productImg} alt="Product" className="full-product-img" />
              <div className="product-info-overlay">
                <span>Sản phẩm được đánh giá:</span>
                <strong>{selectedReview.productName}</strong>
              </div>
            </div>
            <div className="modal-right">
              <div className="reviewer-meta">
                <Avatar size={64} icon={<UserOutlined />} className="large-avatar" />
                <div>
                  <h3>{selectedReview.name}</h3>
                  <p>{selectedReview.date}</p>
                </div>
              </div>
              <div className="rating-status">
                <div className="stars">{renderStars(false, selectedReview.rating)}</div>
                <span className="verify-badge">● Đã mua hàng</span>
              </div>
              <div className="full-comment">
                <p>"{selectedReview.comment}"</p>
              </div>
              <button className="modal-buy-btn">
                <ShoppingCartOutlined /> MUA SẢN PHẨM NÀY
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewForm;

