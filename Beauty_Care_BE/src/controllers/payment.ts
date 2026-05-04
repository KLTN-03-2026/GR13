import * as paymentService from "../services/payment";

export const createPaymentLink = async (req: any, res: any) => {
  try {
    const { orderId } = req.body;
    const result = await paymentService.createPaymentLink(orderId);
    return res.json(result);
  } catch (error: any) {
    console.error("Controller Error (createPaymentLink):", error);
    return res.status(500).json({ err: 1, mess: error.message || "Lỗi server" });
  }
};

export const handleWebhook = async (req: any, res: any) => {
  try {
    const result = await paymentService.handleWebhook(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error("Controller Error (handleWebhook):", error);
    return res.status(500).json({ err: 1, mess: error.message || "Lỗi server" });
  }
};

export const verifyPayment = async (req: any, res: any) => {
  try {
    const { orderId } = req.body;
    const result = await paymentService.verifyPayment(orderId);
    return res.json(result);
  } catch (error: any) {
    console.error("Controller Error (verifyPayment):", error);
    return res.status(500).json({ err: 1, mess: error.message || "Lỗi server" });
  }
};