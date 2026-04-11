"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Admin",
          lastName: "System",
          Email: "admin@techspa.com",
          Phone: "0123456789",
          img: "https://example.com/admin.png",
          avatar: "https://example.com/admin.png",
          password: "password123", // Trong thực tế nên hash password
          role_code: "R1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any,
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Users", {}, {});
  },
};
