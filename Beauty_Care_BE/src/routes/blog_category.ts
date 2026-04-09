import express from "express";
import * as controllers from "../controllers/blog_category";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// Public routes
router.get("/all", controllers.getAllBlogCategories);

// Admin/Staff routes
router.post("/create", [verifyToken, isAdmin], controllers.createBlogCategory);
router.put("/update/:id", [verifyToken, isAdmin], controllers.updateBlogCategory);
router.delete("/delete/:id", [verifyToken, isAdmin], controllers.deleteBlogCategory);

export default router;
