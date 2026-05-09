import db from "../models";

export const getAllRecommendations = async () => {
  try {
    const recommendations = await db.ProductRecommendation.findAll({
      order: [["id", "ASC"]],
    });
    return {
      err: 0,
      mess: "Lấy danh sách tư vấn thành công",
      data: recommendations,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: [],
    };
  }
};

export const createRecommendation = async (data: any) => {
  try {
    const recommendation = await db.ProductRecommendation.create(data);
    return {
      err: 0,
      mess: "Tạo tư vấn thành công",
      data: recommendation,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};

export const updateRecommendation = async (id: number, data: any) => {
  try {
    const recommendation = await db.ProductRecommendation.findByPk(id);
    if (!recommendation) {
      return { err: 1, mess: "Không tìm thấy tư vấn", data: null };
    }
    await recommendation.update(data);
    return {
      err: 0,
      mess: "Cập nhật tư vấn thành công",
      data: recommendation,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};

export const deleteRecommendation = async (id: number) => {
  try {
    const recommendation = await db.ProductRecommendation.findByPk(id);
    if (!recommendation) {
      return { err: 1, mess: "Không tìm thấy tư vấn", data: null };
    }
    await recommendation.destroy();
    return {
      err: 0,
      mess: "Xóa tư vấn thành công",
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};
