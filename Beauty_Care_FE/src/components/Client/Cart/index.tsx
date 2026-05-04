import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as cartApi from "../../../api/cart";
import * as orderApi from "../../../api/order";
import * as paymentApi from "../../../api/payment";
import * as profileApi from "../../../api/profile";
import {
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { message, Modal, Input } from "antd";
import "./style.scss";

const Cart: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const { data: cartResp, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
    enabled: isModalOpen,
  });

  React.useEffect(() => {
    if (profile) {
      setPhone(profile.Phone || "");
    }
  }, [profile]);

  const cartItems: any[] = cartResp?.data?.cartItems ?? [];

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) => orderApi.createOrder(payload),
    onSuccess: async (res: any) => {
      console.log("✅ Create Order Response:", res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Check both possible orderId fields (orderId or id or data.orderId)
      const orderId = res?.orderId || res?.data?.orderId || res?.id;
      
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
            navigate("/myorder");
          }
        } catch (error) {
          console.error("❌ Payment Error:", error);
          message.error("Lỗi khi tạo link thanh toán: " + (error as Error)?.message);
          navigate("/myorder");
        }
      } else {
        message.error("Không nhận được orderId từ server");
      }
    },
    onError: (error: any) => {
      console.error("❌ Create Order Error:", error);
      message.error("Lỗi tạo đơn hàng: " + (error?.message || "Vui lòng thử lại"));
    },
  });

  const handlePayOSCheckout = () => {
    if (!shippingAddress || !phone) {
      message.warning("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }
    createOrderMutation.mutate({
      shippingAddress,
      phone,
      paymentMethod: "PAYOS",
    });
    setIsModalOpen(false);
  };

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      item.productData?.discountPrice || item.productData?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: any) =>
      cartApi.updateCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => cartApi.removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return (
    <div className="cartPage">
      <div className="container">
        <header className="header">
          <h1 className="pageTitle">Túi Của Bạn</h1>
          <div className="promoBanner">
            Tận hưởng <strong>Vận Chuyển Miễn Phí</strong> cho tất cả đơn hàng
            trên 3.500.000₫
          </div>
        </header>

        <div className="layout">
          {/* CỘT TRÁI: DANH SÁCH */}
          <main className="leftColumn">
            <div className="cartList">
              {isLoading ? (
                <div className="loadingText">Đang tải giỏ hàng của bạn...</div>
              ) : cartItems.length === 0 ? (
                <div className="emptyCart">
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button onClick={() => navigate("/products")}>
                    TIẾP TỤC MUA SẮM
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cartItem">
                    <div className="itemMedia">
                      <img
                        src={
                          item.productData?.image ||
                          "https://placehold.co/150x200"
                        }
                        alt={item.productData?.name}
                      />
                    </div>

                    <div className="itemDetails">
                      <div className="itemHeader">
                        <div>
                          <span className="categoryTag">
                            {item.productData?.category || "SKINCARE"}
                          </span>
                          <h3>{item.productData?.name}</h3>
                          <p className="sizeInfo">
                            {item.productData?.size || "Tiêu chuẩn"}
                          </p>
                        </div>
                        <div className="itemPrice">
                          {formatVND(
                            item.productData?.discountPrice ||
                              item.productData?.price ||
                              0,
                          )}
                        </div>
                      </div>

                      <div className="itemActions">
                        <div className="quantityPicker">
                          <button
                            className="qBtn"
                            onClick={() =>
                              updateMutation.mutate({
                                productId: item.productId,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                          >
                            <MinusOutlined />
                          </button>
                          <span className="qValue">{item.quantity}</span>
                          <button
                            className="qBtn"
                            onClick={() =>
                              updateMutation.mutate({
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <PlusOutlined />
                          </button>
                        </div>
                        <button
                          className="removeBtn"
                          onClick={() => removeMutation.mutate(item.productId)}
                        >
                          <DeleteOutlined /> <span>Loại Bỏ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Upsell Section */}
            <section className="upsell">
              <h4 className="upsellTitle">Hoàn Thiện Nghi Thức Của Bạn</h4>
              <div className="upsellGrid">
                {[1, 2].map((i) => (
                  <div key={i} className="upsellCard">
                    <img
                      src={`https://placehold.co/80x100?text=Beauty+${i}`}
                      alt="Upsell"
                    />
                    <div className="upsellInfo">
                      <strong>Sữa Rửa Mặt Dịu Nhẹ</strong>
                      <p>{formatVND(45000)}</p>
                      <button className="addBtn">+ Thêm</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* CỘT PHẢI: TỔNG KẾT */}
          <aside className="rightColumn">
            <div className="summarySticky">
              <div className="summaryCard">
                <h3 className="summaryTitle">Tóm Tắt Đơn Hàng</h3>

                <div className="summaryRows">
                  <div className="row">
                    <span>Tổng phụ</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  <div className="row">
                    <span>Vận chuyển ước tính</span>
                    <span className="freeText">MIỄN PHÍ</span>
                  </div>
                  <div className="row">
                    <span>Thuế ước tính (8%)</span>
                    <span>{formatVND(tax)}</span>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="totalRow">
                  <span>Tổng cộng</span>
                  <span className="totalAmount">{formatVND(total)}</span>
                </div>

                <button
                  className="checkoutBtn"
                  onClick={() => navigate("/checkout")}
                  disabled={cartItems.length === 0}
                >
                  TIẾN HÀNH THANH TOÁN
                </button>

                <button
                  className="checkoutBtn payOSBtn"
                  onClick={() => setIsModalOpen(true)}
                  disabled={
                    cartItems.length === 0 || createOrderMutation.isPending
                  }
                  style={{
                    marginTop: "12px",
                    background: "#005baa",
                    borderColor: "#005baa",
                  }}
                >
                  {createOrderMutation.isPending ? (
                    "ĐANG XỬ LÝ..."
                  ) : (
                    <>
                      THANH TOÁN NHANH PAYOS{" "}
                      <WalletOutlined style={{ marginLeft: "8px" }} />
                    </>
                  )}
                </button>

                <Modal
                  title="Thông Tin Giao Hàng"
                  open={isModalOpen}
                  onOk={handlePayOSCheckout}
                  onCancel={() => setIsModalOpen(false)}
                  okText="Thanh toán ngay"
                  cancelText="Hủy"
                >
                  <div style={{ marginBottom: "16px" }}>
                    <label>Số điện thoại:</label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ marginTop: "8px" }}
                    />
                  </div>
                  <div>
                    <label>Địa chỉ giao hàng:</label>
                    <Input.TextArea
                      placeholder="Nhập địa chỉ giao hàng chi tiết"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      style={{ marginTop: "8px" }}
                      rows={3}
                    />
                  </div>
                </Modal>

                <div className="trustSignals">
                  <div className="signalItem">
                    <SafetyCertificateOutlined />
                    <span>Thanh toán bảo mật 256-bit</span>
                  </div>
                  <div className="signalItem">
                    <TruckOutlined />
                    <span>Giao hàng nhanh 2-3 ngày</span>
                  </div>
                </div>
              </div>

              <div className="couponBox">
                <input type="text" placeholder="MÃ KHUYẾN MÃI" />
                <button>ÁP DỤNG</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
