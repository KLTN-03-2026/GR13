import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.get("/history", controllers.getSkinAnalysisHistory);
router.get("/history/:userId", controllers.getSkinAnalysisHistory);
router.post("/analyze", controllers.createSkinAnalysis);

export default router;