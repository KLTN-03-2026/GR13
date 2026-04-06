import express from "express";
import * as controllers from "../controllers/product";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// --- Category Routes ---
router.get("/categories", controllers.getAllCategories);
router.post("/categories", [verifyToken, isAdmin], controllers.createCategory);
router.put("/categories/:id", [verifyToken, isAdmin], controllers.updateCategory);
router.delete("/categories/:id", [verifyToken, isAdmin], controllers.deleteCategory);

// --- Product Routes ---
router.get("/", controllers.getProducts);
router.get("/:id", controllers.getProductById);
router.post("/", [verifyToken, isAdmin], controllers.createProduct);
router.put("/:id", [verifyToken, isAdmin], controllers.updateProduct);
router.delete("/:id", [verifyToken, isAdmin], controllers.deleteProduct);

export default router;
