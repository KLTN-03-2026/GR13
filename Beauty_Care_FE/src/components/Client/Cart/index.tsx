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
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { message, Modal, Input, Spin } from "antd";
import "./style.scss";

const Cart: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Cart and profile
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
    if (profile) setPhone(profile.Phone || "");
  }, [profile]);

  const cartItems: any[] = cartResp?.data?.cartItems || cartResp?.cartItems || [];

  // Upsell products
  const { data: upsellResp, isLoading: upsellLoading } = useQuery({
    queryKey: ["upsell-products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8088/api/v1/product?limit=4");
      const data = await res.json();
      const payload = data?.data || data;
      return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
    },
  });

  // Order + PayOS
  const createOrderMutation = useMutation({
    mutationFn: (payload: any) => orderApi.createOrder(payload),
    onSuccess: async (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      const orderId = res?.orderId || res?.data?.orderId || res?.id;
      if (orderId) {
        try {
          const paymentRes: any = await paymentApi.createPaymentLink(orderId);
          if (paymentRes?.err === 0 && paymentRes?.data?.checkoutUrl) {
            window.location.href = paymentRes.data.checkoutUrl;
          } else {
            message.error(paymentRes?.mess || "Không thể tạo link thanh toán payOS");
            navigate("/myorder");
          }
        } catch (error) {
          message.error("Lỗi khi tạo link thanh toán: " + (error as Error)?.message);
          navigate("/myorder");
        }
      } else {
        message.error("Không nhận được orderId từ server");
      }
    },
    onError: (error: any) => {
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

  // Cart mutations
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: any) =>
      cartApi.updateCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => cartApi.removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // Quick add upsell
  const handleQuickAdd = (product: any) => {
    cartApi
      .addToCart(product.id, 1)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        message.success("Đã thêm vào giỏ hàng!");
      })
      .catch(() => message.error("Không thể thêm sản phẩm"));
  };

  return (
    <div className="cartPage dark-aesthetic">
      <div className="container">
        <header className="header">
          <h1 className="pageTitle">Túi Của Bạn</h1>
          <div className="promoBanner">
            Tận hưởng <strong>Vận Chuyển Miễn Phí</strong> cho tất cả đơn hàng trên 3.500.000₫
          </div>
        </header>

        <div className="layout">
          {/* LEFT: CART LIST */}
          <main className="leftColumn">
            <div className="cartList">
              {isLoading ? (
                <div className="loadingText"><Spin size="large" /> Đang tải giỏ hàng của bạn...</div>
              ) : cartItems.length === 0 ? (
                <div className="emptyCart">
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button className="ghost-btn" onClick={() => navigate("/products")}>
                    TIẾP TỤC MUA SẮM
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cartItem fade-in">
                    <div className="itemMedia">
                      <img
                        src={item.productData?.image || "https://placehold.co/300x400"}
                        alt={item.productData?.name}
                      />
                    </div>
                    <div className="itemDetails">
                      <div className="itemHeader">
                        <div>
                          <span className="categoryTag">
                            {item.productData?.category || "SKINCARE"}
                          </span>
                          <h3 className="product-name">{item.productData?.name}</h3>
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
              <div className="upsellSlider">
                {upsellLoading ? (
                  <Spin />
                ) : (
                  (upsellResp || []).map((product: any) => (
                    <div key={product.id} className="upsellCard dark-card">
                      <div className="card-media">
                        <img
                          src={product.image || "https://placehold.co/120x160"}
                          alt={product.name}
                        />
                      </div>
                      <div className="card-body">
                        <span className="upsellName">{product.name}</span>
                        <span className="upsellPrice">
                          {formatVND(product.discountPrice || product.price || 0)}
                        </span>
                      </div>
                      <button
                        className="quickAddBtn"
                        onClick={() => handleQuickAdd(product)}
                        title="Thêm vào giỏ"
                      >
                        <ShoppingCartOutlined />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* RIGHT: SUMMARY */}
          <aside className="rightColumn">
            <div className="summarySticky">
              <div className="summaryCard glassmorphism">
                <h3 className="summaryTitle">Tóm Tắt Đơn Hàng</h3>
                <div className="summaryRows">
                  <div className="row">
                    <span>Tổng phụ</span>
                    <span className="price-val">{formatVND(subtotal)}</span>
                  </div>
                  <div className="row">
                    <span>Vận chuyển ước tính</span>
                    <span className="freeText">MIỄN PHÍ</span>
                  </div>
                  <div className="row">
                    <span>Thuế ước tính (8%)</span>
                    <span className="price-val">{formatVND(tax)}</span>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="totalRow">
                  <span>Tổng cộng</span>
                  <span className="totalAmount">{formatVND(total)}</span>
                </div>
                <button
                  className="checkoutBtn primary-btn"
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
                  title={<span className="modal-title">Thông Tin Giao Hàng</span>}
                  open={isModalOpen}
                  onOk={handlePayOSCheckout}
                  onCancel={() => setIsModalOpen(false)}
                  okText="Thanh toán ngay"
                  cancelText="Hủy"
                  className="luxury-modal dark-modal"
                  centered
                >
                  <div style={{ marginBottom: "16px" }}>
                    <label>Số điện thoại:</label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ marginTop: "8px" }}
                      className="glass-input"
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
                      className="glass-input"
                    />
                  </div>
                </Modal>
                <div className="trustSignals">
                  <div className="signalItem">
                    <SafetyCertificateOutlined className="icon" />
                    <span>Thanh toán bảo mật 256-bit</span>
                  </div>
                  <div className="signalItem">
                    <TruckOutlined className="icon" />
                    <span>Giao hàng nhanh 2-3 ngày</span>
                  </div>
                </div>
              </div>
              <div className="couponBox">
                <input type="text" placeholder="MÃ KHUYẾN MÃI" className="transparent-input" />
                <button className="apply-btn">ÁP DỤNG</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;