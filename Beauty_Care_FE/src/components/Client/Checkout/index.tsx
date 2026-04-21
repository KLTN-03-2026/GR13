import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from '../../../api/cart';
import * as orderApi from '../../../api/order';
import { 
  ArrowLeftOutlined, 
  LockOutlined, 
  CreditCardOutlined, 
  CheckCircleFilled 
} from '@ant-design/icons';
import "./style.scss";

const Checkout: React.FC = () => {
  const [currentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartResp, isLoading: cartLoading } = useQuery({ queryKey: ['cart'], queryFn: () => cartApi.getCart() });
  const cartItems: any[] = cartResp?.data?.cartItems ?? [];

  const createOrderMutation = useMutation({ mutationFn: (payload: any) => orderApi.createOrder(payload), onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    navigate('/my-orders');
  } });

  return (
    <div className="checkoutPage">
      <div className="container">
        {/* THANH TIẾN TRÌNH LUXURY */}
        <header className="header">
          <div className="stepper">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="number">{currentStep > 1 ? <CheckCircleFilled /> : '1'}</span>
              <span className="label">Thông Tin</span>
            </div>
            <div className="line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="number">2</span>
              <span className="label">Vận Chuyển</span>
            </div>
            <div className="line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="number">3</span>
              <span className="label">Thanh Toán</span>
            </div>
          </div>
          <Link to="/cart" className="backLink">
            <ArrowLeftOutlined /> Quay lại giỏ hàng
          </Link>
        </header>

        <div className="layout">
          {/* CỘT TRÁI - FORM NHẬP LIỆU */}
          <main className="leftColumn">
            <section className="section">
              <h2 className="sectionTitle">Địa Chỉ Giao Hàng</h2>
              <div className="formGrid">
                  <div className="inputGroup">
                    <label>Họ</label>
                    <input type="text" placeholder="Điền thông tin cá nhân" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="inputGroup">
                    <label>Tên</label>
                    <input type="text" placeholder="Điền thông tin cá nhân" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                <div className="inputGroup">
                  <label>Số điện thoại</label>
                  <input type="tel" placeholder="+84 912 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="inputGroup">
                  <label>Địa chỉ chi tiết</label>
                  <input type="text" placeholder="Số nhà, tên đường, phường/xã..." value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="row">
                  <div className="inputGroup">
                    <label>Tỉnh / Thành Phố</label>
                    <select className="customSelect">
                      <option>Hà Nội</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <div className="inputGroup">
                    <label>Mã Bưu Chính</label>
                    <input type="text" placeholder="100000" />
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="sectionTitle">Phương Thức Thanh Toán</h2>
              <div className="paymentOptions">
                <label className="paymentItem">
                  <input type="radio" name="payment" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
                  <div className="paymentContent">
                    <CreditCardOutlined className="paymentIcon" />
                    <div className="paymentText">
                      <strong>Thẻ Tín Dụng / Ghi Nợ</strong>
                      <span>Thanh toán an toàn qua cổng quốc tế</span>
                    </div>
                  </div>
                </label>
                <label className="paymentItem">
                  <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div className="paymentContent">
                    <div className="codIcon">💵</div>
                    <div className="paymentText">
                      <strong>Thanh Toán Khi Nhận Hàng (COD)</strong>
                      <span>Kiểm tra hàng trước khi thanh toán</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <button className="completeBtn" onClick={() => {
              if (!address || !phone) { alert('Vui lòng nhập đầy đủ thông tin giao hàng'); return; }
              createOrderMutation.mutate({ shippingAddress: address, phone, paymentMethod });
            }} disabled={createOrderMutation.status === 'pending'}>
              {createOrderMutation.status === 'pending' ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'} <LockOutlined />
            </button>
          </main>

          {/* CỘT PHẢI - TÓM TẮT ĐƠN HÀNG */}
          <aside className="rightColumn">
            <div className="orderSummary">
              <h3 className="summaryTitle">Đơn Hàng Của Bạn</h3>
              
              <div className="productList">
                {cartLoading ? (
                  <div>Đang tải giỏ hàng...</div>
                ) : (
                  cartItems.map((item) => (
                    <div className="productItem" key={item.id}>
                      <div className="imgBadge">
                        <img src={item.productData?.image || 'https://placehold.co/120x160'} alt={item.productData?.name} />
                        <span className="badge">{item.quantity}</span>
                      </div>
                      <div className="pInfo">
                        <span className="pName">{item.productData?.name}</span>
                        <span className="pDesc">{item.productData?.size || ''}</span>
                      </div>
                      <div className="pPrice">${((item.productData?.discountPrice || item.productData?.price) || 0).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="promoCode">
                <input type="text" placeholder="MÃ GIẢM GIÁ" />
                <button>ÁP DỤNG</button>
              </div>

              <div className="priceDetails">
                <div className="priceRow">
                  <span>Tổng phụ</span>
                  <span>$83.00</span>
                </div>
                <div className="priceRow">
                  <span>Phí vận chuyển</span>
                  <span className="free">MIỄN PHÍ</span>
                </div>
                <div className="priceRow">
                  <span>Thuế (8%)</span>
                  <span>$6.64</span>
                </div>
                <div className="totalRow">
                  <span>Tổng thanh toán</span>
                  <span className="totalAmount">$89.64</span>
                </div>
              </div>

              <div className="guarantee">
                <p><LockOutlined /> Mọi giao dịch đều được mã hóa và bảo mật tuyệt đối.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;