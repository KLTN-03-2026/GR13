import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import loginimg from '../../../assets/images/BG_DN.jpg';

// Định nghĩa cấu trúc dữ liệu form rõ ràng
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Một hàm duy nhất xử lý cho tất cả các ô input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof LoginFormData]: value 
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dữ liệu đăng nhập gửi đi:', formData);
    // Xử lý logic gọi API hoặc Redux/React Query tại đây
  };

  return (
    <div className="authPage">
      {/* Nút Quay lại trang chủ - Tương tự trang Register */}
      <Link to="/" className="backHome">
        ← Quay lại trang chủ
      </Link>

      {/* Cánh trái: Sidebar hình ảnh */}
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

      {/* Cánh phải: Form đăng nhập */}
      <div className="formContent">
        <div className="formWrapper">
          <h2 className="titleBig">Chào mừng bạn trở lại</h2>
          <p className="desc">Đăng nhập vào tài khoản BeautyCare để quản lý quy trình chăm sóc cá nhân.</p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="email">Địa Chỉ Email</label>
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="inputGroup">
              <div className="labelRow">
                <label htmlFor="password">Mật Khẩu</label>
                <Link to="/forgot" className="forgot">Quên Mật Khẩu?</Link>
              </div>
              <input 
                id="password"
                name="password"
                type="password" 
                placeholder="********" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submitBtn">Đăng Nhập →</button>
          </form>

          <div className="divider"><span>HOẶC TIẾP TỤC VỚI</span></div>
          <button type="button" className="googleBtn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" style={{marginRight: '10px'}}/>
            Đăng nhập với Google
          </button>

          <p className="footerText">
            Bạn chưa có tài khoản? <Link to="/register" className="linkRed">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;