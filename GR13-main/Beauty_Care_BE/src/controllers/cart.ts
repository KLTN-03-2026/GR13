import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const response = await services.getCart(userId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
      quantity: Joi.number().min(1).optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const { productId, quantity } = value;
    const response = await services.addToCart(userId, productId, quantity);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
      quantity: Joi.number().min(0).required(), // 0 means remove
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const { productId, quantity } = value;
    const response = await services.updateCartItem(userId, productId, quantity);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.query);
    if (error) return badRequest(error.details[0].message, res);

    const { productId } = value;
    const response = await services.removeFromCart(userId, productId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
