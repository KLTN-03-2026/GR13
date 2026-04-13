import express from "express";
import userRouter from "./user";
import roleRouter from "./role";
import authRouter from "./auth";
import blogRouter from "./blog";
import blogCategoryRouter from "./blog_category";
import productRouter from "./product";
import cartRouter from "./cart";
import orderRouter from "./order";
import bookingRouter from "./booking";
import reviewRouter from "./review";
import wishlistRouter from "./wishlist";

const initRoutes = (app: express.Express) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/role", roleRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/blog", blogRouter);
  app.use("/api/v1/blog-category", blogCategoryRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/booking", bookingRouter);
  app.use("/api/v1/review", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
};
export default initRoutes;
