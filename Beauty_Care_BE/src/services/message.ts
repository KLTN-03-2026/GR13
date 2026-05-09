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
    io.to(`conversation_${data.conversation_id}`).emit("receiveMessage", fullMessage);

    // Also emit to individual expert/user rooms for sidebar updates
    const conv = await db.Conversation.findByPk(data.conversation_id);
    if (conv) {
      io.to(`expert_${conv.expertId}`).emit("receiveMessage", fullMessage);
      io.to(`user_${conv.userId}`).emit("receiveMessage", fullMessage);
    }

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

export const markAsRead = async (conversationId: number, userId: number) => {
  try {
    await db.Message.update(
      { is_read: true },
      {
        where: {
          conversation_id: conversationId,
          sender_id: { [db.Sequelize.Op.ne]: userId },
          is_read: false,
        },
      }
    );
    return {
      err: 0,
      mes: "Đánh dấu đã đọc thành công",
    };
  } catch (error) {
    throw error;
  }
};
