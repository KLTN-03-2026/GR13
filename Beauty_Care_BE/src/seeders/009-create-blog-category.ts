"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert("blog_categories", [
      {
        id: 1,
        name: "Chăm sóc da",
        description: "Các bài viết chia sẻ bí quyết và quy trình chăm sóc da khoa học.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Trang điểm",
        description: "Hướng dẫn phong cách trang điểm từ cơ bản đến chuyên nghiệp.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Tư vấn",
        description: "Giải đáp thắc mắc và tư vấn lựa chọn sản phẩm phù hợp.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Xu hướng làm đẹp",
        description: "Cập nhật những xu hướng làm đẹp mới nhất trên thế giới.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], { ignoreDuplicates: true } as any);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any ) => {
    return queryInterface.bulkDelete("blog_categories", {}, {});
  }
};
