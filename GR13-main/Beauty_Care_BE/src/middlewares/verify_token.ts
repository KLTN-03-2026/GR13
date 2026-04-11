import jwt from "jsonwebtoken";
import { NotAuth } from "./handle_error";
import { NextFunction, Request, Response } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token)
    return NotAuth("Yêu cầu xác thực (Authorization header missing)", res);

  const accessToken = token.split(" ")[1];
  if (!accessToken) return NotAuth("Token không hợp lệ", res);

  jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      const isExpired = err instanceof jwt.TokenExpiredError;
      return NotAuth(
        isExpired
          ? "Token đã hết hạn"
          : "Token không hợp lệ hoặc đã bị thay đổi",
        res
      );
    }
    // console.log("✅ User từ token:", user);
    (req as any).user = user;
    next();
  });
};
