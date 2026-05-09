import "./style.scss";
import {
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

const FooterLayoutClient = () => {
  return (
    <footer className="editorial-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-column brand-col">
            <h2 className="footer-logo-text">BeautyCare</h2>
            <p className="brand-tagline">Thấu hiểu làn da — Nâng tầm vẻ đẹp.</p>
            <div className="footer-socials">
              <a href="#" className="social-icon"><InstagramOutlined /></a>
              <a href="#" className="social-icon"><FacebookOutlined /></a>
              <a href="#" className="social-icon"><TwitterOutlined /></a>
              <a href="#" className="social-icon"><YoutubeOutlined /></a>
            </div>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="footer-heading">CÔNG TY</h3>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Cửa hàng</a></li>
              <li><a href="#">Sản phẩm SkinCare</a></li>
              <li><a href="#">Tin tức & Sự kiện</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="footer-heading">HỖ TRỢ</h3>
            <ul className="footer-links">
              <li><a href="#">Trung tâm hỗ trợ</a></li>
              <li><a href="#">Theo dõi đơn hàng</a></li>
              <li><a href="#">Vận chuyển & Đổi trả</a></li>
              <li><a href="#">Hỏi đáp (FAQ)</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column newsletter-col">
            <h3 className="footer-heading">BẢN TIN MỚI NHẤT</h3>
            <p className="subscribe-desc">Đăng ký để nhận ưu đãi đặc quyền và bí quyết làm đẹp từ chuyên gia.</p>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="subscribe-input"
              />
              <button className="subscribe-button">
                JOIN <ArrowRightOutlined className="join-icon" />
              </button>
            </div>
            <p className="disclaimer-text">
              Bằng cách đăng ký, bạn đồng ý với <a href="#">Chính sách bảo mật</a> của chúng tôi.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="bottom-left">
            <p>Copyright © 2026 Beauty Care. All rights reserved.</p>
          </div>
          <div className="bottom-right">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayoutClient;