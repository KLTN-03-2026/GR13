import express from "express";
import * as blogController from "../controllers/blog";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.get("/all", blogController.getBlogs);
router.get("/slug/:slug", blogController.getBlogBySlug);
router.get("/:id", blogController.getBlog);

router.post("/create", [verifyToken, isAdmin], blogController.createBlog);
router.put("/update/:id", [verifyToken, isAdmin], blogController.updateBlog);
router.delete("/delete/:id", [verifyToken, isAdmin], blogController.deleteBlog);

export default router;
