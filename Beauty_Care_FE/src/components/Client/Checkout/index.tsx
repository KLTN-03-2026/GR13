import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from "../../../api/cart";
import * as orderApi from "../../../api/order";
import * as paymentApi from "../../../api/payment";
import { QRCodeCanvas } from "qrcode.react";
import { 
  ArrowLeftOutlined, 
  LockOutlined, 
  CreditCardOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import "./style.scss";

const Checkout: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const { data: cartResp, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });
  const cartItems: any[] = cartResp?.data?.cartItems ?? [];

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) => orderApi.createOrder(payload),
    onSuccess: async (res: any) => {
      console.log("✅ Create Order Response:", res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      const orderId = res?.orderId || res?.data?.orderId || res?.id;
      
      if (paymentMethod === "QR" || paymentMethod === "PAYOS") {
        if (orderId) {
          try {
            console.log("📦 Creating payment link for orderId:", orderId);
            const paymentRes: any = await paymentApi.createPaymentLink(orderId);
            console.log("💳 Payment Link Response:", paymentRes);
            
            if (paymentRes?.err === 0 && paymentRes?.data?.checkoutUrl) {
              console.log("🚀 Redirecting to checkout URL:", paymentRes.data.checkoutUrl);
              window.location.href = paymentRes.data.checkoutUrl;
            } else {
              message.error(paymentRes?.mess || "Không thể tạo link thanh toán payOS");
            }
          } catch (error) {
            console.error("❌ Payment Error:", error);
            message.error("Lỗi khi tạo link thanh toán: " + (error as Error)?.message);
          }
        } else {
          message.error("Không nhận được orderId từ server");
        }
      } else {
        message.success("Đặt hàng thành công!");
        navigate("/myorder");
      }
    },
    onError: (error: any) => {
      console.error("❌ Create Order Error:", error);
      message.error("Lỗi tạo đơn hàng: " + (error?.message || "Vui lòng thử lại"));
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item?.productData?.discountPrice ||
      item?.productData?.price ||
      0;

    return sum + price * (item?.quantity || 1);
  }, 0);

  const tax = subtotal * 0.08;
  const totalAmount = subtotal + tax;

  const handlePlaceOrder = () => {
    if (!firstName || !lastName || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    createOrderMutation.mutate({
      shippingAddress: address,
      phone,
      paymentMethod,
    });
  };

  return (
    <div className="checkoutPage">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div className="stepper">
            <div className="step active">
              <span className="number">1</span>
              <span className="label">Thông Tin</span>
            </div>
            <div className="line"></div>
            <div className="step">
              <span className="number">2</span>
              <span className="label">Vận Chuyển</span>
            </div>
            <div className="line"></div>
            <div className="step">
              <span className="number">3</span>
              <span className="label">Thanh Toán</span>
            </div>
          </div>

          <Link to="/cart" className="backLink">
            <ArrowLeftOutlined /> Quay lại giỏ hàng
          </Link>
        </header>

        <div className="layout">

          {/* LEFT */}
          <main className="leftColumn">

            <section className="section">
              <h2 className="sectionTitle">Địa Chỉ Giao Hàng</h2>

              <div className="formGrid">
                <div className="inputGroup">
                  <label>Họ</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="inputGroup">
                  <label>Tên</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="inputGroup">
                  <label>Số điện thoại</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="inputGroup">
                  <label>Địa chỉ</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="sectionTitle">Phương Thức Thanh Toán</h2>

              <div className="paymentOptions">

                {/* CARD */}
             

                {/* COD */}
                <label className="paymentItem">
                  <input
                    type="radio"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="paymentContent">
                    💵 COD
                  </div>
                </label>

                {/* QR / PAYOS */}
                <label className="paymentItem">
                  <input
                    type="radio"
                    checked={paymentMethod === 'PAYOS'}
                    onChange={() => setPaymentMethod('PAYOS')}
                  />
                  <div className="paymentContent">
                    <WalletOutlined />
                    <span>Thanh toán PayOS</span>
                  </div>
                </label>

              </div>
            </section>

            <button
              className="completeBtn"
              onClick={handlePlaceOrder}
              disabled={createOrderMutation.isPending || cartLoading}
            >
              {createOrderMutation.isPending ? "Đang xử lý..." : "XÁC NHẬN ĐẶT HÀNG"} <LockOutlined />
            </button>

          </main>

          {/* RIGHT */}
          <aside className="rightColumn">
            <div className="orderSummary">
              <h3 className="summaryTitle">Đơn Hàng</h3>

              <div className="productList">
                {cartLoading ? (
                  <div>Đang tải giỏ hàng...</div>
                ) : (
                  cartItems?.map((item) => (
                    <div className="productItem" key={item?.id}>
                      <div className="imgBadge">
                        <img src={item?.productData?.image} />
                        <span className="badge">{item?.quantity}</span>
                      </div>

                      <div className="pInfo">
                        <span className="pName">{item?.productData?.name}</span>
                      </div>

                      <div className="pPrice">
                        {(
                          item?.productData?.discountPrice ||
                          item?.productData?.price ||
                          0
                        ).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="priceDetails">
                <div className="priceRow">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="priceRow">
                  <span>Thuế (8%)</span>
                  <span>{tax.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="totalRow">
                  <span>Tổng</span>
                  <span className="totalAmount">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <div className="guarantee">
                <p><LockOutlined /> Thanh toán bảo mật</p>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;