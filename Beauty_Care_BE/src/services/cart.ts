import db from "../models";

export const getCart = async (userId: number) => {
  try {
    // Tìm hoặc tạo mới giỏ hàng cho người dùng
    const [cart] = await db.Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    const cartData = await db.Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: db.CartItem,
          as: "cartItems",
          include: [
            {
              model: db.Product,
              as: "productData",
              attributes: ["id", "name", "price", "image", "discountPrice", "stock"],
            },
          ],
        },
      ],
    });

    return {
      err: 0,
      mess: "Lấy giỏ hàng thành công",
      data: cartData,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi lấy giỏ hàng",
    };
  }
};

export const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
  try {
    // 1. Kiểm tra sản phẩm có tồn tại không
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return {
        err: 1,
        mess: "Sản phẩm không tồn tại",
      };
    }

    // 2. Tìm hoặc tạo giỏ hàng
    const [cart] = await db.Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    // 3. Kiểm tra sản phẩm đã có trong giỏ chưa
    const [cartItem, created] = await db.CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { cartId: cart.id, productId, quantity },
    });

    if (!created) {
      // Nếu đã có thì tăng số lượng
      await cartItem.update({
        quantity: cartItem.quantity + quantity,
      });
    }

    return {
      err: 0,
      mess: "Đã thêm vào giỏ hàng",
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi thêm vào giỏ hàng",
    };
  }
};

export const updateCartItem = async (userId: number, productId: number, quantity: number) => {
  try {
    const cart = await db.Cart.findOne({ where: { userId } });
    if (!cart) {
      return {
        err: 1,
        mess: "Giỏ hàng không tồn tại",
      };
    }

    const cartItem = await db.CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      return {
        err: 1,
        mess: "Sản phẩm không có trong giỏ hàng",
      };
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return {
        err: 0,
        mess: "Đã xóa sản phẩm khỏi giỏ hàng",
      };
    }

    await cartItem.update({ quantity });
    return {
      err: 0,
      mess: "Cập nhật số lượng thành công",
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi cập nhật giỏ hàng",
    };
  }
};

export const removeFromCart = async (userId: number, productId: number) => {
  try {
    const cart = await db.Cart.findOne({ where: { userId } });
    if (!cart) {
      return {
        err: 1,
        mess: "Giỏ hàng không tồn tại",
      };
    }

    const deleted = await db.CartItem.destroy({
      where: { cartId: cart.id, productId },
    });

    return {
      err: deleted > 0 ? 0 : 1,
      mess: deleted > 0 ? "Đã xóa khỏi giỏ hàng" : "Sản phẩm không có trong giỏ hàng",
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi xóa khỏi giỏ hàng",
    };
  }
};
