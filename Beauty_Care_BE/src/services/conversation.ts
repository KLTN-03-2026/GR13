import db from "../models";

export const createConversation = async (data: any) => {
  try {
    const [conversation, created] = await db.Conversation.findOrCreate({
      where: {
        userId: data.userId,
        expertId: data.expertId,
      },
      defaults: data,
    });

    const fullConversation = await db.Conversation.findByPk(conversation.id, {
      include: [
        { model: db.User, as: "userData" },
        { model: db.User, as: "expertData" },
      ],
    });

    return {
      err: 0,
      mes: created ? "Tạo cuộc trò chuyện thành công" : "Cuộc trò chuyện đã tồn tại",
      data: fullConversation,
    };
  } catch (error) {
    throw error;
  }
};

export const getConversationsByUserId = async (userId: number) => {
  try {
    const conversations = await db.Conversation.findAll({
      where: { userId },
      include: [
        { model: db.User, as: "userData" },
        { model: db.User, as: "expertData" },
        {
          model: db.Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    return {
      err: 0,
      mes: "Lấy danh sách cuộc trò chuyện thành công",
      data: conversations,
    };
  } catch (error) {
    throw error;
  }
};

export const getConversationsByExpertId = async (expertId: number) => {
  try {
    const conversations = await db.Conversation.findAll({
      where: { expertId },
      include: [
        { model: db.User, as: "userData" },
        { model: db.User, as: "expertData" },
        {
          model: db.Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    return {
      err: 0,
      mes: "Lấy danh sách cuộc trò chuyện thành công",
      data: conversations,
    };
  } catch (error) {
    throw error;
  }
};

export const getConversationById = async (id: number) => {
  try {
    const conversation = await db.Conversation.findByPk(id, {
      include: [
        { model: db.User, as: "userData" },
        { model: db.User, as: "expertData" },
        {
          model: db.Message,
          as: "messages",
          include: [{ model: db.User, as: "sender" }],
          order: [["createdAt", "ASC"]],
        },
      ],
    });
    if (!conversation) {
      return {
        err: 1,
        mes: "Cuộc trò chuyện không tồn tại",
        data: null,
      };
    }
    return {
      err: 0,
      mes: "Lấy cuộc trò chuyện thành công",
      data: conversation,
    };
  } catch (error) {
    throw error;
  }
};
