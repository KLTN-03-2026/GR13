import Joi from "joi";

export const email = Joi.string().pattern(new RegExp("gmail.com$")).required();

export const password = Joi.string()
  .min(8)
  .max(20)
  .pattern(new RegExp("^[A-Z](?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]+$"))
  .required()
  .messages({
    "string.pattern.base":
      "Mật khẩu phải bắt đầu bằng chữ hoa, có ít nhất 1 số và 1 ký tự đặc biệt",
    "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
    "string.max": "Mật khẩu không được vượt quá 20 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  });
export const firstName = Joi.string().required();
export const lastName = Joi.string().required();
export const title = Joi.string().required();
export const price = Joi.number().required();
export const image = Joi.string().uri().required();
export const categoryName = Joi.string().required();
export const productName = Joi.string().required();
export const productDesc = Joi.string().required();
export const productUsage = Joi.string().allow(null, "");
export const productStock = Joi.number().integer().min(0);
export const categoryId = Joi.number().integer().required();
export const brand = Joi.string().allow(null, "");
export const status = Joi.string().valid("active", "inactive");
