import express from "express";
import * as controllers from "../controllers/product_recommendation";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.get("/all", controllers.getAllRecommendations);

// Admin routes
router.use(verifyToken);
router.use(isAdmin);

router.post("/", controllers.createRecommendation);
router.put("/:id", controllers.updateRecommendation);
router.delete("/:id", controllers.deleteRecommendation);

export default router;
