import "./style.scss";
import {
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  SendOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";

const FooterLayoutClient = () => {
  return (
    <footer className="footer-client">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-column footer-info">
            <div className="footer-logo">
              <span className="logo-text-fancy">Beauty Care</span>
            </div>
            <div className="footer-contact-info">
              <p><EnvironmentOutlined /> Cs1: 240 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng</p>
              <p><EnvironmentOutlined /> Cs2: 03 Quang Trung, Hải Châu, Đà Nẵng</p>
              <p><PhoneOutlined /> +84 111 222 333</p>
            </div>
            <div className="footer-socials">
              <a href="#" className="social-icon"><InstagramOutlined /></a>
              <a href="#" className="social-icon"><TwitterOutlined /></a>
              <a href="#" className="social-icon"><YoutubeOutlined /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Công ty</h3>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Dịch vụ Spa</a></li>
              <li><a href="#">Sản phẩm SkinCare</a></li>
              <li><a href="#">Tin tức & Sự kiện</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="footer-heading">Hỗ trợ</h3>
            <ul className="footer-links">
              <li><a href="#">Trung tâm hỗ trợ</a></li>
              <li><a href="#">Đặt lịch hẹn</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column footer-subscribe">
            <h3 className="footer-heading">Cập nhật mới nhất</h3>
            <p className="subscribe-desc">Đăng ký để nhận ưu đãi đặc quyền và bí quyết làm đẹp từ chuyên gia.</p>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="subscribe-input"
              />
              <button className="subscribe-button">
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © 2024 Beauty Care. Thấu hiểu làn da - Nâng tầm vẻ đẹp.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayoutClient;