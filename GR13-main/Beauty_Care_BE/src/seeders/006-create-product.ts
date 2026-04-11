"use strict";
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "Products",
      [
        {
          id: 1,
          name: "Sữa rửa mặt hoa hồng",
          description: "Sữa rửa mặt dịu nhẹ chiết xuất từ hoa hồng thiên nhiên giúp làm sạch sâu mà không gây khô da.",
          usage: "Sử dụng 2 lần mỗi ngày, sáng và tối. Lấy một lượng nhỏ tạo bọt và massage nhẹ nhàng trên da mặt.",
          price: 250000,
          discountPrice: 199000,
          image: "https://res.cloudinary.com/demo/image/upload/v1631234571/rose_cleanser.jpg",
          images: JSON.stringify([
            "https://res.cloudinary.com/demo/image/upload/v1631234571/rose_cleanser_1.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1631234571/rose_cleanser_2.jpg"
          ]),
          stock: 50,
          categoryId: 1,
          brand: "BeautyCare Natural",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Serum Vitamin C",
          description: "Serum làm sáng da, mờ thâm nám và chống lão hóa hiệu quả.",
          usage: "Nhỏ 3-4 giọt lên mặt sau khi làm sạch, vỗ nhẹ để tinh chất thẩm thấu.",
          price: 450000,
          discountPrice: 399000,
          image: "https://res.cloudinary.com/demo/image/upload/v1631234572/vit_c_serum.jpg",
          images: JSON.stringify([
            "https://res.cloudinary.com/demo/image/upload/v1631234572/vit_c_serum_1.jpg"
          ]),
          stock: 30,
          categoryId: 1,
          brand: "SkinExpert",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Kem dưỡng thể Oải hương",
          description: "Dưỡng ẩm sâu cho làn da mềm mịn cùng hương thơm oải hương thư giãn.",
          usage: "Thoa đều khắp cơ thể sau khi tắm, đặc biệt là vùng da khô.",
          price: 320000,
          discountPrice: null,
          image: "https://res.cloudinary.com/demo/image/upload/v1631234573/lavender_body_lotion.jpg",
          images: null,
          stock: 100,
          categoryId: 2,
          brand: "BeautyCare Natural",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Tinh dầu Sả chanh",
          description: "Tinh dầu nguyên chất giúp xua đuổi côn trùng và tạo cảm giác tươi mới.",
          usage: "Sử dụng với máy xông tinh dầu hoặc pha loãng để massage.",
          price: 150000,
          discountPrice: 120000,
          image: "https://res.cloudinary.com/demo/image/upload/v1631234574/lemongrass_oil.jpg",
          images: null,
          stock: 80,
          categoryId: 4,
          brand: "SpaZen",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any
    );
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Products", {}, {});
  },
};
