import * as messageService from "../services/message";

export const createMessage = async (req: any, res: any) => {
  try {
    const response = await messageService.createMessage(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at message controller: " + error.message,
    });
  }
};

export const getMessagesByConversationId = async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;
    const response = await messageService.getMessagesByConversationId(+conversationId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at message controller: " + error.message,
    });
  }
};
