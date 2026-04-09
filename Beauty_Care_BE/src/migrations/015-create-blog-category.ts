"use strict";

import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // 1. Create blog_categories table
    await queryInterface.createTable("blog_categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    });

    // 2. Add blog_category_id to blogs table
    await queryInterface.addColumn("blogs", "blog_category_id", {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("blogs", "blog_category_id");
    await queryInterface.changeColumn("blogs", "category", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.dropTable("blog_categories");
  },
};
