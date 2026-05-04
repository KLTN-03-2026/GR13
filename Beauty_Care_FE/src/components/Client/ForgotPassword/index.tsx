import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import loginimg from '../../../assets/images/BG_DN.jpg';
import { useAuth } from '../../../hooks/useAuth';
import { message } from 'antd';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      try {
        setSubmitting(true);
        await forgotPassword(email);
        message.success('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
        navigate('/login');
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Gửi email thất bại';
        message.error(msg);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div className="authPage">
      <Link to="/" className="backHome">
        ← Quay lại trang chủ
      </Link>

      <div
        className="imageSidebar"
        style={loginimg ? { backgroundImage: `url(${loginimg})` } : {}}
      >
        <div className="overlayContent">
          <div className="logoGroup">
             <span>BeautyCare</span>
          </div>
          <p className="quote">"Vẻ đẹp thực sự bắt đầu từ lúc bạn quyết định là chính mình."</p>
          <span className="collection">— BỘ SƯU TẬP BIÊN TẬP 2026</span>
        </div>
      </div>

      <div className="formContent">
        <div className="formWrapper">
          <h2 className="titleBig">Quên Mật Khẩu</h2>
          <p className="desc">Nhập địa chỉ email của bạn để nhận liên kết khôi phục mật khẩu.</p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="email">Địa Chỉ Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submitBtn" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi Liên Kết Khôi Phục →'}
            </button>
          </form>

          <p className="footerText">
            Nhớ mật khẩu? <Link to="/login" className="linkRed">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
