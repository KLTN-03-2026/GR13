"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "CartItems",
      [
        {
          cartId: 1,
          productId: 1, // Giả sử đã có sản phẩm id 1
          quantity: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: 1,
          productId: 2, // Giả sử đã có sản phẩm id 2
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("CartItems", {}, {});
  },
};
