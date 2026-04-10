import db from "../models";

const getCartDataById = async (cartId: number) => {
  return await db.Cart.findOne({
    where: { id: cartId },
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
};

export const getCart = async (userId: number) => {
  try {
    // Tìm hoặc tạo mới giỏ hàng cho người dùng
    const [cart] = await db.Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    const cartData = await getCartDataById(cart.id);

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

    if (product.status !== "active") {
      return {
        err: 1,
        mess: "Sản phẩm hiện không khả dụng",
      };
    }

    if (typeof product.stock === "number" && product.stock <= 0) {
      return {
        err: 1,
        mess: "Sản phẩm đã hết hàng",
      };
    }

    // 2. Tìm hoặc tạo giỏ hàng
    const [cart] = await db.Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    const existingCartItem = await db.CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      const nextQuantity = existingCartItem.quantity + quantity;
      if (typeof product.stock === "number" && nextQuantity > product.stock) {
        return {
          err: 1,
          mess: `Số lượng vượt quá tồn kho (còn ${product.stock})`,
        };
      }
      await existingCartItem.update({ quantity: nextQuantity });
    } else {
      if (typeof product.stock === "number" && quantity > product.stock) {
        return {
          err: 1,
          mess: `Số lượng vượt quá tồn kho (còn ${product.stock})`,
        };
      }
      await db.CartItem.create({ cartId: cart.id, productId, quantity });
    }

    const cartData = await getCartDataById(cart.id);
    return {
      err: 0,
      mess: "Đã thêm vào giỏ hàng",
      data: cartData,
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
      const cartData = await getCartDataById(cart.id);
      return {
        err: 0,
        mess: "Đã xóa sản phẩm khỏi giỏ hàng",
        data: cartData,
      };
    }

    const product = await db.Product.findByPk(productId);
    if (!product) {
      return {
        err: 1,
        mess: "Sản phẩm không tồn tại",
      };
    }

    if (product.status !== "active") {
      return {
        err: 1,
        mess: "Sản phẩm hiện không khả dụng",
      };
    }

    if (typeof product.stock === "number" && quantity > product.stock) {
      return {
        err: 1,
        mess: `Số lượng vượt quá tồn kho (còn ${product.stock})`,
      };
    }

    await cartItem.update({ quantity });
    const cartData = await getCartDataById(cart.id);
    return {
      err: 0,
      mess: "Cập nhật số lượng thành công",
      data: cartData,
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

    const cartData = await getCartDataById(cart.id);
    return {
      err: deleted > 0 ? 0 : 1,
      mess: deleted > 0 ? "Đã xóa khỏi giỏ hàng" : "Sản phẩm không có trong giỏ hàng",
      data: cartData,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi xóa khỏi giỏ hàng",
    };
  }
};
