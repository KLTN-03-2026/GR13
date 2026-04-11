import * as services from "../services/role";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const response = await services.getAllRoles();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { code, value } = req.body;
    if (!code || !value) return badRequest("Thiếu code hoặc value", res);
    const response = await services.createRole(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { code, value } = req.body;
    if (!code || !value) return badRequest("Thiếu code hoặc value", res);
    const response = await services.updateRole(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) return badRequest("Thiếu code quyền", res);
    const response = await services.deleteRole(code as string);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
