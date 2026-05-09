"use strict";

import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert("Products", [
      {
        id: 1,
        name: "Nước Tẩy Trang Bioderma Sensibio H2O",
        description: "Nước tẩy trang số 1 toàn cầu, làm sạch sâu, loại bỏ lớp trang điểm, bụi bẩn mà không gây kích ứng.",
        usage: "Thấm nước tẩy trang vào bông cotton, lau nhẹ nhàng toàn bộ khuôn mặt. Không cần rửa lại với nước.",
        price: 495000,
        discountPrice: 420000,
        image: "https://file.hstatic.net/1000025647/file/nuoc_tay_trang_bioderma_sensibio_h2o_500ml_133497c8c1fa4e1f96643ce252fe0ae6_1024x1024.jpg",
        images: JSON.stringify([
          "https://file.hstatic.net/1000025647/file/nuoc_tay_trang_bioderma_sensibio_h2o_500ml_133497c8c1fa4e1f96643ce252fe0ae6_1024x1024.jpg",
          "https://file.hstatic.net/1000025647/file/nuoc_tay_trang_bioderma_sensibio_h2o_500ml_133497c8c1fa4e1f96643ce252fe0ae6_1024x1024.jpg"
        ]),
        stock: 200,
        categoryId: 2,
        brand: "Bioderma",
        status: "active",
        advice_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Sữa Rửa Mặt CeraVe Hydrating Facial Cleanser",
        description: "Sữa rửa mặt CeraVe chuyên dành cho da khô và nhạy cảm, giúp làm sạch nhẹ nhàng và cấp ẩm sâu với Hyaluronic Acid và 3 loại Ceramide thiết yếu.",
        usage: "Làm ướt mặt, lấy một lượng vừa đủ tạo bọt và massage nhẹ nhàng. Sau đó rửa sạch lại với nước. Sử dụng sáng và tối.",
        price: 350000,
        discountPrice: 295000,
        image: "https://mint07.com/wp-content/uploads/2020/04/sua-rua-mat-cerave-hydrating-cleanser-236ml.jpg",
        images: JSON.stringify([
          "https://mint07.com/wp-content/uploads/2020/04/sua-rua-mat-cerave-hydrating-cleanser-236ml.jpg"
        ]),
        stock: 120,
        categoryId: 1,
        brand: "Cerave",
        status: "active",
        advice_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Serum Phục Hồi Da La Roche-Posay Hyalu B5",
        description: "Tinh chất phục hồi da chuyên sâu, giúp cấp ẩm, làm mờ nếp nhăn và tái tạo hàng rào bảo vệ da mạnh mẽ. Phù hợp cho da nhạy cảm sau mụn.",
        usage: "Sử dụng 3-4 giọt thoa đều lên toàn mặt sau bước làm sạch và dùng toner. Massage nhẹ nhàng để tinh chất thấm sâu.",
        price: 980000,
        discountPrice: 750000,
        image: "https://edbeauty.vn/wp-content/uploads/2024/09/Serum-phuc-hoi-hang-rao-bao-ve-da-La-Roche-Posay-Serum-Hyalu-B5.jpg",
        images: JSON.stringify([
          "https://edbeauty.vn/wp-content/uploads/2024/09/Serum-phuc-hoi-hang-rao-bao-ve-da-La-Roche-Posay-Serum-Hyalu-B5.jpg",
          "https://edbeauty.vn/wp-content/uploads/2024/09/Serum-phuc-hoi-hang-rao-bao-ve-da-La-Roche-Posay-Serum-Hyalu-B5.jpg"
        ]),
        stock: 50,
        categoryId: 4,
        brand: "La Roche-Posay",
        status: "active",
        advice_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: "Kem Chống Nắng Anessa Perfect UV Sunscreen",
        description: "Sữa chống nắng quốc dân bảo vệ da tối đa với công nghệ Auto Booster, chống nước, chống mồ hôi hoàn hảo, thích hợp hoạt động ngoài trời.",
        usage: "Lắc đều trước khi sử dụng. Lấy một lượng vừa đủ thoa đều lên mặt và cổ trước khi ra nắng 20 phút.",
        price: 685000,
        discountPrice: 520000,
        image: "https://product.hstatic.net/1000360941/product/chong-nang-anessa-da-dau_26471733e85c4b89a79a53b5b695f2d6_master.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000360941/product/chong-nang-anessa-da-dau_26471733e85c4b89a79a53b5b695f2d6_master.jpg"
        ]),
        stock: 300,
        categoryId: 6,
        brand: "Anessa",
        status: "active",
        advice_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: "Tinh chất tẩy tế bào chết hóa học Paula's Choice 2% BHA",
        description: "Sản phẩm tẩy da chết hóa học nổi tiếng giúp làm sạch sâu lỗ chân lông, đẩy lùi mụn ẩn, mụn đầu đen và cải thiện cấu trúc da hiệu quả.",
        usage: "Dùng 1-2 lần/ngày sau bước sữa rửa mặt và toner. Dùng bông tẩy trang thoa đều hoặc đổ ra tay vỗ nhẹ.",
        price: 950000,
        discountPrice: 850000,
        image: "https://product.hstatic.net/1000360941/product/bha_paulas_choice_118_ml_09036dc8dbf04686ad62976449d0346f_master.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000360941/product/bha_paulas_choice_118_ml_09036dc8dbf04686ad62976449d0346f_master.jpg"
        ]),
        stock: 85,
        categoryId: 8,
        brand: "Paula's Choice",
        status: "active",
        advice_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: "Sữa rửa mặt tạo bọt Senka Perfect Whip",
        description: "Sản phẩm Sữa rửa mặt tạo bọt chính hãng từ thương hiệu Senka. Cung cấp giải pháp tối ưu cho da nhạy cảm.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 990000,
        discountPrice: 594000,
        image: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P09483_1.jpg",
        images: JSON.stringify([
          "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P09483_1.jpg"
        ]),
        stock: 147,
        categoryId: 1,
        brand: "Senka",
        status: "active",
        advice_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: "Sữa chống nắng Vichy kiềm dầu",
        description: "Sản phẩm Sữa chống nắng chính hãng từ thương hiệu Vichy. Cung cấp giải pháp tối ưu cho da mụn.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 620000,
        discountPrice: 558000,
        image: "https://product.hstatic.net/1000006063/product/6aaf63cfa8b1_1024x1024_6e4ce00ba2fe48bdaa74de3ce957d2ff_1024x1024_copy_0836853d1b6249618c7c5a461b199abc_1024x1024.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000006063/product/6aaf63cfa8b1_1024x1024_6e4ce00ba2fe48bdaa74de3ce957d2ff_1024x1024_copy_0836853d1b6249618c7c5a461b199abc_1024x1024.jpg"
        ]),
        stock: 153,
        categoryId: 6,
        brand: "Vichy",
        status: "active",
        advice_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: "Toner cấp ẩm Hada Labo dưỡng sáng da",
        description: "Sản phẩm Toner cấp ẩm chính hãng từ thương hiệu Hada Labo. Cung cấp giải pháp tối ưu dưỡng sáng da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 590000,
        discountPrice: null,
        image: "https://product.hstatic.net/1000006063/product/4_35cc23c689ee4e84a2d58a166b0a7b47_1024x1024.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000006063/product/4_35cc23c689ee4e84a2d58a166b0a7b47_1024x1024.jpg"
        ]),
        stock: 67,
        categoryId: 3,
        brand: "Hada Labo",
        status: "active",
        advice_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: "Dầu tẩy trang Eucerin cho da mụn",
        description: "Sản phẩm Dầu tẩy trang chính hãng từ thương hiệu Eucerin. Cung cấp giải pháp tối ưu cho da mụn.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1330000,
        discountPrice: 1197000,
        image: "https://image.hsv-tech.io/1987x0/bbx/8850029022536-1front_1a3de72d4b5d4c9d807b71273d700a2a.png",
        images: JSON.stringify([
          "https://image.hsv-tech.io/1987x0/bbx/8850029022536-1front_1a3de72d4b5d4c9d807b71273d700a2a.png"
        ]),
        stock: 122,
        categoryId: 2,
        brand: "Eucerin",
        status: "active",
        advice_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: "Tinh chất phục hồi COSRX chống lão hóa",
        description: "Sản phẩm Tinh chất phục hồi chính hãng từ thương hiệu COSRX. Cung cấp giải pháp tối ưu chống lão hóa.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 890000,
        discountPrice: 712000,
        image: "https://product.hstatic.net/1000328823/product/_jukabeautyshop__7__52f286e2fa604d929884fe9130513447_master.png",
        images: JSON.stringify([
          "https://product.hstatic.net/1000328823/product/_jukabeautyshop__7__52f286e2fa604d929884fe9130513447_master.png"
        ]),
        stock: 35,
        categoryId: 4,
        brand: "COSRX",
        status: "active",
        advice_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: "Sữa rửa mặt dịu nhẹ Cetaphil",
        description: "Sản phẩm Sữa rửa mặt dịu nhẹ chính hãng từ thương hiệu Cetaphil. Cung cấp giải pháp tối ưu cho da nhạy cảm.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1060000,
        discountPrice: 848000,
        image: "https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/u/sua-rua-mat-cetaphil-diu-nhe-khong-xa-phong-moi-3_7e864003c68b42ecb1b42088894cf086_zlktadjrdoqhjwme.jpg",
        images: JSON.stringify([
          "https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/u/sua-rua-mat-cetaphil-diu-nhe-khong-xa-phong-moi-3_7e864003c68b42ecb1b42088894cf086_zlktadjrdoqhjwme.jpg"
        ]),
        stock: 35,
        categoryId: 1,
        brand: "Cetaphil",
        status: "active",
        advice_id: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: "Gel dưỡng ẩm Laneige cấp nước",
        description: "Sản phẩm Gel dưỡng ẩm chính hãng từ thương hiệu Laneige. Cung cấp giải pháp tối ưu dành cho mọi loại da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 520000,
        discountPrice: 416000,
        image: "https://media.hcdn.vn/catalog/product/k/e/kem-duong-am-laneige-cap-nuoc-cho-da-dau-da-hon-hop-50ml-01.jpg",
        images: JSON.stringify([
          "https://media.hcdn.vn/catalog/product/k/e/kem-duong-am-laneige-cap-nuoc-cho-da-dau-da-hon-hop-50ml-01.jpg"
        ]),
        stock: 129,
        categoryId: 5,
        brand: "Laneige",
        status: "active",
        advice_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        name: "Khăn tẩy trang Simple làm sạch sâu",
        description: "Sản phẩm Khăn tẩy trang chính hãng từ thương hiệu Simple. Cung cấp giải pháp tối ưu se khít lỗ chân lông.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1470000,
        discountPrice: null,
        image: "https://mint07.com/wp-content/uploads/2016/06/simple-cleansing-wipes-2.jpg",
        images: JSON.stringify([
          "https://mint07.com/wp-content/uploads/2016/06/simple-cleansing-wipes-2.jpg"
        ]),
        stock: 28,
        categoryId: 2,
        brand: "Simple",
        status: "active",
        advice_id: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        name: "Mặt nạ ngủ cấp nước Innisfree",
        description: "Sản phẩm Mặt nạ ngủ cấp nước chính hãng từ thương hiệu Innisfree. Cung cấp giải pháp tối ưu cho da khô.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1210000,
        discountPrice: null,
        image: "https://file.hstatic.net/1000301613/file/mat-na-innisfree-green-tea-sleeping-mask-1_c6530871876b43ff830f34044d92bac1.jpg",
        images: JSON.stringify([
          "https://file.hstatic.net/1000301613/file/mat-na-innisfree-green-tea-sleeping-mask-1_c6530871876b43ff830f34044d92bac1.jpg"
        ]),
        stock: 142,
        categoryId: 7,
        brand: "Innisfree",
        status: "active",
        advice_id: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        name: "Kem dưỡng ẩm L'Oreal phục hồi da",
        description: "Sản phẩm Kem dưỡng ẩm chính hãng từ thương hiệu L'Oreal. Cung cấp giải pháp tối ưu phục hồi da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 640000,
        discountPrice: 448000,
        image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/353/847/products/ava-san-pham-tren-website-17-53801a0f-c4e2-44e0-9cd6-06095f41d527.jpg?v=1751345924640",
        images: JSON.stringify([
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/353/847/products/ava-san-pham-tren-website-17-53801a0f-c4e2-44e0-9cd6-06095f41d527.jpg?v=1751345924640"
        ]),
        stock: 110,
        categoryId: 5,
        brand: "L'Oreal",
        status: "active",
        advice_id: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        name: "Nước tẩy trang làm sạch Garnier",
        description: "Sản phẩm Nước tẩy trang làm sạch chính hãng từ thương hiệu Garnier. Cung cấp giải pháp tối ưu dành cho mọi loại da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 210000,
        discountPrice: null,
        image: "https://file.hstatic.net/1000006063/file/0b36bfc1f79e52b3de2cb3152432a245_quot_83ea30a780df4df796bff78e6da352c4_master.jpg",
        images: JSON.stringify([
          "https://file.hstatic.net/1000006063/file/0b36bfc1f79e52b3de2cb3152432a245_quot_83ea30a780df4df796bff78e6da352c4_master.jpg"
        ]),
        stock: 13,
        categoryId: 2,
        brand: "Garnier",
        status: "active",
        advice_id: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        name: "Serum Vitamin C Klairs",
        description: "Sản phẩm Serum Vitamin C chính hãng từ thương hiệu Klairs. Cung cấp giải pháp tối ưu dưỡng sáng da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 490000,
        discountPrice: null,
        image: "https://product.hstatic.net/1000006063/product/6316ef9472379add7ce9062ee8376c09_a80562e35b4740378f712f713d8fe789_1024x1024.jpeg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000006063/product/6316ef9472379add7ce9062ee8376c09_a80562e35b4740378f712f713d8fe789_1024x1024.jpeg"
        ]),
        stock: 45,
        categoryId: 4,
        brand: "Klairs",
        status: "active",
        advice_id: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        name: "Toner làm dịu da Some By Mi",
        description: "Sản phẩm Toner làm dịu da chính hãng từ thương hiệu Some By Mi. Cung cấp giải pháp tối ưu kiềm dầu.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1360000,
        discountPrice: 1088000,
        image: "https://product.hstatic.net/1000006063/product/some_by_mi__new__copy_5757e960035d492ebe4b478277bd82f5_1024x1024.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000006063/product/some_by_mi__new__copy_5757e960035d492ebe4b478277bd82f5_1024x1024.jpg"
        ]),
        stock: 147,
        categoryId: 3,
        brand: "Some By Mi",
        status: "active",
        advice_id: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 19,
        name: "Kem chống nắng Naruko",
        description: "Sản phẩm Kem chống nắng chính hãng từ thương hiệu Naruko. Cung cấp giải pháp tối ưu cho da mụn.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 260000,
        discountPrice: null,
        image: "https://media.hcdn.vn/wysiwyg/HaNguyen/kem-chong-nang-naruko-tram-tra-ngan-ngua-mun-30ml-moi-1.jpg",
        images: JSON.stringify([
          "https://media.hcdn.vn/wysiwyg/HaNguyen/kem-chong-nang-naruko-tram-tra-ngan-ngua-mun-30ml-moi-1.jpg"
        ]),
        stock: 121,
        categoryId: 6,
        brand: "Naruko",
        status: "active",
        advice_id: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        name: "Tẩy da chết vật lý Kiehl's",
        description: "Sản phẩm Tẩy da chết vật lý chính hãng từ thương hiệu Kiehl's. Cung cấp giải pháp tối ưu chống lão hóa.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1250000,
        discountPrice: 875000,
        image: "https://www.kiehls.com.vn/on/demandware.static/-/Sites-kiehls-vn-ng-Library/vi_VN/dw1f592c81/images/optimize/Tos_Team/tay-te-bao-chet/tay-te-bao-chet-newwwwwww-6.jpg",
        images: JSON.stringify([
          "https://www.kiehls.com.vn/on/demandware.static/-/Sites-kiehls-vn-ng-Library/vi_VN/dw1f592c81/images/optimize/Tos_Team/tay-te-bao-chet/tay-te-bao-chet-newwwwwww-6.jpg"
        ]),
        stock: 151,
        categoryId: 8,
        brand: "Kiehl's",
        status: "active",
        advice_id: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        name: "Kem chống nắng quang phổ rộng Anessa",
        description: "Sản phẩm Kem chống nắng quang phổ rộng chính hãng từ thương hiệu Anessa. Cung cấp giải pháp tối ưu cho da nhạy cảm.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 380000,
        discountPrice: 342000,
        image: "https://bizweb.dktcdn.net/100/348/157/files/286670077-2025132441005775-5325443303539287234-n-b0706e14-4427-4206-abae-da8aa086f9a2.jpg?v=1671074324903",
        images: JSON.stringify([
          "https://bizweb.dktcdn.net/100/348/157/files/286670077-2025132441005775-5325443303539287234-n-b0706e14-4427-4206-abae-da8aa086f9a2.jpg?v=1671074324903"
        ]),
        stock: 124,
        categoryId: 6,
        brand: "Anessa",
        status: "active",
        advice_id: 21,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        name: "Tẩy da chết hóa học Paula's Choice",
        description: "Sản phẩm Tẩy da chết hóa học chính hãng từ thương hiệu Paula's Choice. Cung cấp giải pháp tối ưu kiềm dầu.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1390000,
        discountPrice: null,
        image: "https://product.hstatic.net/1000360941/product/bha_paulas_choice_118_ml_09036dc8dbf04686ad62976449d0346f_master.jpg",
        images: JSON.stringify([
          "https://product.hstatic.net/1000360941/product/bha_paulas_choice_118_ml_09036dc8dbf04686ad62976449d0346f_master.jpg"
        ]),
        stock: 104,
        categoryId: 8,
        brand: "Paula's Choice",
        status: "active",
        advice_id: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 23,
        name: "Gel rửa mặt tạo bọt Bioderma",
        description: "Sản phẩm Gel rửa mặt tạo bọt chính hãng từ thương hiệu Bioderma. Cung cấp giải pháp tối ưu cho da nhạy cảm.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả làm sạch.",
        price: 660000,
        discountPrice: 528000,
        image: "https://file.hstatic.net/200000135107/file/bioderma_sensibio_gel_moussant1__1__1fc2a1864cf341b1bca602e4ad9f4a17_grande.jpg",
        images: JSON.stringify([
          "https://file.hstatic.net/200000135107/file/bioderma_sensibio_gel_moussant1__1__1fc2a1864cf341b1bca602e4ad9f4a17_grande.jpg"
        ]),
        stock: 58,
        categoryId: 7,
        brand: "Bioderma",
        status: "active",
        advice_id: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 24,
        name: "Kem phục hồi da La Roche-Posay",
        description: "Sản phẩm Kem phục hồi da chính hãng từ thương hiệu La Roche-Posay. Cung cấp giải pháp tối ưu phục hồi da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 720000,
        discountPrice: 648000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDZYgkjuEI7S4zuWYy4_MiTnuluKlyGhGyow&s",
        images: JSON.stringify([
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDZYgkjuEI7S4zuWYy4_MiTnuluKlyGhGyow&s "
        ]),
        stock: 35,
        categoryId: 5,
        brand: "La Roche-Posay",
        status: "active",
        advice_id: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 25,
        name: "Nước tẩy trang L'Oreal",
        description: "Sản phẩm Nước tẩy trang chính hãng từ thương hiệu L'Oreal. Cung cấp giải pháp tối ưu dưỡng sáng da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1440000,
        discountPrice: 1008000,
        image: "https://cdn.tgdd.vn/Products/Images/3708/216974/bhx/nuoc-tay-trang-3-in-1-loreal-micellar-lam-sach-sau-chai-400ml-202407290956068071.jpg",
        images: JSON.stringify([
          "https://cdn.tgdd.vn/Products/Images/3708/216974/bhx/nuoc-tay-trang-3-in-1-loreal-micellar-lam-sach-sau-chai-400ml-202407290956068071.jpg"
        ]),
        stock: 153,
        categoryId: 2,
        brand: "L'Oreal",
        status: "active",
        advice_id: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 26,
        name: "Sữa rửa mặt dịu nhẹ Vichy",
        description: "Sản phẩm Sữa rửa mặt dịu nhẹ chính hãng từ thương hiệu Vichy. Cung cấp giải pháp tối ưu cho da mụn.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1250000,
        discountPrice: 875000,
        image: "https://lipstick.vn/wp-content/uploads/2019/06/sua-rua-mat-vichy-normaderm-anti-imperfection.png",
        images: JSON.stringify([
          "https://lipstick.vn/wp-content/uploads/2019/06/sua-rua-mat-vichy-normaderm-anti-imperfection.png"
        ]),
        stock: 112,
        categoryId: 1,
        brand: "Vichy",
        status: "active",
        advice_id: 26,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 27,
        name: "Nước hoa hồng Cerave",
        description: "Sản phẩm Nước hoa hồng chính hãng từ thương hiệu Cerave. Cung cấp giải pháp tối ưu phục hồi da.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 450000,
        discountPrice: null,
        image: "https://bizweb.dktcdn.net/thumb/grande/100/407/286/products/371-75463783-3aee-4d62-8cdc-bbe04e062cbb.jpg?v=1668757789243",
        images: JSON.stringify([
          "https://bizweb.dktcdn.net/thumb/grande/100/407/286/products/371-75463783-3aee-4d62-8cdc-bbe04e062cbb.jpg?v=1668757789243"
        ]),
        stock: 147,
        categoryId: 3,
        brand: "Cerave",
        status: "active",
        advice_id: 27,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 28,
        name: "Mặt nạ đất sét giảm mụn Innisfree",
        description: "Sản phẩm Mặt nạ đất sét giảm mụn chính hãng từ thương hiệu Innisfree. Cung cấp giải pháp tối ưu se khít lỗ chân lông.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 1470000,
        discountPrice: null,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgZkzP_lF3ir_o-XfOo4gsnun2Qo01piH7Ag&s",
        images: JSON.stringify([
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgZkzP_lF3ir_o-XfOo4gsnun2Qo01piH7Ag&s"
        ]),
        stock: 121,
        categoryId: 7,
        brand: "Innisfree",
        status: "active",
        advice_id: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 29,
        name: "Serum trị mụn Eucerin",
        description: "Sản phẩm Serum trị mụn chính hãng từ thương hiệu Eucerin. Cung cấp giải pháp tối ưu cho da mụn.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 930000,
        discountPrice: null,
        image: "https://bizweb.dktcdn.net/thumb/grande/100/194/749/products/eucerin-dermopurifyer-post-acne-marks-triple-effect-serum-40ml-jpeg.jpg?v=1747814108980",
        images: JSON.stringify([
          "https://bizweb.dktcdn.net/thumb/grande/100/194/749/products/eucerin-dermopurifyer-post-acne-marks-triple-effect-serum-40ml-jpeg.jpg?v=1747814108980"
        ]),
        stock: 58,
        categoryId: 4,
        brand: "Eucerin",
        status: "active",
        advice_id: 29,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 30,
        name: "Toner cấp ẩm Hada Labo",
        description: "Sản phẩm Toner cấp ẩm chính hãng từ thương hiệu Hada Labo. Cung cấp giải pháp tối ưu cho da khô.",
        usage: "Làm sạch da mặt, lấy lượng vừa đủ thoa đều lên bề mặt da. Sử dụng đều đặn để phát huy tối đa hiệu quả dưỡng da.",
        price: 120000,
        discountPrice: 84000,
        image: "https://media.hcdn.vn/wysiwyg/kimhuy/dung-dich-duong-am-toi-uu-hada-labo-170ml-1.jpg",
        images: JSON.stringify([
          "https://media.hcdn.vn/wysiwyg/kimhuy/dung-dich-duong-am-toi-uu-hada-labo-170ml-1.jpg"
        ]),
        stock: 87,
        categoryId: 3,
        brand: "Hada Labo",
        status: "active",
        advice_id: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("Products", null, {});
  }
};
