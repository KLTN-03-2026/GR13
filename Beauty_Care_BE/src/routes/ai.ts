import express from "express";
import * as controller from "../controllers/ai";
import { verifyToken, verifyTokenOptional } from "../middlewares/verify_token";

const router = express.Router();

router.post("/predict", controller.upload.single("file"), controller.predict);
router.post("/analyze", verifyTokenOptional, controller.analyze); // Support saving history if logged in
router.get("/history", verifyToken, controller.getHistory);

export default router;
