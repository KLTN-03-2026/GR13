"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "OrderItems",
      [
        // Đơn 1 (completed): 2 x Sữa rửa mặt (id: 1, 280k)
        {
          id: 1,
          orderId: 1,
          productId: 1,
          quantity: 2,
          price: 280000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Đơn 2 (pending): 1 Kem chống nắng (id: 3, 420k) + 1 Serum (id: 4, 250k)
        {
          id: 2,
          orderId: 2,
          productId: 3,
          quantity: 1,
          price: 420000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          orderId: 2,
          productId: 4,
          quantity: 1,
          price: 250000,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("OrderItems", {}, {});
  },
};
