import { Request, Response } from "express";
import * as services from "../services/product_recommendation";
import { InternalServerError, badRequest } from "../middlewares/handle_error";

export const getAllRecommendations = async (req: Request, res: Response) => {
  try {
    const response = await services.getAllRecommendations();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const createRecommendation = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return badRequest("Thiếu thông tin tư vấn", res);
    const response = await services.createRecommendation(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateRecommendation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID tư vấn", res);
    const response = await services.updateRecommendation(+id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteRecommendation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID tư vấn", res);
    const response = await services.deleteRecommendation(+id);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
