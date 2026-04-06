"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Categories",
      [
        {
          id: 1,
          name: "Chăm sóc da mặt",
          description: "Các sản phẩm chăm sóc da mặt chuyên sâu từ sữa rửa mặt, serum đến kem dưỡng.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234567/skincare_face.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Chăm sóc cơ thể",
          description: "Sản phẩm dưỡng thể, sữa tắm và các liệu pháp spa tại nhà.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234568/body_care.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Trang điểm",
          description: "Mỹ phẩm trang điểm cao cấp giúp tôn vinh vẻ đẹp tự nhiên.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234569/makeup.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Tinh dầu & Nến thơm",
          description: "Tạo không gian thư giãn với các loại tinh dầu thiên nhiên và nến thơm cao cấp.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234570/essential_oils.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Categories", {}, {});
  },
};
