import HeaderLayoutClient from "../layouts/HeaderLayoutClient";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Client/Home";
import ProductsPage from "../pages/Client/Products";

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
]);
export default router;
