import "./style.scss";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import FooterLayoutClient from "../FooterLayoutClient";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Badge, message } from "antd";
import { ShoppingCartOutlined, HeartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';
import ChatboxAI from "../ChatboxAI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../api/config";
import LoadingPage from "../Common/LoadingPage";
import * as wishlistApi from "../../api/wishlist";
import * as cartApi from "../../api/cart";


const HeaderLayoutClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const prevPathRef = useRef<string | null>(null);
  const isHomePage = location.pathname === '/';

  // Trigger loading screen on specific route transitions
  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    const loadingRoutes = ['/login', '/register', '/forgot', '/cart', '/wishlist', '/myorder', '/profile'];
    const authRoutes = ['/login', '/register', '/forgot'];
    
    const isTarget = loadingRoutes.some(route => currentPath.startsWith(route));
    const isProductDetail = /^\/products?\/.+/.test(currentPath);
    
    const isAuthToAuth = prevPath && authRoutes.some(route => prevPath.startsWith(route)) && authRoutes.some(route => currentPath.startsWith(route));
    const isFromOrToHome = currentPath === '/' || prevPath === '/';

    const shouldShowLoading = (isTarget || isProductDetail) && !(isAuthToAuth || isFromOrToHome);

    if (shouldShowLoading || !prevPath) {
      setIsPageLoading(true);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);

      prevPathRef.current = currentPath;
      return () => clearTimeout(timer);
    } else {
      setIsPageLoading(false);
      window.scrollTo(0, 0);
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  // Fetch Wishlist count using standard API to share cache
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getWishlist(),
    enabled: !!token,
  });

  // Fetch Cart count using standard API to share cache
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: !!token,
  });

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await API.get("/user/current");
      return res.data?.data || res.data;
    },
    enabled: !!token,
  });

  // Safely extract counts
  const wData = wishlistData?.data ?? wishlistData;
  const wItems = Array.isArray(wData?.items) ? wData.items : (Array.isArray(wData) ? wData : []);
  const wishlistCount = wItems.length;

  const cData = cartData?.data ?? cartData;
  const cItems = Array.isArray(cData?.cartItems) ? cData.cartItems : (Array.isArray(cData) ? cData : []);
  const cartCount = cItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);

  const user = userProfile ? {
    name: userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : (userProfile.name || "User"),
    avatar: userProfile.avatar || userProfile.Avatar
  } : null;

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();
    window.dispatchEvent(new Event('authChanged'));
    message.success("Đã đăng xuất");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <LoadingPage isLoading={isPageLoading} />
      
      <div className={`header-layout-client ${isHomePage ? 'is-home' : 'is-internal'}`}>
        <div className="header-container">
          <div className="header-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo header" className="logo-img" />
            <span className="logo-text-fancy">Beauty Care</span>
          </div>

          <nav className="header-nav">
            <p className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate("/")}>Trang chủ</p>
            <p className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`} onClick={() => navigate("/products")}>Sản phẩm</p>
            <p className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`} onClick={() => navigate("/blog")}>Bài viết</p>
            <p className={`nav-link ${location.pathname.startsWith('/consultation-chat') ? 'active' : ''}`} onClick={() => navigate("/consultation-chat")}>Tư Vấn</p>
          </nav>

          <div className="header-actions">
            {token && user ? (
              <div className="user-logged-in">
                <div className="wishlist-wrapper" onClick={() => (token ? navigate('/wishlist') : navigate('/login'))}>
                  <Badge count={wishlistCount} offset={[0, -6]}><HeartOutlined className="action-icon" /></Badge>
                </div>

                <div className="cart-wrapper" onClick={() => (token ? navigate('/cart') : navigate('/login'))}>
                  <Badge count={cartCount} offset={[0, -6]}><ShoppingCartOutlined className="action-icon" /></Badge>
                </div>

                <div className="user-profile-section" onClick={() => navigate("/profile")}>
                  <div className="avatar-wrapper">
                    <img src={user.avatar || "https://i.pravatar.cc/150?u=beauty"} alt="Avatar" />
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                
                <button className="logout-btn-minimal" onClick={handleLogout}>
                  <LogoutOutlined /> <span>Đăng xuất</span>
                </button>
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
      
      {!isHomePage && location.pathname !== '/consultation-chat' && <FooterLayoutClient />}
      <ChatboxAI />
    </>
  );
};

export default HeaderLayoutClient;