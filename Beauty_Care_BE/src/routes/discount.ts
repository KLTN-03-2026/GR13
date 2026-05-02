import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// Public routes (cho khách hàng kiểm tra mã)
router.get("/check/:code", controllers.checkDiscount);

// Admin routes (quản lý mã giảm giá)
router.use(verifyToken);
router.use(isAdmin);

router.post("/", controllers.createDiscount);
router.get("/", controllers.getDiscounts);
router.put("/:id", controllers.updateDiscount);
router.delete("/:id", controllers.deleteDiscount);

export default router;
