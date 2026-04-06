import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/", controllers.getCart);
router.post("/add", controllers.addToCart);
router.put("/update", controllers.updateCartItem);
router.delete("/remove", controllers.removeFromCart);

export default router;
