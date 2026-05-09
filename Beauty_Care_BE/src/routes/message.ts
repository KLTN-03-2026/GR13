import express from "express";
import * as messageController from "../controllers/message";
import uploadLocal from "../config/multerLocal";

const router = express.Router();

router.post("/", messageController.createMessage);
router.post("/upload", uploadLocal.single("image"), messageController.uploadImage);
router.get("/conversation/:conversationId", messageController.getMessagesByConversationId);
router.put("/conversation/:conversationId/read", messageController.markAsRead);

export default router;
