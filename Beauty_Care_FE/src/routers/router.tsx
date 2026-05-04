import HeaderLayoutClient from "../layouts/HeaderLayoutClient";
import ErrorPage from "../components/Common/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Client/Home";
import ProductsPage from "../pages/Client/Products";
import ProductDetailPage from "../pages/Client/ProductDetail";
import LayoutAdmin from "../layouts/LayoutAdmin";
import AdminOverviewPage from "../pages/Admin/OverviewManagement";
import CategoryManagementPage from "../pages/Admin/CategoryManagement";
import OrderManagementPage from "../pages/Admin/OrderManagement";
import ProductManagementPage from "../pages/Admin/ProductManagement";
import UserManagementPage from "../pages/Admin/UserManagement";
import BookingManagementPage from "../pages/Admin/BookingManagement";
import BlogManagementPage from "../pages/Admin/BlogManagement";
import BlogCategoryManagementPage from "../pages/Admin/BlogCategoryManagement";
import ReviewManagementPage from "../pages/Admin/ReviewManagement";
import AnalyticsManagementPage from "../pages/Admin/AnalyticsManagement";
import SettingsManagementPage from "../pages/Admin/SettingsManagement";
import RevenueManagementPage from "../pages/Admin/RevenueManagement";
import OrderSuccessManagementPage from "../pages/Admin/OrderSuccessManagement";
import HelpManagementPage from "../pages/Admin/HelpManagement";
import ProfileManagementPage from "../pages/Admin/ProfileManagement";
import UserManagementAdminPage from "../pages/Admin/UserManagement/Admin";
import UserManagementStaffPage from "../pages/Admin/UserManagement/Staff";
import UserManagementCustomersPage from "../pages/Admin/UserManagement/Customers";
import AuthAdminLayout from "../layouts/AuthAdminLayout";
import LoginAdminPage from "../pages/Auth/AuthAdmin/LoginAdmin";
import RequireAdminAuth from "../layouts/RequireAdminAuth";
import LoginPage from "../pages/Client/Login";
import RegisterPage from "../pages/Client/Register";
import ForgotPasswordPage from "../pages/Client/ForgotPW/ForgotPassword";
import BlogPage from "../pages/Client/Blog";
import BlogDetailPage from "../pages/Client/BlogDetail";
import ProfilePage from "../pages/Client/Profile";
import WishlistPage from "../pages/Client/Wishlist";
import CartPage from "../pages/Client/Cart";
import CheckoutPage from "../pages/Client/Checkout";
import MyOrderPage from "../pages/Client/MyOrder";
import ConsultationChatPage from "../pages/Client/ConsultationChat";
import OrderSuccess from "../components/Client/OrderSuccess";
import AuthClientLayout from "../layouts/AuthLayoutClient";
import ChatManagementPage from "../pages/Admin/ChatManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderLayoutClient />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Thay path: "/" bằng index: true cho gọn
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      
      {
        path: "blog/:id",
        element: <BlogDetailPage />,
      },
      {
        path: "consultation-chat",
        element: <ConsultationChatPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "myorder",
        element: <MyOrderPage />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
    ],
  },

  // NHÓM 2: CÁC TRANG AUTH CÓ LAYOUT CHUNG
  {
    element: <AuthClientLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot",
        element: <ForgotPasswordPage />,
      },
    ],
  },

  // NHÓM 3: CÁC TRANG ADMIN
  {
    path: "/admin",
    element: (
      <RequireAdminAuth>
        <LayoutAdmin />
      </RequireAdminAuth>
    ),
    children: [
      {
        path: "",
        element: <AdminOverviewPage />,
      },
      {
        path: "dashboard",
        element: <AdminOverviewPage />,
      },
      {
        path: "categories",
        element: <CategoryManagementPage />,
      },
      {
        path: "products",
        element: <ProductManagementPage />,
      },
      {
        path: "orders",
        element: <OrderManagementPage />,
      },
      {
        path: "orders-success",
        element: <OrderSuccessManagementPage />,
      },
      {
        path: "bookings",
        element: <BookingManagementPage />,
      },
      {
        path: "blogs",
        element: <BlogManagementPage />,
      },
      {
        path: "blog-categories",
        element: <BlogCategoryManagementPage />,
      },
      {
        path: "reviews",
        element: <ReviewManagementPage />,
      },
      {
        path: "chat",
        element: <ChatManagementPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsManagementPage />,
      },
      {
        path: "help",
        element: <HelpManagementPage />,
      },
      {
        path: "profile",
        element: <ProfileManagementPage />,
      },
      {
        path: "revenue",
        element: <RevenueManagementPage />,
      },
      {
        path: "settings",
        element: <SettingsManagementPage />,
      },
      {
        path: "users",
        element: <UserManagementPage />,
      },
      {
        path: "users-admin",
        element: <UserManagementAdminPage />,
      },
      {
        path: "users-staff",
        element: <UserManagementStaffPage />,
      },
      {
        path: "users-customers",
        element: <UserManagementCustomersPage />,
      },
    ],
  },
  {
    path: "/auth-admin",
    element: <AuthAdminLayout />,
    children: [
      {
        path: "login",
        element: <LoginAdminPage />,
      },
    ],
  },
]);

export default router;
