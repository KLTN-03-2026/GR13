import express from "express";
import * as authController from "../controllers/auth";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login-user", authController.loginUser);
router.post("/login-google", authController.loginGoogle);

export default router;
