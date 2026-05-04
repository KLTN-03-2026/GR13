"use strict";

import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.addColumn("Orders", "paymentLinkId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "checkoutUrl", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "orderCode", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.removeColumn("Orders", "paymentLinkId");
    await queryInterface.removeColumn("Orders", "checkoutUrl");
    await queryInterface.removeColumn("Orders", "orderCode");
  },
};
