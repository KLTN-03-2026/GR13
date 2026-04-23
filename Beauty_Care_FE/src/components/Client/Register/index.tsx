import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import registerimg from '../../../assets/images/BG_DKI.png';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof RegisterFormData]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log('Dữ liệu đăng ký gửi đi:', formData);
  };

  return (
    <div className="authPage">
      {/* Nút Quay lại trang chủ cố định ở góc phải */}
      <Link to="/" className="backHome">
        ← Quay lại trang chủ
      </Link>

      <div className="imageSidebar" style={registerimg ? { backgroundImage: `url(${registerimg})` } : {}}>
        <div className="overlayContent">
          <div className="logoGroup">
             <img src="https://placehold.co/40x40/FFF/999?text=BC" alt="BeautyCare" />
             <span>BeautyCare</span>
          </div>
          <p className="slogan">
            Nâng tầm vẻ đẹp tự nhiên thông qua các sản phẩm chăm sóc da sang trọng và nghi thức làm đẹp thủ công.
          </p>
        </div>
      </div>

      <div className="formContent">
        <div className="headerLinks">
          Đã là thành viên? <Link to="/login" className="linkRed">Đăng Nhập</Link>
        </div>

        <div className="formWrapper">
          <h2 className="title">Tham gia BeautyCare và bắt đầu hành trình làm đẹp</h2>
          <p className="desc">Tạo tài khoản để mở khóa các đặc quyền và khuyến nghị cá nhân hóa.</p>

          <form className="form" onSubmit={handleSubmit}>
            {/* ... Các input giữ nguyên ... */}
            <div className="inputGroup">
              <label htmlFor="fullName">Họ Tên Đầy Đủ</label>
              <input id="fullName" name="fullName" type="text" placeholder="Nhập họ tên đầy đủ của bạn" value={formData.fullName} onChange={handleInputChange} required />
            </div>

            <div className="inputGroup">
              <label htmlFor="email">Địa Chỉ Email</label>
              <input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="row">
              <div className="inputGroup">
                <label htmlFor="password">Mật Khẩu</label>
                <input id="password" name="password" type="password" placeholder="********" value={formData.password} onChange={handleInputChange} required />
              </div>
              <div className="inputGroup">
                <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="checkboxGroup">
              <input type="checkbox" id="terms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} required />
              <label htmlFor="terms">
                Tôi đồng ý với <span className="linkRed">Điều Khoản</span> và <span className="linkRed">Chính Sách Bảo Mật</span>.
              </label>
            </div>

            <button type="submit" className="submitBtn">Tạo Tài Khoản →</button>
          </form>

          <div className="divider"><span>HOẶC ĐĂNG KÝ VỚI</span></div>
          <div className="socialBtns">
            <button type="button" className="socialBtn">Google</button>
            <button type="button" className="socialBtn">Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;