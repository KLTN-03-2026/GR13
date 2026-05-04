import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.post("/create-payment-link", verifyToken, controllers.createPaymentLink);
router.post("/verify-payment", verifyToken, controllers.verifyPayment);
router.post("/webhook", controllers.handleWebhook);

export default router;
