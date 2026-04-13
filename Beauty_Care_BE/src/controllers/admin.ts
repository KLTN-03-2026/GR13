import * as services from "../services";
import { InternalServerError } from "../middlewares/handle_error";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const response = await services.getDashboardStats();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

