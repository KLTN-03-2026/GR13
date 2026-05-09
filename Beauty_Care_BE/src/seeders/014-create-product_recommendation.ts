"use strict";
import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    const advices = [
      {
        id: 1,
        title: "Làn da khỏe mạnh & Cân bằng",
        description: "Chúc mừng! Các chỉ số da của bạn đang ở trạng thái lý tưởng. Hàng rào bảo vệ da vững chắc và độ ẩm tự nhiên tốt.\n\nHoạt chất khuyên dùng: Hyaluronic Acid, Ceramide, Vitamin C.\nLưu ý: Duy trì thói quen hiện tại, tránh lạm dụng quá nhiều hoạt chất mạnh để bảo vệ sự cân bằng tự nhiên.",
        morning_routine: "• Bước 1: Sữa rửa mặt dịu nhẹ (pH 5.5).\n• Bước 2: Toner cấp ẩm.\n• Bước 3: Serum Vitamin C.\n• Bước 4: Kem dưỡng ẩm mỏng nhẹ.\n• Bước 5: Kem chống nắng phổ rộng.",
        evening_routine: "• Bước 1: Tẩy trang Micellar.\n• Bước 2: Sữa rửa mặt.\n• Bước 3: Serum Hyaluronic Acid.\n• Bước 4: Kem dưỡng ẩm đêm phục hồi.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "Tình trạng mụn sưng viêm (Acne Vulgaris)",
        description: "Chỉ số mụn viêm đang ở mức báo động. Da đang gặp tình trạng viêm nhiễm biểu bì do vi khuẩn hoạt động mạnh.\n\nHoạt chất khuyên dùng: Benzoyl Peroxide, BHA, ZinC, Rau má.\nLưu ý: Tuyệt đối không tự ý nặn mụn. Tránh các sản phẩm chứa dầu và hương liệu mạnh.",
        morning_routine: "• Bước 1: Sữa rửa mặt BHA.\n• Bước 2: Toner làm dịu.\n• Bước 3: Chấm mụn chuyên biệt.\n• Bước 4: Kem chống nắng vật lý.",
        evening_routine: "• Bước 1: Tẩy trang nước.\n• Bước 2: Sữa rửa mặt.\n• Bước 3: Serum Niacinamide.\n• Bước 4: Gel dưỡng ẩm mỏng nhẹ.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 3,
        title: "Mụn đầu đen & Sợi bã nhờn tích tụ",
        description: "Lỗ chân lông vùng chữ T đang bị bít tắc bởi hỗn hợp dầu thừa và tế bào chết bị oxy hóa.\n\nHoạt chất khuyên dùng: Salicylic Acid (BHA), Đất sét Kaolin.\nLưu ý: Tránh lạm dụng miếng dán lột mụn vì sẽ làm lỗ chân lông giãn nở to hơn.",
        morning_routine: "• Bước 1: Sữa rửa mặt tạo bọt.\n• Bước 2: Toner BHA vùng chữ T.\n• Bước 3: Kem chống nắng kiềm dầu.",
        evening_routine: "• Bước 1: Dầu tẩy trang (Massage kỹ 2 phút).\n• Bước 2: Sữa rửa mặt.\n• Bước 3: Mặt nạ đất sét (2 lần/tuần).\n• Bước 4: Serum cấp nước.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 4,
        title: "Tăng sắc tố & Da không đều màu",
        description: "Chỉ số thâm nám cao cho thấy sự hoạt động quá mức của hắc sắc tố Melanin do tác hại từ tia UV.\n\nHoạt chất khuyên dùng: Alpha Arbutin, Tranexamic Acid, Vitamin C, AHA.\nLưu ý: Chống nắng là chìa khóa. Nếu không bảo vệ kỹ, các vết thâm sẽ đậm màu và khó điều trị hơn.",
        morning_routine: "• Bước 1: Sữa rửa mặt làm sáng.\n• Bước 2: Serum Vitamin C.\n• Bước 3: Kem chống nắng SPF 50+.",
        evening_routine: "• Bước 1: Tẩy trang kỹ.\n• Bước 2: Tẩy da chết AHA (3 lần/tuần).\n• Bước 3: Serum Alpha Arbutin.\n• Bước 4: Kem dưỡng khóa ẩm.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 5,
        title: "Lỗ chân lông giãn nở & Kết cấu sần sùi",
        description: "Bề mặt da thô ráp, lỗ chân lông to do tuyến dầu hoạt động quá mức hoặc cấu trúc Collagen quanh thành chân lông suy yếu.\n\nHoạt chất khuyên dùng: Niacinamide (10-20%), Peptides, BHA.\nLưu ý: Giữ da đủ ẩm để tuyến dầu không hoạt động bù gây giãn nở chân lông.",
        morning_routine: "• Bước 1: Sữa rửa mặt kiềm dầu.\n• Bước 2: Serum Niacinamide.\n• Bước 3: Kem chống nắng mịn lì.",
        evening_routine: "• Bước 1: Double Cleansing.\n• Bước 2: BHA làm sạch sâu.\n• Bước 3: Serum Peptides.\n• Bước 4: Dưỡng ẩm nhẹ.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 6,
        title: "Lão hóa sớm & Nếp nhăn biểu bì",
        description: "Dấu hiệu sụt giảm Collagen rõ rệt. Da xuất hiện các rãnh nhăn, độ đàn hồi kém ở vùng mắt và khóe miệng.\n\nHoạt chất khuyên dùng: Retinol, Peptides, Adenosine.\nLưu ý: Phụ nữ có thai không sử dụng Retinol. Phải chống nắng cực kỹ vì da sẽ nhạy cảm hơn.",
        morning_routine: "• Bước 1: Sữa rửa mặt giữ ẩm.\n• Bước 2: Serum Peptides.\n• Bước 3: Kem chống nắng dưỡng ẩm.",
        evening_routine: "• Bước 1: Dầu tẩy trang.\n• Bước 2: Retinol (bắt đầu nồng độ thấp).\n• Bước 3: Kem dưỡng mắt.\n• Bước 4: Kem đêm phục hồi.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 7,
        title: "Da khô thiếu hụt Lipid & Bong tróc",
        description: "Hàng rào bảo vệ da đang thiếu dầu tự nhiên, gây biểu hiện căng rát, vảy bong tróc li ti.\n\nHoạt chất khuyên dùng: Ceramide, Vitamin E, Squalane.\nLưu ý: Hạn chế rửa mặt bằng nước nóng. Tránh các sản phẩm chứa cồn khô.",
        morning_routine: "• Bước 1: Sữa rửa mặt dạng kem.\n• Bước 2: Toner dưỡng ẩm dày.\n• Bước 3: Serum cấp ẩm.\n• Bước 4: Kem chống nắng cấp ẩm.",
        evening_routine: "• Bước 1: Tẩy trang dạng sữa.\n• Bước 2: Serum phục hồi màng Lipid.\n• Bước 3: Kem dưỡng khóa ẩm dạng Balm.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 8,
        title: "Da dầu mụn nhạy cảm",
        description: "Bề mặt đổ dầu nhiều nhưng da lại cực kỳ dễ kích ứng, đỏ rát. Hàng rào bảo vệ da đang suy yếu.\n\nHoạt chất khuyên dùng: Panthenol (B5), Madecassoside, Allantoin.\nLưu ý: Tối giản quy trình (Skincare Minimalism). Không dùng treatment mạnh lúc này.",
        morning_routine: "• Bước 1: Sữa rửa mặt pH 5.5.\n• Bước 2: Toner rau má.\n• Bước 3: Kem chống nắng vật lý.",
        evening_routine: "• Bước 1: Nước tẩy trang Micellar.\n• Bước 2: Serum B5 phục hồi.\n• Bước 3: Kem dưỡng ẩm mỏng nhẹ.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 9,
        title: "Da hỗn hợp thiên dầu",
        description: "Mất cân bằng độ ẩm cục bộ: đổ dầu nhiều vùng chữ T nhưng lại khô hoặc bình thường ở hai bên má.\n\nHoạt chất khuyên dùng: Niacinamide, Hyaluronic Acid.\nLưu ý: Nên sử dụng kỹ thuật đắp mặt nạ khác nhau cho từng vùng da.",
        morning_routine: "• Bước 1: Sữa rửa mặt dạng Gel.\n• Bước 2: Toner cân bằng.\n• Bước 3: Kem dưỡng kiềm dầu chữ T.\n• Bước 4: Kem chống nắng mỏng nhẹ.",
        evening_routine: "• Bước 1: Tẩy trang kỹ.\n• Bước 2: Tẩy da chết nhẹ vùng chữ T.\n• Bước 3: Serum cấp nước toàn mặt.",
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        id: 10,
        title: "Da tổn thương nghiêm trọng & Mỏng yếu",
        description: "Cảnh báo: Hàng rào bảo vệ đã bị phá hủy. Da lộ mạch máu, đỏ rát và mất khả năng tự bảo vệ.\n\nHoạt chất khuyên dùng: EGF, Ceramide, Rau má, Peptide phục hồi.\nLưu ý: Ngưng toàn bộ đặc trị. Nên đến gặp bác sĩ da liễu nếu tình trạng kéo dài.",
        morning_routine: "• Bước 1: Sữa rửa mặt phục hồi cực dịu.\n• Bước 2: Serum phục hồi B5/Ceramide.\n• Bước 3: Kem chống nắng phổ rộng bảo vệ tối đa.",
        evening_routine: "• Bước 1: Tẩy trang dịu nhẹ.\n• Bước 2: Tinh chất phục hồi màng bảo vệ.\n• Bước 3: Kem dưỡng phục hồi chuyên sâu.",
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