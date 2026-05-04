import db from "../models";
import { getIo } from "../socket";

export const createMessage = async (data: any) => {
  try {
    const message = await db.Message.create(data);
    const fullMessage = await db.Message.findByPk(message.id, {
      include: [{ model: db.User, as: "sender" }],
    });

    await db.Conversation.update(
      { updatedAt: new Date() },
      { where: { id: data.conversation_id } }
    );

    const io = getIo();
    io.to(`conversation-${data.conversation_id}`).emit("receiveMessage", fullMessage);

    return {
      err: 0,
      mes: "Gửi tin nhắn thành công",
      data: fullMessage,
    };
  } catch (error) {
    throw error;
  }
};

export const getMessagesByConversationId = async (conversationId: number) => {
  try {
    const messages = await db.Message.findAll({
      where: { conversation_id: conversationId },
      include: [{ model: db.User, as: "sender" }],
      order: [["createdAt", "ASC"]],
    });
    return {
      err: 0,
      mes: "Lấy danh sách tin nhắn thành công",
      data: messages,
    };
  } catch (error) {
    throw error;
  }
};
