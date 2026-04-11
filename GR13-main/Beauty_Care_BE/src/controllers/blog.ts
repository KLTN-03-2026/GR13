import * as services from "../services/blog";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      slug: Joi.string().optional(),
      desc: Joi.string().required(),
      content: Joi.string().required(),
      image: Joi.string().uri().allow(null, "").optional(),
      category: Joi.string().optional(),
      blog_category_id: Joi.number().integer().optional(),
      status: Joi.string().valid("draft", "published", "archived").optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const authorId = (req as any).user?.id;
    const response = await services.createBlog(value, authorId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const response = await services.getAllBlogs(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID bài viết", res);
    const response = await services.getBlogById(+id, { incViews: true });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) return badRequest("Thiếu slug bài viết", res);
    const response = await services.getBlogBySlug(String(slug), {
      incViews: true,
    });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID bài viết", res);

    const schema = Joi.object({
      title: Joi.string().optional(),
      slug: Joi.string().optional(),
      desc: Joi.string().optional(),
      content: Joi.string().optional(),
      image: Joi.string().uri().allow(null, "").optional(),
      category: Joi.string().optional(),
      blog_category_id: Joi.number().integer().optional(),
      status: Joi.string().valid("draft", "published", "archived").optional(),
      views: Joi.number().integer().min(0).optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const authorId = (req as any).user?.id;
    const response = await services.updateBlog(+id, value, authorId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return badRequest("Thiếu ID bài viết", res);
    const authorId = (req as any).user?.id;
    const response = await services.deleteBlog(+id, authorId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
