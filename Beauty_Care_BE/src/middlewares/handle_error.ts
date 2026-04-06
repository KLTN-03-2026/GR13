import createError from "http-errors";
import { Request, Response } from "express";

export const badRequest = (err: string, res: Response) => {
  const error = createError.BadRequest(err);
  return res.status(error.status).json({
    err: 1,
    mess: error.message,
  });
};

export const InternalServerError = (res: Response) => {
  const error = createError.InternalServerError();
  return res.status(error.status).json({
    err: 1,
    mess: error.message,
  });
};

export const NotFound = (req: Request, res: Response) => {
  const error = createError.NotFound("This route is not defined");
  return res.status(error.status).json({
    err: 1,
    mess: error.message,
  });
};

export const NotAuth = (err: string, res: Response) => {
  const error = createError.Unauthorized(err);
  return res.status(error.status).json({
    err: 1,
    mess: error.message,
  });
};
