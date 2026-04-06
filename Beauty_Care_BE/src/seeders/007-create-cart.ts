"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Carts",
      [
        {
          id: 1,
          userId: 1, // Liên kết với Admin System (id: 1) từ seeder 001
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Carts", {}, {});
  },
};
