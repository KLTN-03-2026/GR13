import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// Public route để khách xem đánh giá
router.get("/product/:productId", controllers.getReviewsByProduct);

// Private route để gửi đánh giá
router.use(verifyToken);
router.get("/admin", isAdmin, controllers.adminGetReviews);
router.delete("/admin/:reviewId", isAdmin, controllers.adminDeleteReview);
router.post("/create", controllers.createReview);
router.delete("/delete", controllers.deleteReview);

export default router;
