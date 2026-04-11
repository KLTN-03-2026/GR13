import db from "../models";

export const createReview = async (payload: {
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  image?: string;
}) => {
  try {
    const { userId, productId, rating, comment, image } = payload;

    // 1. Kiểm tra sản phẩm có tồn tại không
    const product = await db.Product.findByPk(productId);
    if (!product) return { err: 1, mess: "Sản phẩm không tồn tại" };

    // 2. Kiểm tra xem người dùng đã mua sản phẩm này chưa (Tùy chọn nhưng nên có)
    // Ở đây tôi cho phép đánh giá luôn để bạn dễ test

    // 3. Tạo đánh giá
    const review = await db.Review.create({
      userId,
      productId,
      rating,
      comment,
      image,
    });

    return {
      err: 0,
      mess: "Cảm ơn bạn đã đánh giá sản phẩm",
      data: review,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi gửi đánh giá" };
  }
};

export const getReviewsByProduct = async (productId: number) => {
  try {
    const reviews = await db.Review.findAll({
      where: { productId },
      include: [
        {
          model: db.User,
          as: "userData",
          attributes: ["firstName", "lastName", "img", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách đánh giá thành công",
      data: reviews,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy đánh giá" };
  }
};

export const deleteReview = async (userId: number, reviewId: number) => {
  try {
    const deleted = await db.Review.destroy({
      where: { id: reviewId, userId },
    });

    return {
      err: deleted > 0 ? 0 : 1,
      mess: deleted > 0 ? "Xóa đánh giá thành công" : "Không tìm thấy đánh giá hoặc bạn không có quyền xóa",
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi xóa đánh giá" };
  }
};

export const adminGetReviews = async () => {
  try {
    const reviews = await db.Review.findAll({
      include: [
        {
          model: db.User,
          as: "userData",
          attributes: ["id", "firstName", "lastName", "Email", "Phone", "img", "avatar"],
        },
        {
          model: db.Product,
          as: "productData",
          attributes: ["id", "name", "image", "price", "discountPrice", "stock", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách đánh giá thành công",
      data: reviews,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy đánh giá", data: [] };
  }
};

export const adminDeleteReview = async (reviewId: number) => {
  try {
    const deleted = await db.Review.destroy({
      where: { id: reviewId },
    });

    return {
      err: deleted > 0 ? 0 : 1,
      mess: deleted > 0 ? "Xóa đánh giá thành công" : "Không tìm thấy đánh giá",
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi xóa đánh giá" };
  }
};
