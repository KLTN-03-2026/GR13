import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";
import { password } from "../helpers/joi_schema";

export const register = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password,
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const {
      email: emailValue,
      password: passwordValue,
      firstName,
      lastName,
    } = value as any;

    const response = await services.register({
      email: emailValue,
      password: passwordValue,
      firstName,
      lastName,
    });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      account: Joi.string().required(),
      password,
    });
    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const { account, password: passwordValue } = value as any;
    const response = await services.login({
      account,
      password: passwordValue,
    });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
