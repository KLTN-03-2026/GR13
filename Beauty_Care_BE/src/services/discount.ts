import db from "../models";
import { Op } from "sequelize";

export const createDiscount = async (payload: any) => {
  try {
    const existing = await db.Discount.findOne({ where: { code: payload.code } });
    if (existing) {
      return { err: 1, mess: "Mã giảm giá đã tồn tại" };
    }
    const discount = await db.Discount.create(payload);
    return { err: 0, mess: "Tạo mã giảm giá thành công", data: discount };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi tạo mã giảm giá" };
  }
};

export const getDiscounts = async () => {
  try {
    const discounts = await db.Discount.findAll({
      order: [["createdAt", "DESC"]],
    });
    return { err: 0, mess: "Lấy danh sách mã giảm giá thành công", data: discounts };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy danh sách mã giảm giá" };
  }
};

export const getDiscountByCode = async (code: string) => {
  try {
    const discount = await db.Discount.findOne({
      where: {
        code,
        status: "active",
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
      },
    });

    if (!discount) {
      return { err: 1, mess: "Mã giảm giá không hợp lệ hoặc đã hết hạn" };
    }

    if (discount.usedCount >= discount.usageLimit) {
      return { err: 1, mess: "Mã giảm giá đã hết lượt sử dụng" };
    }

    return { err: 0, mess: "Lấy mã giảm giá thành công", data: discount };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi kiểm tra mã giảm giá" };
  }
};

export const updateDiscount = async (id: number, payload: any) => {
  try {
    const discount = await db.Discount.findByPk(id);
    if (!discount) return { err: 1, mess: "Không tìm thấy mã giảm giá" };

    await discount.update(payload);
    return { err: 0, mess: "Cập nhật mã giảm giá thành công", data: discount };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi cập nhật mã giảm giá" };
  }
};

export const deleteDiscount = async (id: number) => {
  try {
    const discount = await db.Discount.findByPk(id);
    if (!discount) return { err: 1, mess: "Không tìm thấy mã giảm giá" };

    await discount.destroy();
    return { err: 0, mess: "Xóa mã giảm giá thành công" };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi xóa mã giảm giá" };
  }
};
