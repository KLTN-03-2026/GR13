import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as orderApi from "../../../api/order";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./style.scss";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const { data: ordersResp, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
  });
  const orders: any[] = ordersResp?.data ?? [];

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    const s = status.toLowerCase();
    switch (s) {
      case "paid":
        return "Đã Thanh Toán";
      case "pending":
        return "Chờ Xử Lý";
      case "refunded":
        return "Đã Hoàn Tiền";
      case "shipping":
        return "Đang Vận Chuyển";
      case "delivered":
      case "completed":
        return "Đã Hoàn Thành";
      case "processing":
        return "Đang Xử Lý";
      case "cancelled":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  return (
    <div className="orderPage">
      <div className="container">
        {/* BREADCRUMB */}
        <nav className="breadcrumb">
          <span onClick={() => navigate("/")}>TRANG CHỦ</span>
          <RightOutlined />
          <span onClick={() => navigate("/profile")}>TÀI KHOẢN</span>
          <RightOutlined />
          <span className="current">ĐƠN HÀNG</span>
        </nav>

        {/* HEADER */}
        <header className="header">
          <div className="titleContent">
            <button className="backBtn" onClick={() => navigate("/profile")}>
              <ArrowLeftOutlined /> Quay lại hồ sơ
            </button>
            <h1>Lịch Sử Đơn Hàng</h1>
            <p>Theo dõi và quản lý các giao dịch làm đẹp sang trọng của bạn.</p>
          </div>
          <div className="headerActions">
            <button className="outlineBtn">
              <DownloadOutlined /> Xuất CSV
            </button>
            <button className="primaryBtn">
              <ShoppingOutlined /> Mua lại sản phẩm
            </button>
          </div>
        </header>

        {/* TABS FILTER */}
        <div className="tabs">
          {["All", "Processing", "Delivered", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "activeTab" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "All" ? "Tất Cả Đơn Hàng" : getStatusLabel(tab)}
            </button>
          ))}
        </div>
{/* TABLE */}
        <div className="tableWrapper">
          <table className="table">
            <thead>
              <tr>
                <th>MÃ ĐƠN HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>THANH TOÁN</th>
                <th>VẬN CHUYỂN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>Đang tải đơn hàng...</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="orderId">{`#${order.id}`}</td>
                    <td className="date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="price">
                      {formatVND(Number(order.totalAmount || 0))}
                    </td>
                    <td>
                      <span
                        className={`badge ${order.status?.toLowerCase() || ""}`}
                      >
                        {getStatusLabel(order.status || order.payStatus || "")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`statusText ${(order.status || "").toLowerCase()}`}
                      >
                        <span className="dot">●</span>{" "}
                        {getStatusLabel(order.status || "")}
                      </span>
                    </td>
                    <td className="actionCell">
                      <button
                        className="detailsLink"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        XEM CHI TIẾT
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SUPPORT BANNER */}
        <div className="contactBanner">
          <div className="contactContent">
            <div className="iconBox">
              <CustomerServiceOutlined />
            </div>
            <div className="text">
              <h3>Bạn cần hỗ trợ về đơn hàng?</h3>
              <p>
                Đội ngũ chuyên viên BeautyCare luôn sẵn sàng phục vụ bạn 24/7.
              </p>
            </div>
          </div>
          <button className="contactBtn">LIÊN HỆ TRỢ LÝ SẮC ĐẸP</button>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;