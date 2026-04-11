"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Roles",
      [
        {
          code: "R1",
          value: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "R2",
          value: "Staff",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "R3",
          value: "Customer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any,
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Roles", {}, {});
  },
};
