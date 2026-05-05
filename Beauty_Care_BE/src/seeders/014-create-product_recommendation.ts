"use strict";
import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    const advices = [
      {
        id: 1,
        title: "Da thường, tương đối khỏe mạnh",
        description: "Làn da của bạn ở trạng thái cân bằng tốt, ít gặp các khuyết điểm lớn. Cần duy trì bảo vệ và cấp ẩm hàng ngày.",
        morning_routine: "Bước 1: Sữa rửa mặt dịu nhẹ.\nBước 2: Toner cấp ẩm.\nBước 3: Serum Vitamin C.\nBước 4: Kem dưỡng ẩm mỏng.\nBước 5: Kem chống nắng.",
        evening_routine: "Bước 1: Tẩy trang.\nBước 2: Sữa rửa mặt.\nBước 3: Serum Hyaluronic Acid.\nBước 4: Kem dưỡng ẩm đêm.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "Da có xu hướng mụn sưng viêm (Acne)",
        description: "Làn da đang gặp tình trạng viêm nhiễm, nốt mụn đỏ. Cần ưu tiên làm sạch và kháng viêm.",
        morning_routine: "Bước 1: Sữa rửa mặt BHA.\nBước 2: Toner làm dịu.\nBước 3: Chấm mụn chuyên biệt.\nBước 4: Kem chống nắng cho da mụn.",
        evening_routine: "Bước 1: Tẩy trang nước.\nBước 2: Sữa rửa mặt.\nBước 3: Serum Niacinamide.\nBước 4: Gel dưỡng mỏng nhẹ.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: "Da mụn đầu đen, sợi bã nhờn",
        description: "Nhiều sợi bã nhờn vùng chữ T. Cần chú trọng kiểm soát bã nhờn và làm sạch sâu.",
        morning_routine: "Bước 1: Sữa rửa mặt làm sạch sâu.\nBước 2: Toner BHA.\nBước 3: Kem chống nắng kiềm dầu.",
        evening_routine: "Bước 1: Dầu tẩy trang.\nBước 2: Sữa rửa mặt tạo bọt.\nBước 3: Mặt nạ đất sét (2 lần/tuần).\nBước 4: Dưỡng ẩm Gel.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: "Da không đều màu, thâm nám",
        description: "Xuất hiện đốm nâu, thâm sau mụn. Cần tập trung làm sáng và chống nắng cực kỹ.",
        morning_routine: "Bước 1: Sữa rửa mặt làm sáng.\nBước 2: Serum Vitamin C.\nBước 3: Kem chống nắng SPF 50+.",
        evening_routine: "Bước 1: Tẩy trang kỹ.\nBước 2: Tẩy da chết AHA (3 lần/tuần).\nBước 3: Serum Alpha Arbutin.\nBước 4: Kem dưỡng khóa ẩm.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: "Da lỗ chân lông to",
        description: "Bề mặt da sần sùi, đổ dầu nhiều. Cần cải thiện cấu trúc da và se khít lỗ chân lông.",
        morning_routine: "Bước 1: Sữa rửa mặt kiềm dầu.\nBước 2: Serum Niacinamide.\nBước 3: Kem chống nắng mịn lì.",
        evening_routine: "Bước 1: Tẩy trang.\nBước 2: BHA làm sạch sâu.\nBước 3: Serum Peptides.\nBước 4: Dưỡng ẩm nhẹ.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        title: "Da có dấu hiệu lão hóa, nếp nhăn",
        description: "Độ đàn hồi giảm, xuất hiện nếp nhăn. Cần cấp ẩm sâu và dùng hoạt chất chống lão hóa.",
        morning_routine: "Bước 1: Sữa rửa mặt giữ ẩm.\nBước 2: Serum Peptides.\nBước 3: Kem chống nắng dưỡng ẩm.",
        evening_routine: "Bước 1: Dầu tẩy trang.\nBước 2: Retinol (bắt đầu nồng độ thấp).\nBước 3: Kem dưỡng mắt.\nBước 4: Kem đêm phục hồi.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        title: "Da khô, bong tróc",
        description: "Da thiếu độ ẩm và dầu tự nhiên, cảm giác căng rát. Cần ưu tiên các sản phẩm cấp ẩm đậm đặc.",
        morning_routine: "Bước 1: Sữa rửa mặt dạng kem.\nBước 2: Toner dưỡng ẩm dày.\nBước 3: Kem dưỡng ẩm giàu dưỡng chất.\nBước 4: Kem chống nắng cấp ẩm.",
        evening_routine: "Bước 1: Tẩy trang dạng sữa.\nBước 2: Serum Hyaluronic Acid tầng sâu.\nBước 3: Kem dưỡng khóa ẩm dạng balm.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        title: "Da dầu mụn, nhạy cảm",
        description: "Bề mặt bóng dầu nhưng dễ kích ứng, đỏ rát. Cần sản phẩm lành tính, không cồn, không hương liệu.",
        morning_routine: "Bước 1: Sữa rửa mặt pH chuẩn.\nBước 2: Toner rau má làm dịu.\nBước 3: Kem chống nắng vật lý cho da nhạy cảm.",
        evening_routine: "Bước 1: Nước tẩy trang Micellar.\nBước 2: Serum B5 phục hồi da.\nBước 3: Kem dưỡng ẩm mỏng nhẹ.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        title: "Da hỗn hợp thiên dầu",
        description: "Dầu nhiều vùng chữ T, khô vùng hai bên má. Cần cân bằng độ ẩm cho từng vùng da khác nhau.",
        morning_routine: "Bước 1: Sữa rửa mặt tạo bọt vừa phải.\nBước 2: Toner cân bằng.\nBước 3: Dưỡng ẩm vùng má, kiềm dầu vùng chữ T.\nBước 4: Kem chống nắng mỏng nhẹ.",
        evening_routine: "Bước 1: Tẩy trang kỹ.\nBước 2: Tẩy da chết nhẹ vùng chữ T.\nBước 3: Serum cấp nước cho toàn mặt.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        title: "Da bị tổn thương sau điều trị",
        description: "Da mỏng yếu do treatment quá đà hoặc sau laser. Cần quy trình tối giản, tập trung phục hồi hàng rào bảo vệ da.",
        morning_routine: "Bước 1: Rửa mặt bằng nước muối sinh lý hoặc SRM cực dịu.\nBước 2: Serum B5/Ceramide.\nBước 3: Kem chống nắng phổ rộng bảo vệ tối đa.",
        evening_routine: "Bước 1: Nước tẩy trang dịu nhẹ.\nBước 2: Serum phục hồi màng bảo vệ da.\nBước 3: Kem dưỡng phục hồi chuyên sâu.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return queryInterface.bulkInsert("ProductRecommendations", advices, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("ProductRecommendations", {}, {});
  }
};