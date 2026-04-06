import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      shippingAddress: Joi.string().required(),
      phone: Joi.string().required(),
      paymentMethod: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.createOrder({ userId, ...value });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const response = await services.getOrders(userId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const { orderId } = req.params;
    if (!orderId) return badRequest("Thiếu Order ID", res);

    const response = await services.getOrderDetail(userId, Number(orderId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const { orderId } = req.body;
    if (!orderId) return badRequest("Thiếu Order ID", res);

    const response = await services.cancelOrder(userId, Number(orderId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
