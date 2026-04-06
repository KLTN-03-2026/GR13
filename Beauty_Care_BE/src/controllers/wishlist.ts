import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.toggleWishlist(userId, value.productId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getMyWishlist = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const response = await services.getMyWishlist(userId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
