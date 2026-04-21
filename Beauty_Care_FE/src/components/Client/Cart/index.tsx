import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as cartApi from '../../../api/cart';
import { 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  SafetyCertificateOutlined,
  TruckOutlined
} from '@ant-design/icons';
// Import trực tiếp để khớp với file style.scss
import "./style.scss";

const Cart: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cartResp, isLoading } = useQuery({ 
    queryKey: ['cart'], 
    queryFn: () => cartApi.getCart() 
  });
  
  const cartItems: any[] = cartResp?.data?.cartItems ?? [];

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.productData?.discountPrice || item.productData?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateMutation = useMutation({ 
    mutationFn: ({ productId, quantity }: any) => cartApi.updateCartItem(productId, quantity), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }) 
  });

  const removeMutation = useMutation({ 
    mutationFn: (productId: number) => cartApi.removeFromCart(productId), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }) 
  });

  return (
    <div className="cartPage">
      <div className="container">
        <header className="header">
          <h1 className="pageTitle">Túi Của Bạn</h1>
          <div className="promoBanner">
            Tận hưởng <strong>Vận Chuyển Miễn Phí</strong> cho tất cả đơn hàng trên 3.500.000₫
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
                   <button onClick={() => navigate('/products')}>TIẾP TỤC MUA SẮM</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cartItem">
                    <div className="itemMedia">
                      <img src={item.productData?.image || 'https://placehold.co/150x200'} alt={item.productData?.name} />
                    </div>
                    
                    <div className="itemDetails">
                      <div className="itemHeader">
                        <div>
                          <span className="categoryTag">{item.productData?.category || 'SKINCARE'}</span>
                          <h3>{item.productData?.name}</h3>
                          <p className="sizeInfo">{item.productData?.size || 'Tiêu chuẩn'}</p>
                        </div>
                        <div className="itemPrice">{formatVND((item.productData?.discountPrice || item.productData?.price) || 0)}</div>
                      </div>

                      <div className="itemActions">
                        <div className="quantityPicker">
                          <button className="qBtn" onClick={() => updateMutation.mutate({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) })}><MinusOutlined /></button>
                          <span className="qValue">{item.quantity}</span>
                          <button className="qBtn" onClick={() => updateMutation.mutate({ productId: item.productId, quantity: item.quantity + 1 })}><PlusOutlined /></button>
                        </div>
                        <button className="removeBtn" onClick={() => removeMutation.mutate(item.productId)}>
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
                    <img src={`https://placehold.co/80x100?text=Beauty+${i}`} alt="Upsell" />
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

                <button className="checkoutBtn" onClick={() => navigate('/checkout')} disabled={cartItems.length === 0}>
                  TIẾN HÀNH THANH TOÁN
                </button>

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