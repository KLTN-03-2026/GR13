import crypto from "crypto";
import jwt from "jsonwebtoken";
import db from "../models";
import { Op } from "sequelize";

const hashPassword = (plainPassword: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
};

const verifyPassword = (plainPassword: string, storedPassword: string) => {
  if (!storedPassword.includes(":")) return plainPassword === storedPassword;
  const [salt, hashed] = storedPassword.split(":");
  if (!salt || !hashed) return false;
  const hashedVerify = crypto
    .scryptSync(plainPassword, salt, 64)
    .toString("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hashed, "hex"),
      Buffer.from(hashedVerify, "hex"),
    );
  } catch {
    return false;
  }
};

const signAccessToken = (payload: { id: number; role_code: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(
    payload,
    secret as jwt.Secret,
    {
      expiresIn: expiresIn as any,
    } as jwt.SignOptions,
  );
};

export const register = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const { email, password, firstName, lastName } = payload;
  const emailValue = email.trim().toLowerCase();

  const existing = await db.User.findOne({ where: { Email: emailValue } });
  if (existing) {
    return {
      err: 1,
      mess: "Email đã tồn tại",
    };
  }

  const created = await db.User.create({
    Email: emailValue,
    password: hashPassword(password),
    firstName,
    lastName,
    Phone: "0000000000",
    img: null,
    role_code: "R3",
  });

  const accessToken = signAccessToken({
    id: created.id,
    role_code: created.role_code,
  });

  return {
    err: 0,
    mess: "Đăng ký thành công",
    accessToken,
    user: {
      id: created.id,
      email: created.Email,
      firstName: created.firstName,
      lastName: created.lastName,
      role_code: created.role_code,
    },
  };
};

export const login = async (payload: { account: string; password: string }) => {
  const account = payload.account.trim();
  const emailValue = account.toLowerCase();
  const user = await db.User.findOne({
    where: {
      [Op.or]: [{ Email: emailValue }, { Phone: account }],
    },
  });
  if (!user) {
    return {
      err: 1,
      mess: "Email hoặc mật khẩu không đúng",
    };
  }

  const ok = verifyPassword(payload.password, user.password);
  if (!ok) {
    return {
      err: 1,
      mess: "Email hoặc mật khẩu không đúng",
    };
  }

  const accessToken = signAccessToken({
    id: user.id,
    role_code: user.role_code,
  });

  return {
    err: 0,
    mess: "Đăng nhập thành công",
    accessToken,
    user: {
      id: user.id,
      email: user.Email,
      firstName: user.firstName,
      lastName: user.lastName,
      role_code: user.role_code,
    },
  };
};
