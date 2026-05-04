import express from "express";
import * as conversationController from "../controllers/conversation";
const router = express.Router();

router.post("/", conversationController.createConversation);
router.get("/user/:userId", conversationController.getConversationsByUserId);
router.get("/expert/:expertId", conversationController.getConversationsByExpertId);
router.get("/:id", conversationController.getConversationById);

export default router;
