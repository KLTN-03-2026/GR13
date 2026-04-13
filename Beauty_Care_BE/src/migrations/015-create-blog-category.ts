"use strict";

import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    // 1. Create blog_categories table
    await queryInterface.createTable("blog_categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // 2. Add blog_category_id to blogs table
    await queryInterface.addColumn("blogs", "blog_category_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "blog_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // 3. Make category column in blogs nullable
    await queryInterface.changeColumn("blogs", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.removeColumn("blogs", "blog_category_id");
    await queryInterface.changeColumn("blogs", "category", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.dropTable("blog_categories");
  },
};
