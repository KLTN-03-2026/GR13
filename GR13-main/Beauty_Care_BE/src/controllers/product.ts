import { Request, Response } from "express";
import * as services from "../services/product";
import { InternalServerError, badRequest } from "../middlewares/handle_error";

// --- Category Controllers ---

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const response = await services.getAllCategories();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return badRequest("Thiếu tên danh mục", res);
    const response = await services.createCategory(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID danh mục", res);
    const response = await services.updateCategory(+id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID danh mục", res);
    const response = await services.deleteCategory(+id);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

// --- Product Controllers ---

export const getProducts = async (req: Request, res: Response) => {
  try {
    const response = await services.getProducts(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID sản phẩm", res);
    const response = await services.getProductById(+id);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, categoryId } = req.body;
    if (!name || !price || !description || !image || !categoryId) {
      return badRequest("Thiếu thông tin sản phẩm", res);
    }
    const response = await services.createProduct(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID sản phẩm", res);
    const response = await services.updateProduct(+id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID sản phẩm", res);
    const response = await services.deleteProduct(+id);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
