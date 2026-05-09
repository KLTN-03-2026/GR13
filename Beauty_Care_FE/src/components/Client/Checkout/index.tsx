import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from "../../../api/cart";
import * as orderApi from "../../../api/order";
import * as paymentApi from "../../../api/payment";
import { 
  ArrowLeftOutlined, 
  LockOutlined, 
  WalletOutlined,
  CheckCircleOutlined
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
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      const orderId = res?.orderId || res?.data?.orderId || res?.id;
      
      if (paymentMethod === "PAYOS") {
        if (orderId) {
          try {
            const paymentRes: any = await paymentApi.createPaymentLink(orderId);
            if (paymentRes?.err === 0 && paymentRes?.data?.checkoutUrl) {
              window.location.href = paymentRes.data.checkoutUrl;
            } else {
              message.error(paymentRes?.mess || "Không thể tạo link thanh toán PayOS");
            }
          } catch (error) {
            message.error("Lỗi khi tạo link thanh toán");
          }
        }
      } else {
        message.success("Đặt hàng thành công!");
        navigate("/myorder");
      }
    },
    onError: (error: any) => {
      message.error("Lỗi tạo đơn hàng: " + (error?.message || "Vui lòng thử lại"));
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item?.productData?.discountPrice || item?.productData?.price || 0;
    return sum + price * (item?.quantity || 1);
  }, 0);

  const tax = subtotal * 0.08;
  const totalAmount = subtotal + tax;

  const handlePlaceOrder = () => {
    if (!firstName || !lastName || !phone || !address) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng trống!");
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
              <span className="label">Thanh Toán</span>
            </div>
            <div className="line"></div>
            <div className="step">
              <span className="number"><CheckCircleOutlined /></span>
              <span className="label">Hoàn Tất</span>
            </div>
          </div>

          <Link to="/cart" className="backLink">
            <ArrowLeftOutlined /> Quay lại giỏ hàng
          </Link>
        </header>

        <div className="layout">
          {/* LEFT: SHIPPING & PAYMENT */}
          <main className="leftColumn">
            <section className="section">
              <h2 className="sectionTitle">Thông Tin Giao Hàng</h2>
              <div className="formGrid">
                <div className="inputGroup">
                  <label>Họ</label>
                  <input 
                    placeholder="Nhập họ của bạn"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Tên</label>
                  <input 
                    placeholder="Nhập tên của bạn"
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Số điện thoại</label>
                  <input 
                    placeholder="VD: 0912345678"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Địa chỉ nhận hàng</label>
                  <input 
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="sectionTitle">Phương Thức Thanh Toán</h2>
              <div className="paymentOptions">
                <label className={`paymentItem ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="paymentContent">
                    💵 Thanh toán khi nhận hàng (COD)
                  </div>
                </label>

                <label className={`paymentItem ${paymentMethod === 'PAYOS' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'PAYOS'}
                    onChange={() => setPaymentMethod('PAYOS')}
                  />
                  <div className="paymentContent">
                    <WalletOutlined />
                    <span>Thanh toán qua PayOS</span>
                  </div>
                </label>
              </div>
            </section>

            <button
              className="completeBtn"
              onClick={handlePlaceOrder}
              disabled={createOrderMutation.isPending || cartLoading}
            >
              {createOrderMutation.isPending ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"} <LockOutlined />
            </button>
          </main>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="rightColumn">
            <div className="orderSummary">
              <h3 className="summaryTitle">Đơn Hàng Của Bạn</h3>

              <div className="productList">
                {cartLoading ? (
                  <div className="loading-state">Đang tải giỏ hàng...</div>
                ) : (
                  cartItems?.map((item) => (
                    <div className="productItem" key={item?.id}>
                      <div className="imgBadge">
                        <img src={item?.productData?.image} alt={item?.productData?.name} />
                        <span className="badge">{item?.quantity}</span>
                      </div>
                      <div className="pInfo">
                        <span className="pName">{item?.productData?.name}</span>
                      </div>
                      <div className="pPrice">
                        {(
                          (item?.productData?.discountPrice || item?.productData?.price || 0) * (item?.quantity || 1)
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
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="priceRow">
                  <span>Thuế (8%)</span>
                  <span>{tax.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="totalRow">
                  <span>Tổng cộng</span>
                  <span className="totalAmount">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <div className="guarantee">
                <LockOutlined /> <span>Thanh toán bảo mật & mã hóa SSL</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;