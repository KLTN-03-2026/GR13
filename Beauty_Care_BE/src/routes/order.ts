import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);

router.get("/admin", isAdmin, controllers.adminGetOrders);


router.get("/", controllers.getOrders);
router.get("/:orderId", controllers.getOrderDetail);
router.post("/checkout", controllers.createOrder);
router.post("/cancel", controllers.cancelOrder);

// Admin routes
router.get("/admin/list", isAdmin, controllers.adminGetOrders);

export default router;
