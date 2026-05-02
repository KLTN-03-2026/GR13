"use strict";
import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Discounts",
      [
        {
          id: 1,
          name: "Chào mừng thành viên mới",
          code: "WELCOME2026",
          description: "Giảm 10% cho đơn hàng đầu tiên",
          discountValue: 10.0,
          discountType: "percentage",
          minOrderValue: 100000.0,
          maxDiscountValue: 50000.0,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          usageLimit: 1000,
          usedCount: 0,
          userUsageLimit: 1,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Tri ân khách hàng",
          code: "GIAM50K",
          description: "Giảm trực tiếp 50,000đ cho đơn hàng từ 500,000đ",
          discountValue: 50000.0,
          discountType: "fixed",
          minOrderValue: 500000.0,
          maxDiscountValue: null,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          usageLimit: 500,
          usedCount: 0,
          userUsageLimit: 1,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Discounts", {}, {});
  },
};
