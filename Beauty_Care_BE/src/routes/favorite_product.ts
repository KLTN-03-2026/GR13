import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/", controllers.getMyFavoriteProducts);
router.get("/count", controllers.getFavoriteProductCount);
router.post("/toggle", controllers.toggleFavoriteProduct);

export default router;
