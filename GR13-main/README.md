# Xây dựng nền tảng BeautyCare - Ứng dụng trí tuệ nhân tạo cho phân tích da và Recommendation sản phẩm

> _"Nền tảng BeautyCare ứng dụng AI để phân tích da và đề xuất sản phẩm phù hợp theo từng người dùng"_

Beauty Care là dự án fullstack gồm **Frontend (React + Vite)** và **Backend (Node.js + Express + Sequelize + MySQL)**, hỗ trợ đồng thời:

- Website client cho người dùng cuối (xem sản phẩm, trải nghiệm giao diện dịch vụ)
- Dashboard quản trị (quản lý sản phẩm, danh mục, bài viết, người dùng, đơn hàng, booking, báo cáo)
- API chuẩn REST phục vụ xác thực, phân quyền và các nghiệp vụ cốt lõi

---

## 🧭 Tổng quan dự án

Trong bối cảnh ngành làm đẹp tăng trưởng nhanh, các spa/cửa hàng mỹ phẩm thường gặp bài toán:

- Dữ liệu sản phẩm, đơn hàng, người dùng phân tán
- Khó theo dõi hiệu suất bán hàng và vận hành
- Thiếu công cụ quản trị tập trung cho nhiều nhóm vai trò
- Quản lý nội dung blog và trải nghiệm khách hàng chưa đồng bộ

**Beauty Care** được xây dựng để giải quyết các vấn đề trên bằng một hệ thống quản trị tập trung, dễ mở rộng và có API rõ ràng.

---

## 🎯 Mục tiêu chính

- Chuẩn hóa quy trình quản lý sản phẩm, danh mục, đơn hàng, booking
- Tập trung quản trị người dùng theo vai trò nghiệp vụ (`Khách vãng lai`, `Khách hàng`, `Chuyên gia`, `Admin`)
- Cung cấp nền tảng API backend ổn định để FE và các dịch vụ khác có thể tích hợp
- Tăng khả năng theo dõi dữ liệu vận hành thông qua dashboard và thống kê

---

## 👥 Nhóm người dùng và vai trò

### 1. Khách vãng lai

- Đăng ký, đăng nhập tài khoản
- Tìm kiếm và xem thông tin cơ bản về sản phẩm/tin tức
- Trải nghiệm thử nghiệm AI ở mức cơ bản (không yêu cầu hồ sơ đầy đủ)

### 2. Khách hàng

- Quản lý hồ sơ cá nhân
- Soi da AI và nhận gợi ý sản phẩm từ AI
- Quản lý giỏ hàng, thanh toán, theo dõi nhật ký làn da
- Đánh giá/bình luận sau khi trải nghiệm sản phẩm hoặc dịch vụ

### 3. Chuyên gia

- Tư vấn và giải đáp thắc mắc cho khách hàng
- Phê duyệt/kiểm duyệt các đánh giá hoặc nội dung liên quan chuyên môn
- Viết bài tin tức/chia sẻ kiến thức chăm sóc da

### 4. Admin

- Quản lý tài khoản và phân quyền
- Quản lý kho hàng, đơn hàng, khuyến mãi, bài đăng tin tức
- Quản lý báo cáo và tối ưu mô hình AI
- Theo dõi toàn bộ dashboard vận hành hệ thống

---

## 📌 Chức năng chính hiện có

### Client

- Trang chủ giới thiệu dịch vụ làm đẹp
- Trang danh sách sản phẩm với lọc/tìm kiếm/sắp xếp
- Giao diện responsive, dùng Ant Design + SCSS

### Admin Dashboard

- Overview: thống kê tổng quan, biểu đồ doanh thu/cơ cấu
- Product Management
- Category Management
- Order Management / Order Success
- Booking Management
- Blog Management / Blog Category Management
- User Management (Admin/Staff/Customer)
- Review Management
- Revenue / Analytics / Settings / Help / Profile


## 🗂️ Cấu trúc thư mục

```txt
DATN_Nhom13/
├── Beauty_Care_BE/                 # Backend (Node.js + Express Sequelize + MySQL)
├── Beauty_Care_FE/                 # Frontend (React + Vite + TS)    
│
└── README.md
```

---



## 🚀 Hướng phát triển tiếp theo

- Hoàn thiện luồng người dùng end-to-end (auth + giỏ hàng + thanh toán)
- Kết nối dữ liệu thật cho toàn bộ biểu đồ dashboard (thay mock data)
- Bổ sung unit/integration tests cho API và UI
- Bổ sung Docker Compose để chuẩn hóa môi trường chạy
- Tăng cường CI/CD và quality gates (lint, test, build)

---
