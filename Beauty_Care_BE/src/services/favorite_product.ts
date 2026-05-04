import db from "../models";

export const toggleFavoriteProduct = async (userId: number, productId: number) => {
  try {
    const product = await db.Product.findByPk(productId);
    if (!product) return { err: 1, mess: "Sản phẩm không tồn tại" };

    const existing = await db.FavoriteProduct.findOne({
      where: { userId, productId },
    });

    if (existing) {
      await existing.destroy();
      return {
        err: 0,
        mess: "Đã xóa khỏi danh sách yêu thích",
        isFavorited: false,
      };
    } else {
      await db.FavoriteProduct.create({ userId, productId });
      return {
        err: 0,
        mess: "Đã thêm vào danh sách yêu thích",
        isFavorited: true,
      };
    }
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra" };
  }
};

export const getMyFavoriteProducts = async (userId: number) => {
  try {
    const favorites = await db.FavoriteProduct.findAll({
      where: { userId },
      include: [
        { model: db.Product, as: "productData" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách yêu thích thành công",
      data: favorites,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy danh sách yêu thích" };
  }
};

export const getFavoriteProductCount = async (userId: number) => {
  try {
    const count = await db.FavoriteProduct.count({
      where: { userId },
    });

    return {
      err: 0,
      mess: "Lấy số lượng yêu thích thành công",
      data: { count },
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy số lượng yêu thích" };
  }
};
