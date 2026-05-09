import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";

export const getSkinAnalysisHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || (req as any).user.id;
    const response = await services.getSkinAnalysisHistory(+userId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const createSkinAnalysis = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const response = await services.createSkinAnalysis(userId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};