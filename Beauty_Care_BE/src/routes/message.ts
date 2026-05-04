import express from "express";
import * as messageController from "../controllers/message";
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/conversation/:conversationId", messageController.getMessagesByConversationId);

export default router;
