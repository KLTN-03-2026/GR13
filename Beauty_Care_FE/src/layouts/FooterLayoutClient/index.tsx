import "./style.scss";
import {
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";

const FooterLayoutClient = () => {
  return (
    <footer className="footer-client">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo and Info Column */}
          <div className="footer-column footer-info">
            <div className="footer-logo">
              <img src={logo} alt="Tech Global" className="logo-img" />
              <span className="logo-text">Beauty Care</span>
            </div>
            <div className="footer-copyright">
              <p>Copyright © 2024 Beauty Care.</p>
              <p>All rights reserved</p>
            </div>
            <div className="footer-socials">
              <a href="#" className="social-icon">
                <InstagramOutlined />
              </a>
              <a href="#" className="social-icon">
                <TwitterOutlined />
              </a>
              <a href="#" className="social-icon">
                <YoutubeOutlined />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Công ty</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Giới thiệu</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Testimonials</a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Hỗ trợ</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="#">Chính sách quyền riêng tư</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#">Trạng thái</a>
              </li>
            </ul>
          </div>

          {/* Updates Column */}
          <div className="footer-column footer-subscribe">
            <h3 className="footer-heading">Cập nhật mới nhất</h3>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Email của bạn"
                className="subscribe-input"
              />
              <button className="subscribe-button">
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayoutClient;
