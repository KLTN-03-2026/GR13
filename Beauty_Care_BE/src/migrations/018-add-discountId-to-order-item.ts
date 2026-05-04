"use strict";

import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.addColumn("OrderItems", "discountId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Discounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.removeColumn("OrderItems", "discountId");
  },
};
