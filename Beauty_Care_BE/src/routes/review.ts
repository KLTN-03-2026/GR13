import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

// Public route để khách xem đánh giá
router.get("/product/:productId", controllers.getReviewsByProduct);

// Private route để gửi đánh giá
router.use(verifyToken);
router.post("/create", controllers.createReview);
router.delete("/delete", controllers.deleteReview);

export default router;
