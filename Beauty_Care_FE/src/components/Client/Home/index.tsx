import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StarFilled, RobotOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./style.scss";

const sections = [
  { id: "hero", label: "Khởi Nguồn" },
  { id: "about", label: "Câu Chuyện" },
  { id: "products", label: "Sản Phẩm" },
  { id: "routine", label: "Nghi Thức" },
  { id: "reviews", label: "Cảm Nhận" },
];

const HomeComponent: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["home-featured-products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8088/api/v1/product?limit=3");
      const json = await res.json();
      return Array.isArray(json?.data?.items) ? json.data.items : Array.isArray(json?.data) ? json.data : [];
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["home-top-reviews"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8088/api/v1/review/top");
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data.slice(0, 3) : [];
    },
  });

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  const triggerChatboxAI = () => {
    const toggleBtn = document.querySelector('.chatbox-toggle') as HTMLElement;
    if (toggleBtn) toggleBtn.click();
  };

  // Intersection Observer for Scroll Snapping & Fade In
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.5 }
    );

    const sectionElements = document.querySelectorAll(".snap-section");
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-snap-container" ref={containerRef}>
      {/* Vertical Navigation Dots */}
      <div className="vertical-nav">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className={`nav-dot ${activeSection === sec.id ? "active" : ""}`}
            onClick={() => scrollToSection(sec.id)}
            title={sec.label}
          >
            <span className="nav-label">{sec.label}</span>
          </div>
        ))}
      </div>

      {/* 1. HERO SECTION */}
      <section id="hero" className="snap-section hero-section">
        <div className="section-overlay"></div>
        <div className="section-content fade-element">
          <br></br>
          <br></br>
          <br></br>
          <p className="subtitle">Beauty Care Tinh Hoa</p>
          <h1 className="title">
            Chăm sóc da chuẩn spa <br />
            <em>nâng tầm vẻ đẹp tự nhiên</em>
          </h1>
          <button className="ghost-btn" onClick={() => navigate("/products")}>
            Khám phá sản phẩm
          </button>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="snap-section about-section">
        <div className="section-overlay dark"></div>
        <div className="section-content align-left fade-element">
          <br></br>
          <br></br>
          <br></br>
          <p className="subtitle">Câu Chuyện Của Chúng Tôi</p>
          <h2 className="title">
            Lắng nghe <em>làn da</em> của bạn
          </h2>
          <p className="desc">
            Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự thấu hiểu. Tại Beauty Care, mỗi sản phẩm là một tác phẩm nghệ thuật được tinh chế từ tự nhiên, kết hợp cùng công nghệ AI tiên tiến giúp cá nhân hóa quy trình chăm sóc da của riêng bạn.
          </p>
          <button className="ghost-btn" onClick={triggerChatboxAI}>
            Soi da AI ngay
          </button>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION */}
      <section id="products" className="snap-section products-section">
        <div className="section-overlay"></div>
        <div className="section-content fade-element">
          <br></br>
          <br></br>
          <br></br>
          <p className="subtitle">Tuyệt Tác Chăm Sóc</p>
          <h2 className="title">Sản phẩm <em>Nổi bật</em></h2>
          
          {productsLoading ? (
            <Spin size="large" />
          ) : (
            <div className="products-showcase">
              {(featuredProducts || []).map((product: any) => (
                <div key={product.id || product._id} className="product-card" onClick={() => navigate(`/products/${product.id || product._id}`)}>
                  <div className="product-img">
                    <img src={product.image || product.thumbnail || "https://placehold.co/400x500"} alt={product.name} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">{formatVND(product.discountPrice || product.price || 0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. ROUTINE SECTION */}
      <section id="routine" className="snap-section routine-section">
        <div className="section-overlay dark"></div>
        <div className="section-content align-right fade-element">
          <br></br>
          <br></br>
          <br></br>
          <p className="subtitle">Nghi Thức</p>
          <h2 className="title">
            Bí quyết <em>rạng rỡ</em>
          </h2>
          <div className="routine-list">
            <div className="routine-item">
              <span className="num">01</span>
              <div>
                <h4>Thấu Hiểu</h4>
                <p>Phân tích AI chính xác tình trạng da.</p>
              </div>
            </div>
            <div className="routine-item">
              <span className="num">02</span>
              <div>
                <h4>Làm Sạch</h4>
                <p>Thanh lọc nhẹ nhàng nhưng sâu thẳm.</p>
              </div>
            </div>
            <div className="routine-item">
              <span className="num">03</span>
              <div>
                <h4>Đặc Trị</h4>
                <p>Tinh chất chuyên sâu phục hồi khuyết điểm.</p>
              </div>
            </div>
            <div className="routine-item">
              <span className="num">04</span>
              <div>
                <h4>Nuôi Dưỡng</h4>
                <p>Khóa ẩm và củng cố hàng rào bảo vệ tự nhiên.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS SECTION */}
      <section id="reviews" className="snap-section reviews-section">
        <div className="section-overlay"></div>
        <div className="section-content fade-element">
          <br></br>
          <br></br>
          <br></br>
          <p className="subtitle">Trải Nghiệm</p>
          <h2 className="title">Khách hàng <em>Nói gì</em></h2>
          
          {reviewsLoading ? (
            <Spin size="large" />
          ) : (
            <div className="reviews-showcase">
              {(reviews && reviews.length > 0 ? reviews : [
                { id: 1, user: { fullName: "Minh Anh" }, rating: 5, comment: "Da mình dịu hơn hẳn, không còn căng rát. Sản phẩm thẩm thấu cực nhanh." },
                { id: 2, user: { fullName: "Thuỳ Linh" }, rating: 5, comment: "Quy trình rõ ràng, kết cấu sản phẩm mỏng nhẹ, rất phù hợp với da hỗn hợp của mình." },
                { id: 3, user: { fullName: "Ngọc Trâm" }, rating: 5, comment: "Thiết kế bao bì tối giản, mùi hương thư giãn. Sẽ tiếp tục sử dụng lâu dài." }
              ]).map((review: any, index: number) => (
                <div key={review.id || index} className="review-card">
                  <div className="stars">
                    {[...Array(review.rating || 5)].map((_, i) => <StarFilled key={i} />)}
                  </div>
                  <p className="review-quote">"{review.comment}"</p>
                  <p className="reviewer">{review.user?.fullName || review.user?.name || "Khách Hàng"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeComponent;
