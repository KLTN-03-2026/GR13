import express from "express";
import * as roleController from "../controllers/role";

const router = express.Router();

router.get("/all", roleController.getRoles);
router.post("/create", roleController.createRole);
router.put("/update", roleController.updateRole);
router.delete("/delete", roleController.deleteRole);

export default router;
