import HeaderLayoutClient from "../layouts/HeaderLayoutClient";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Client/Home";
import ProductsPage from "../pages/Client/Products";
import LayoutAdmin from "../layouts/LayoutAdmin";
import AdminOverviewPage from "../pages/Admin/Overview";
import CategoryManagementPage from "../pages/Admin/CategoryManagement";
import OrderManagementPage from "../pages/Admin/OrderManagement";
import ProductManagementPage from "../pages/Admin/ProductManagement";
import UserManagementPage from "../pages/Admin/UserManagement";
import UserManagementAdminPage from "../pages/Admin/UserManagement/Admin";
import UserManagementStaffPage from "../pages/Admin/UserManagement/Staff";
import UserManagementCustomersPage from "../pages/Admin/UserManagement/Customers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderLayoutClient />,
    children: [
      {
        element: <HomePage />,
        path: "/",
      },
      {
        element: <ProductsPage />,
        path: "/products",
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
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
