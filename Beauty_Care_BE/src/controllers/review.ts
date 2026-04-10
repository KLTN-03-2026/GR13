import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().allow("", null).optional(),
      image: Joi.string().allow("", null).optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.createReview({ userId, ...value });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) return badRequest("Thiếu Product ID", res);

    const response = await services.getReviewsByProduct(Number(productId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const { reviewId } = req.body;
    if (!reviewId) return badRequest("Thiếu Review ID", res);

    const response = await services.deleteReview(userId, Number(reviewId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const adminGetReviews = async (req: Request, res: Response) => {
  try {
    const response = await services.adminGetReviews();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const adminDeleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) return badRequest("Thiếu Review ID", res);

    const response = await services.adminDeleteReview(Number(reviewId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
