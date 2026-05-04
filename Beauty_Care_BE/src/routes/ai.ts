import express from "express";
import * as controller from "../controllers/ai";

const router = express.Router();

router.post("/predict", controller.upload.single("file"), controller.predict);
router.post("/analyze", controller.analyze);

export default router;
