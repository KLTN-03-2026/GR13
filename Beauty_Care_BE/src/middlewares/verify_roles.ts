import { NextFunction, Request, Response } from "express";
import { NotAuth } from "./handle_error";

interface AuthRequest extends Request {
  user?: {
    role_code: string;
    [key: string]: any;
  };
}

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { role_code } = req.user || {};
  if (role_code !== "R1" && role_code !== "R2")
    return NotAuth("Require role Admin", res);
  next();
};

export const isModeratorOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { role_code } = req.user || {};
  if (role_code !== "R1" && role_code !== "R2" && role_code !== "R3")
    return NotAuth("Require role Admin or Moderator or Regular User", res);
  next();
};
