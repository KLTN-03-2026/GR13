import "./style.scss";
import { Outlet, useNavigate } from "react-router-dom";
import FooterLayoutClient from "../FooterLayoutClient";
import { useEffect, useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import logo from '../../assets/images/logo.png';
interface UserInfo {
  name: string;
  avatar?: string;
}

const HeaderLayoutClient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    window.addEventListener('authChanged', handler);
    return () => window.removeEventListener('authChanged', handler);
  }, []);

  return (
    <>
      <div className="header-layout-client">
        <div className="header-container">
          <div className="header-logo" onClick={() => navigate("/")}> 
            <img
              src={logo}
              alt="logo header"
              className="logo-img"
            ></img>
            <span className="logo-text-fancy">Beauty Care</span>
          </div>

          <nav className="header-nav">
            <p className="nav-link" onClick={() => navigate("/")}>Trang chủ</p>
            <p className="nav-link" onClick={() => navigate("/products")}>Sản phẩm</p>
            <p className="nav-link" onClick={() => navigate("/blog")}>Bài viết</p>
            <p className="nav-link" onClick={() => navigate("/reviews")}>Đánh giá</p>
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-logged-in">
                <div className="cart-wrapper" onClick={() => navigate("/cart")}>
                  <ShoppingCartOutlined className="action-icon" />
                  <span className="cart-badge">0</span>
                </div>

                <div className="user-profile-section" onClick={() => navigate("/profile")}>
                  <div className="avatar-wrapper">
                    <img 
                      src={user.avatar || "https://i.pravatar.cc/150?u=beauty"} 
                      alt="Avatar" 
                    />
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                
                {/* Nút Đăng xuất đã được xóa tại đây */}
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="auth-btn login" onClick={() => navigate("/login")}>Đăng Nhập</button>
                <button className="auth-btn register" onClick={() => navigate("/register")}>Đăng Ký</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="header-content-wrapper">
        <Outlet />
      </div>
      <FooterLayoutClient />
    </>
  );
};

export default HeaderLayoutClient;