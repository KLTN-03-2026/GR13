import "./style.scss";
import { Outlet, useNavigate } from "react-router-dom";
import FooterLayoutClient from "../FooterLayoutClient";

const HeaderLayoutClient = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  const handleClickProducts = () => {
    navigate("/products");
  };
  const handleClickAdmin = () => {
    navigate("/admin");
  };
  return (
    <>
      <div className="header-layout-client">
        <div className="header-container">
          <div className="header-logo" onClick={handleClick}>
            <span className="logo-text-fancy">Beauty Care</span>
          </div>

          <nav className="header-nav">
            <p className="nav-link" onClick={handleClick}>
              Trang chủ
            </p>
            <p className="nav-link" onClick={handleClickProducts}>
              Sản phẩm
            </p>
            <p className="nav-link">Bài viết</p>
            <p className="nav-link" onClick={handleClickAdmin}>Đánh giá</p>
          </nav>

          <div className="header-actions">
            <button className="book-now-btn">Đăng ký</button>
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
