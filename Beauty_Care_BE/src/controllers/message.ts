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

export const uploadImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ err: 1, mes: "No file uploaded" });
    }
    const protocol = req.protocol;
    const host = req.get("host");
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    return res.status(200).json({
      err: 0,
      mes: "Upload success",
      url: imageUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at uploadImage: " + error.message,
    });
  }
};

export const markAsRead = async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    if (!conversationId || !userId) {
      return res.status(400).json({
        err: 1,
        mes: "Thiếu conversationId hoặc userId",
      });
    }
    const response = await messageService.markAsRead(+conversationId, +userId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      err: -1,
      mes: "Fail at message controller: " + error.message,
    });
  }
};
