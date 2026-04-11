import { Request, Response } from "express";
import * as services from "../services/blog_category";
import { InternalServerError, badRequest } from "../middlewares/handle_error";

export const createBlogCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return badRequest("Tên danh mục là bắt buộc", res);
    const response = await services.createBlogCategory(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getAllBlogCategories = async (req: Request, res: Response) => {
  try {
    const response = await services.getAllBlogCategories();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateBlogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("ID là bắt buộc", res);
    const response = await services.updateBlogCategory(Number(id), req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteBlogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("ID là bắt buộc", res);
    const response = await services.deleteBlogCategory(Number(id));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
