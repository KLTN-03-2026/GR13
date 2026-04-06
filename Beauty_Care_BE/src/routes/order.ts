import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/", controllers.getOrders);
router.get("/:orderId", controllers.getOrderDetail);
router.post("/checkout", controllers.createOrder);
router.post("/cancel", controllers.cancelOrder);

export default router;
