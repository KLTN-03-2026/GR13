import "./style.scss";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import FooterLayoutClient from "../FooterLayoutClient";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';
import ChatboxAI from "../ChatboxAI";
interface UserInfo {
  name: string;
  avatar?: string;
}

const HeaderLayoutClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const { token } = useAuth();
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [scrolled, setScrolled] = useState(false);

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

  // Toggle glass/sticky state when scrolling
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 16) setScrolled(true);
      else setScrolled(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch wishlist/cart counts for current user
  useEffect(() => {
    let mounted = true;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchCounts = async () => {
      try {
        if (!token) {
          if (mounted) {
            setWishlistCount(0);
            setCartCount(0);
          }
          return;
        }
        const [wRes, cRes] = await Promise.all([
          axios.get("http://localhost:8088/api/v1/wishlist/count", { headers }),
          axios.get("http://localhost:8088/api/v1/cart/count", { headers }),
        ]);
        if (!mounted) return;
        const w = Number(wRes.data?.data ?? wRes.data ?? 0) || 0;
        const c = Number(cRes.data?.data ?? cRes.data ?? 0) || 0;
        setWishlistCount(w);
        setCartCount(c);
      } catch (err) {
        console.error('Failed to fetch counts', err);
        if (mounted) { setWishlistCount(0); setCartCount(0); }
      }
    };

    fetchCounts();
    return () => { mounted = false; };
  }, [token]);

  return (
    <>
      <div className={`header-layout-client ${scrolled ? 'scrolled' : ''}`}>
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
            <p className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate("/")}>Trang chủ</p>
            <p className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`} onClick={() => navigate("/products")}>Sản phẩm</p>
            <p className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`} onClick={() => navigate("/blog")}>Bài viết</p>
            <p className={`nav-link ${location.pathname.startsWith('/consultation-chat') ? 'active' : ''}`} onClick={() => navigate("/consultation-chat")}>Tư Vấn</p>
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-logged-in">
                <div className="wishlist-wrapper" onClick={() => (token ? navigate('/wishlist') : navigate('/login'))} aria-label="Wishlist">
                  <Badge count={wishlistCount} overflowCount={99} offset={[0, -6]}>
                    <HeartOutlined className="action-icon" />
                  </Badge>
                </div>

                <div className="cart-wrapper" onClick={() => (token ? navigate('/cart') : navigate('/login'))} aria-label="Cart">
                  <Badge count={cartCount} overflowCount={99} offset={[0, -6]}>
                    <ShoppingCartOutlined className="action-icon" />
                  </Badge>
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
      {location.pathname !== '/consultation-chat' && <FooterLayoutClient />}
      <ChatboxAI />
    </>
  );
};

export default HeaderLayoutClient;