"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Orders",
      [
        {
          id: 1,
          userId: 3, // Customer
          totalAmount: 560000, // 280k * 2
          status: "completed",
          paymentMethod: "COD",
          shippingAddress: "123 Đường A, Quận B, TP.HCM",
          phone: "0903456789",
          createdAt: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 ngày trước
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        },
        {
          id: 2,
          userId: 3,
          totalAmount: 670000, // 420k + 250k
          status: "pending",
          paymentMethod: "VNPAY",
          shippingAddress: "456 Đường C, Quận D, Hà Nội",
          phone: "0903456789",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Orders", {}, {});
  },
};
