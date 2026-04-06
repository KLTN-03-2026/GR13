import db from "../models";

export const toggleWishlist = async (userId: number, productId: number) => {
  try {
    const product = await db.Product.findByPk(productId);
    if (!product) return { err: 1, mess: "Sản phẩm không tồn tại" };

    const existing = await db.Wishlist.findOne({
      where: { userId, productId },
    });

    if (existing) {
      await existing.destroy();
      return {
        err: 0,
        mess: "Đã xóa khỏi danh sách yêu thích",
        isWishlisted: false,
      };
    } else {
      await db.Wishlist.create({ userId, productId });
      return {
        err: 0,
        mess: "Đã thêm vào danh sách yêu thích",
        isWishlisted: true,
      };
    }
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra" };
  }
};

export const getMyWishlist = async (userId: number) => {
  try {
    const wishlist = await db.Wishlist.findAll({
      where: { userId },
      include: [
        { model: db.Product, as: "productData" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách yêu thích thành công",
      data: wishlist,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy danh sách yêu thích" };
  }
};
