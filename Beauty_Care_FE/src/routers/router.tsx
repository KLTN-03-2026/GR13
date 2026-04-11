import HeaderLayoutClient from "../layouts/HeaderLayoutClient";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Client/Home";
import ProductsPage from "../pages/Client/Products";
import LayoutAdmin from "../layouts/LayoutAdmin";
import AdminOverviewPage from "../pages/Admin/OverviewManagement";
import CategoryManagementPage from "../pages/Admin/CategoryManagement";
import OrderManagementPage from "../pages/Admin/OrderManagement";
import ProductManagementPage from "../pages/Admin/ProductManagement";
import UserManagementPage from "../pages/Admin/UserManagement";
import BookingManagementPage from "../pages/Admin/BookingManagement";
import BlogManagementPage from "../pages/Admin/BlogManagement";
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
import BlogPage from "../pages/Client/Blog";
import BlogDetailPage from "../pages/Client/BlogDetail";
import ProfilePage from "../pages/Client/Profile";

const router = createBrowserRouter([
  // NHÓM 1: CÁC TRANG CLIENT CÓ HEADER & FOOTER
  {
    path: "/",
    element: <HeaderLayoutClient />,
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
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:id",
        element: <BlogDetailPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
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
        path: "reviews",
        element: <ReviewManagementPage />,
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
]);

export default router;