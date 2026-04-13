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
      },
      {
        id: 5,
        name: "Review Sản Phẩm",
        description: "Đánh giá chân thực các sản phẩm skincare và makeup.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: "Trị mụn",
        description: "Chia sẻ kiến thức và routine trị các loại mụn.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name: "Chống lão hóa",
        description: "Bí quyết chăm sóc da chống lão hóa, giảm nếp nhăn.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name: "Chăm sóc cơ thể",
        description: "Dưỡng thể, body routine và tips chăm sóc da toàn thân.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        name: "Chăm sóc tóc",
        description: "Chia sẻ mẹo chăm sóc tóc, giảm gãy rụng và phục hồi.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        name: "Góc tư vấn",
        description: "Giải đáp thắc mắc thường gặp từ chuyên gia.",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true } as any);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any ) => {
    return queryInterface.bulkDelete("blog_categories", {}, {});
  }
};
