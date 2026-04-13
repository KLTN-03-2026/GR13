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
        {
          id: 5,
          name: "Chống nắng",
          description: "Kem chống nắng bảo vệ da khỏi tia UV và ánh sáng xanh.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234575/sunscreen.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Toner / Nước hoa hồng",
          description: "Cân bằng pH, làm dịu và chuẩn bị da cho các bước dưỡng tiếp theo.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234576/toner.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Mặt nạ",
          description: "Mặt nạ giấy, mặt nạ đất sét giúp cấp ẩm và làm sạch sâu.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234577/mask.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "Chăm sóc tóc",
          description: "Dầu gội, dầu xả, ủ tóc giúp phục hồi và nuôi dưỡng tóc.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234578/haircare.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "Phụ kiện làm đẹp",
          description: "Bông tẩy trang, cọ trang điểm và phụ kiện chăm sóc cá nhân.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234579/accessories.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: "Dụng cụ Spa tại nhà",
          description: "Máy xông mặt, con lăn massage và các dụng cụ hỗ trợ spa tại nhà.",
          image: "https://res.cloudinary.com/demo/image/upload/v1631234580/home_spa.jpg",
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
