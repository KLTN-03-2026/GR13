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
      acne_score: {
        type: Sequelize.INTEGER,
      },
      blackheads_score: {
        type: Sequelize.INTEGER,
      },
      dark_spots_score: {
        type: Sequelize.INTEGER,
      },
      pores_score: {
        type: Sequelize.INTEGER,
      },
      wrinkles_score: {
        type: Sequelize.INTEGER,
      },
      overall_score: {
        type: Sequelize.INTEGER,
      },
      advice_id: {
        type: Sequelize.INTEGER,
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