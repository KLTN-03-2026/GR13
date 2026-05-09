import * as conversationService from "../services/conversation";

export const createConversation = async (req: any, res: any) => {
  try {
    const response = await conversationService.createConversation(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at conversation controller: " + error.message,
    });
  }
};

export const getConversationsByUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const response = await conversationService.getConversationsByUserId(+userId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at conversation controller: " + error.message,
    });
  }
};

export const getConversationsByExpertId = async (req: any, res: any) => {
  try {
    const { expertId } = req.params;
    const response = await conversationService.getConversationsByExpertId(+expertId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at conversation controller: " + error.message,
    });
  }
};

export const getConversationById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const response = await conversationService.getConversationById(+id);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at conversation controller: " + error.message,
    });
  }
};

export const getAllConversations = async (req: any, res: any) => {
  try {
    const response = await conversationService.getAllConversations();
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at conversation controller: " + error.message,
    });
  }
};
