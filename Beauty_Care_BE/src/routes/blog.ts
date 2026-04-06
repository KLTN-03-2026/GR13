import express from "express";
import * as blogController from "../controllers/blog";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.get("/all", blogController.getBlogs);
router.get("/slug/:slug", blogController.getBlogBySlug);
router.get("/:id", blogController.getBlog);

router.post("/create", verifyToken, blogController.createBlog);
router.put("/update/:id", verifyToken, blogController.updateBlog);
router.delete("/delete/:id", verifyToken, blogController.deleteBlog);

export default router;
