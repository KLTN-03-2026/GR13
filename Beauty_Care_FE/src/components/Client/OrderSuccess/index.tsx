import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as paymentApi from "../../../api/payment";
import { message, Spin } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import "./style.scss";

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const statusParam = searchParams.get("status");

    if (orderIdParam) {
      setOrderId(Number(orderIdParam));
      verifyPayment(Number(orderIdParam));
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  const verifyPayment = async (id: number) => {
    try {
      const res: any = await paymentApi.verifyPayment(id);
      if (res?.err === 0) {
        if (res?.data?.status === "PAID") {
          setStatus("success");
          message.success("Đơn hàng đã được thanh toán thành công!");
        } else {
          setStatus("failed");
          message.warning(`Trạng thái thanh toán: ${res?.data?.status || "Chưa thanh toán"}`);
        }
      } else {
        setStatus("failed");
        message.error(res?.mess || "Không thể xác nhận thanh toán");
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      setStatus("failed");
      message.error("Lỗi khi xác nhận thanh toán");
    }
  };

  return (
    <div className="orderSuccessPage">
      <div className="container">
        {status === "loading" ? (
          <div className="loadingBox">
            <Spin size="large" />
            <p>Đang xác nhận thanh toán...</p>
          </div>
        ) : status === "success" ? (
          <div className="successBox">
            <div className="iconCircle success">
              <CheckCircleOutlined />
            </div>
            <h1>Thanh toán thành công!</h1>
            <p className="subtitle">
              Cảm ơn bạn đã mua sắm tại BeautyCare! Đơn hàng của bạn đã được ghi nhận.
            </p>
            {orderId && <p className="orderId">Mã đơn hàng: #{orderId}</p>}
            <div className="actions">
              <button
                className="primaryBtn"
                onClick={() => navigate("/myorder")}
              >
                <ShoppingOutlined /> Xem đơn hàng
              </button>
              <button
                className="outlineBtn"
                onClick={() => navigate("/")}
              >
                <HomeOutlined /> Về trang chủ
              </button>
            </div>
          </div>
        ) : (
          <div className="failedBox">
            <div className="iconCircle failed">
              <CloseCircleOutlined />
            </div>
            <h1>Thanh toán chưa hoàn tất</h1>
            <p className="subtitle">
              Có vẻ bạn chưa hoàn tất thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <div className="actions">
              <button
                className="primaryBtn"
                onClick={() => navigate("/cart")}
              >
                <ShoppingOutlined /> Quay lại giỏ hàng
              </button>
              <button
                className="outlineBtn"
                onClick={() => navigate("/")}
              >
                <HomeOutlined /> Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;