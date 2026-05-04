"use strict";

import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert("Categories", [
      {
        id: 1,
        name: "Sữa rửa mặt",
        description: "Các sản phẩm làm sạch sâu, dịu nhẹ cho da",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Tẩy trang",
        description: "Nước tẩy trang, dầu tẩy trang giúp làm sạch lớp trang điểm",
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7abc74a4?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Toner",
        description: "Nước hoa hồng cân bằng độ pH và cấp ẩm",
        image: "https://images.unsplash.com/photo-1615397323141-860882e3895e?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Serum",
        description: "Tinh chất đặc trị các vấn đề về da như mụn, thâm, lão hóa",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Kem dưỡng ẩm",
        description: "Cung cấp độ ẩm cần thiết, khóa ẩm và nuôi dưỡng làn da",
        image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Kem chống nắng",
        description: "Bảo vệ da khỏi tác hại của tia UV và ánh sáng xanh",
        image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Mặt nạ",
        description: "Mặt nạ giấy, đất sét, mặt nạ ngủ cung cấp dưỡng chất tức thì",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Tẩy tế bào chết",
        description: "Loại bỏ lớp sừng chết, giúp da sáng mịn và hấp thụ dưỡng chất tốt hơn",
        image: "https://images.unsplash.com/photo-1580870059089-4a00531a74d5?q=80&w=500&auto=format&fit=crop",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
