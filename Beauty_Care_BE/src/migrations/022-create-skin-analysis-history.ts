"use strict";

import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable("SkinAnalysisHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      skin_image: {
        type: Sequelize.STRING,
      },
      detected_skin_type: {
        type: Sequelize.STRING,
      },
      pore_level: {
        type: Sequelize.STRING,
      },
      absorption_level: {
        type: Sequelize.STRING,
      },
      acne_area: {
        type: Sequelize.STRING,
      },
      analysis_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("SkinAnalysisHistories");
  },
};