import db from "../models";

export const getSkinAnalysisHistory = async (userId: number) => {
  try {
    const history = await db.SkinAnalysisHistory.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
    return {
      err: 0,
      mess: "Lấy lịch sử phân tích da thành công",
      data: history,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra" };
  }
};

export const createSkinAnalysis = async (userId: number, data: any) => {
  try {
    const response = await db.SkinAnalysisHistory.create({
      user_id: userId,
      ...data,
    });
    return {
      err: 0,
      mess: "Lưu kết quả phân tích da thành công",
      data: response,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra" };
  }
};