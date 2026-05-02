import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const createDiscount = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      code: Joi.string().required(),
      description: Joi.string().allow("", null).optional(),
      discountValue: Joi.number().required(),
      discountType: Joi.string().valid("percentage", "fixed").required(),
      minOrderValue: Joi.number().min(0).optional(),
      maxDiscountValue: Joi.number().min(0).allow(null).optional(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      usageLimit: Joi.number().min(1).optional(),
      userUsageLimit: Joi.number().min(1).optional(),
      status: Joi.string().valid("active", "inactive").optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.createDiscount(value);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getDiscounts = async (req: Request, res: Response) => {
  try {
    const response = await services.getDiscounts();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const checkDiscount = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) return badRequest("Thiếu mã giảm giá", res);

    const response = await services.getDiscountByCode(code as string);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID", res);

    const response = await services.updateDiscount(+(id as string), req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID", res);

    const response = await services.deleteDiscount(+(id as string));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
