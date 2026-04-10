import db from "../models";
import { Op } from "sequelize";

export const getDashboardStats = async () => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalBookings,
      ordersPending,
      ordersPaid,
      ordersShipping,
      ordersCompleted,
      ordersCancelled,
    ] = await Promise.all([
      db.User.count(),
      db.Product.count(),
      db.Order.count(),
      db.Booking.count(),
      db.Order.count({ where: { status: "pending" } }),
      db.Order.count({ where: { status: "paid" } }),
      db.Order.count({ where: { status: "shipping" } }),
      db.Order.count({ where: { status: "completed" } }),
      db.Order.count({ where: { status: "cancelled" } }),
    ]);

    const revenueRow = await db.Order.findOne({
      attributes: [
        [
          db.Sequelize.fn("SUM", db.Sequelize.col("totalAmount")),
          "totalRevenue",
        ],
      ],
      where: {
        status: {
          [Op.in]: ["paid", "shipping", "completed"],
        },
      },
      raw: true,
    });

    const totalRevenue = (revenueRow?.totalRevenue ?? "0") as string;

    return {
      err: 0,
      mess: "Lấy thống kê thành công",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalBookings,
        ordersByStatus: {
          pending: ordersPending,
          paid: ordersPaid,
          shipping: ordersShipping,
          completed: ordersCompleted,
          cancelled: ordersCancelled,
        },
        totalRevenue,
      },
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy thống kê" };
  }
};
