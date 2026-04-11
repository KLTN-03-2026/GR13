import express from "express";
import * as userController from "../controllers/user";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// Private routes (Cần Token)
router.use(verifyToken);
router.get("/current", userController.getCurrent);
router.put("/update", userController.updateUser);
router.post("/record-activity", userController.recordActivity);

// Admin routes (Cần Token + Quyền Admin R1/R2)
router.use(isAdmin);
router.get("/all", userController.getAllUsers);
router.post("/create", userController.createUser);
router.put("/update-admin/:id", userController.updateUserByAdmin);
router.delete("/delete", userController.deleteUser);
router.get("/activity-stats", userController.getActivityStats);

export default router;
