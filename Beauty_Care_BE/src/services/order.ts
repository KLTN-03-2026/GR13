import db from "../models";
import { sequelize } from "../models";

export const createOrder = async (payload: {
  userId: number;
  shippingAddress: string;
  phone: string;
  paymentMethod?: string;
}) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, shippingAddress, phone, paymentMethod = "COD" } = payload;

    // 1. Lấy giỏ hàng của người dùng
    const cart = await db.Cart.findOne({
      where: { userId },
      include: [
        {
          model: db.CartItem,
          as: "cartItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
      transaction,
    });

    if (!cart || cart.cartItems.length === 0) {
      await transaction.rollback();
      return {
        err: 1,
        mess: "Giỏ hàng trống",
      };
    }

    // 2. Tính tổng tiền và kiểm tra tồn kho
    let totalAmount = 0;
    for (const item of cart.cartItems) {
      const product = item.productData;
      if (product.stock < item.quantity) {
        await transaction.rollback();
        return {
          err: 1,
          mess: `Sản phẩm ${product.name} không đủ tồn kho`,
        };
      }
      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;
    }

    // 3. Tạo đơn hàng
    const order = await db.Order.create(
      {
        userId,
        totalAmount,
        shippingAddress,
        phone,
        paymentMethod,
        status: "pending",
      },
      { transaction }
    );

    // 4. Tạo chi tiết đơn hàng và cập nhật tồn kho
    for (const item of cart.cartItems) {
      const product = item.productData;
      const price = product.discountPrice || product.price;

      await db.OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price,
        },
        { transaction }
      );

      // Trừ tồn kho
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction }
      );
    }

    // 5. Xóa giỏ hàng sau khi đặt hàng thành công
    await db.CartItem.destroy({
      where: { cartId: cart.id },
      transaction,
    });

    await transaction.commit();

    return {
      err: 0,
      mess: "Đặt hàng thành công",
      orderId: order.id,
    };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi đặt hàng",
    };
  }
};

export const getOrders = async (userId: number) => {
  try {
    const orders = await db.Order.findAll({
      where: { userId },
      include: [
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi lấy danh sách đơn hàng",
    };
  }
};

export const getOrderDetail = async (userId: number, orderId: number) => {
  try {
    const order = await db.Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
    });

    if (!order) {
      return {
        err: 1,
        mess: "Không tìm thấy đơn hàng",
      };
    }

    return {
      err: 0,
      mess: "Lấy chi tiết đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi lấy chi tiết đơn hàng",
    };
  }
};

export const cancelOrder = async (userId: number, orderId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await db.Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: db.OrderItem, as: "orderItems" }],
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return { err: 1, mess: "Không tìm thấy đơn hàng" };
    }

    if (order.status !== "pending") {
      await transaction.rollback();
      return { err: 1, mess: "Chỉ có thể hủy đơn hàng đang chờ xử lý" };
    }

    // 1. Cập nhật trạng thái đơn hàng
    await order.update({ status: "cancelled" }, { transaction });

    // 2. Hoàn lại tồn kho cho sản phẩm
    for (const item of order.orderItems) {
      await db.Product.increment(
        { stock: item.quantity },
        { where: { id: item.productId }, transaction }
      );
    }

    await transaction.commit();
    return { err: 0, mess: "Hủy đơn hàng thành công" };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi hủy đơn hàng" };
  }
};

export const adminGetOrders = async () => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.User,
          as: "userData",
          attributes: ["id", "firstName", "lastName", "Email", "Phone", "role_code"],
        },
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi lấy danh sách đơn hàng",
      data: [],
    };
  }
};

export const adminGetOrderDetail = async (orderId: number) => {
  try {
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.User,
          as: "userData",
          attributes: ["id", "firstName", "lastName", "Email", "Phone", "role_code"],
        },
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
    });

    if (!order) {
      return {
        err: 1,
        mess: "Không tìm thấy đơn hàng",
      };
    }

    return {
      err: 0,
      mess: "Lấy chi tiết đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Có lỗi xảy ra khi lấy chi tiết đơn hàng",
    };
  }
};

export const adminUpdateOrderStatus = async (
  orderId: number,
  status: "pending" | "paid" | "shipping" | "completed" | "cancelled",
) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [{ model: db.OrderItem, as: "orderItems" }],
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return { err: 1, mess: "Không tìm thấy đơn hàng" };
    }

    if (order.status === "completed" && status === "cancelled") {
      await transaction.rollback();
      return { err: 1, mess: "Không thể hủy đơn hàng đã hoàn thành" };
    }

    if (order.status !== "cancelled" && status === "cancelled") {
      for (const item of order.orderItems) {
        await db.Product.increment(
          { stock: item.quantity },
          { where: { id: item.productId }, transaction }
        );
      }
    }

    await order.update({ status }, { transaction });
    await transaction.commit();

    const updated = await db.Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.User,
          as: "userData",
          attributes: ["id", "firstName", "lastName", "Email", "Phone", "role_code"],
        },
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
    });

    return { err: 0, mess: "Cập nhật trạng thái đơn hàng thành công", data: updated };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng" };
  }
};
