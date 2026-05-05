import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Tag, Tooltip, Space } from 'antd';
import {
  RobotOutlined,
  CustomerServiceOutlined,
  CameraOutlined,
  UploadOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import './style.scss';
import Draggable from 'react-draggable';
import { Link, useNavigate } from 'react-router-dom';
import FaceScanner from '../../components/Common/FaceScanner';
import { addToCart } from '../../api/cart';
import { message, Spin, Empty } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../api/config';

const products = [
  { id: 1, name: 'Serum Phục Hồi', price: '₫650.000', img: 'https://i.pravatar.cc/220?img=56' },
  { id: 2, name: 'Kem Dưỡng Glow', price: '₫420.000', img: 'https://i.pravatar.cc/220?img=57' },
  { id: 3, name: 'Mặt Nạ Than', price: '₫210.000', img: 'https://i.pravatar.cc/220?img=58' },
  { id: 4, name: 'Tinh Chất Vitamin C', price: '₫780.000', img: 'https://i.pravatar.cc/220?img=59' },
];

const ChatboxAI: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [centerPos, setCenterPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggableKey, setDraggableKey] = useState(0);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  
  const scannerRef = useRef<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // sample scores for demo
  const scores = {
    mụnViêm: 28,
    mụnĐầuĐen: 54,
    thâmNám: 18,
    lỗChânLông: 72,
    nếpNhăn: 12,
  };

  const currentScores = apiResult?.scores ? {
    mụnViêm: apiResult.scores.acne || 0,
    mụnĐầuĐen: apiResult.scores.blackheads || 0,
    thâmNám: apiResult.scores.dark_spots || 0,
    lỗChânLông: apiResult.scores.pores || 0,
    nếpNhăn: apiResult.scores.wrinkles || 0,
  } : scores;

  const totalScore = apiResult?.overall || 78;
  const skinTypeLabel = apiResult?.advice_detail?.title || 'Da dầu';
  const displayProducts = apiResult?.suggested_products?.length > 0 ? apiResult.suggested_products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: `${(p.price || 0).toLocaleString()}đ`,
    img: p.image || p.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200',
  })) : products;

  const currentPreview = previewUrl || "https://i.pravatar.cc/420?img=66";

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      message.error('Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    try {
      await addToCart(productId, 1);
      message.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err: any) {
      console.error('Add to cart failed', err);
      message.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
    }
  };

  const handleBuyNow = async (productId: number) => {
    if (!user) {
      message.error('Bạn phải đăng nhập để mua hàng');
      return;
    }
    try {
      await addToCart(productId, 1);
      navigate('/cart');
    } catch (err: any) {
      console.error('Buy now failed', err);
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await API.get('/ai/history');
      if (res.data?.err === 0) {
        setHistoryList(res.data.data);
      }
    } catch (err) {
      console.error('Fetch history failed', err);
      message.error('Không thể tải lịch sử soi da');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectHistory = (item: any) => {
    setApiResult({
      scores: item.scores,
      overall: item.overall,
      advice_detail: item.advice_detail,
      suggested_products: item.suggested_products || []
    });
    setPreviewUrl(item.skin_image);
    setShowResult(true);
    setShowRecommend(true);
    setShowHistory(false);
  };

  // center the chatbox when opened
  useEffect(() => {
    if (!open) return;
    const computeCenter = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const w = Math.min(800, Math.floor(ww * 0.95));
      const h = Math.min(640, Math.floor(wh * 0.85));
      const x = Math.floor((ww - w) / 2);
      const y = Math.floor((wh - h) / 2);
      setCenterPos({ x, y });
      // remount draggable so defaultPosition applied
      setDraggableKey((k) => k + 1);
    };
    computeCenter();
    window.addEventListener('resize', computeCenter);
    return () => window.removeEventListener('resize', computeCenter);
  }, [open]);

  return (
    <div className="chatbox-ai-root">
      <FaceScanner
        ref={scannerRef}
        hideTrigger={true}
        onResult={(data, url) => {
          setApiResult(data);
          setPreviewUrl(url);
          setShowResult(true);
          setShowRecommend(true);
        }}
      />
      {/* Floating toggle button */}
      <Tooltip title="Beauty AI Consultant">
        <Button
          type="primary"
          shape="circle"
          size="large"
          className={`chatbox-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen((v) => !v)}
        >
          <RobotOutlined />
        </Button>
      </Tooltip>

      {/* Chat window */}
      <Draggable
        handle=".chatbox-header"
        cancel=".no-drag"
        defaultPosition={centerPos}
        key={draggableKey}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className={`chatbox-window ${open ? 'visible' : ''}`} aria-hidden={!open}>
        <div className="chatbox-header">
          <div className="header-left">
            <CustomerServiceOutlined className="header-icon" />
            <div className="header-title">Beauty AI Consultant</div>
          </div>
          <div className="header-right">
            <Space>
              {user && !showHistory && !showResult && !showRecommend && (
                <Button 
                  size="small" 
                  icon={<HistoryOutlined />} 
                  className="no-drag"
                  onClick={() => {
                    setShowHistory(true);
                    fetchHistory();
                  }}
                >
                  Lịch sử
                </Button>
              )}
              {showHistory && (
                <Button 
                  size="small" 
                  icon={<ArrowLeftOutlined />} 
                  className="no-drag"
                  onClick={() => setShowHistory(false)}
                >
                  Quay lại
                </Button>
              )}
              {(showResult || showRecommend) && (
                <Button size="small" className="no-drag" onClick={() => {
                  setShowResult(false);
                  setShowRecommend(false);
                  setShowHistory(false);
                }}>
                  Soi da lại
                </Button>
              )}
              <Button type="text" className="no-drag" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
            </Space>
          </div>
        </div>

        <div className="chatbox-body">
          {showHistory && (
            <div className="phase phase-history scrollable-body">
              <div className="history-header">Lịch sử soi da của bạn</div>
              {loadingHistory ? (
                <div className="loading-wrap"><Spin tip="Đang tải..." /></div>
              ) : historyList.length > 0 ? (
                <div className="history-list">
                  {historyList.map((item) => (
                    <div key={item.id} className="history-item" onClick={() => handleSelectHistory(item)}>
                      <div className="history-img">
                        <img src={item.skin_image || 'https://via.placeholder.com/60'} alt="skin" />
                      </div>
                      <div className="history-info">
                        <div className="history-date">{new Date(item.analysis_date).toLocaleString('vi-VN')}</div>
                        <div className="history-type">Loại da: {item.detected_skin_type}</div>
                        <div className="history-score">Tổng điểm: {item.overall}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="Bạn chưa có lịch sử soi da nào" style={{ marginTop: 40 }} />
              )}
            </div>
          )}

          {!showHistory && !showResult && !showRecommend && (
            <div className="phase phase-1">
              <Card className="action-card" variant="shadow">
                <CameraOutlined className="action-icon" />
                <div className="action-title">Chụp ảnh gương mặt</div>
                <div className="action-desc">Hướng dẫn chụp trong điều kiện đủ sáng</div>
                <Button type="primary" className="action-btn" onClick={() => scannerRef.current?.open()}>BẮT ĐẦU</Button>
              </Card>

              <Card className="action-card" variant="shadow">
                <UploadOutlined className="action-icon" />
                <div className="action-title">Tải ảnh từ máy</div>
                <div className="action-desc">Đăng ảnh để nhận phân tích da</div>
                <Button className="action-btn" onClick={() => scannerRef.current?.triggerUpload()}>TẢI LÊN</Button>
              </Card>
            </div>
          )}

          {(showResult || showRecommend) && (
            <div className="results-container scrollable-body">
              {showResult && (
                <div className="phase phase-2">
                  <div className="left">
                    <div className="photo-wrap">
                      <img src={currentPreview} alt="skin" />
                      <div className="scanning-line" />
                    </div>
                  </div>
                  <div className="right">
                    <div className="score-list">
                      <div className="score-row">
                        <div className="label">Mụn viêm</div>
                        <Progress percent={currentScores.mụnViêm} strokeColor="#ff7a45" />
                      </div>
                      <div className="score-row">
                        <div className="label">Mụn đầu đen</div>
                        <Progress percent={currentScores.mụnĐầuĐen} strokeColor="#faad14" />
                      </div>
                      <div className="score-row">
                        <div className="label">Thâm nám</div>
                        <Progress percent={currentScores.thâmNám} strokeColor="#9254de" />
                      </div>
                      <div className="score-row">
                        <div className="label">Lỗ chân lông</div>
                        <Progress percent={currentScores.lỗChânLông} strokeColor="#1890ff" />
                      </div>
                      <div className="score-row">
                        <div className="label">Nếp nhăn</div>
                        <Progress percent={currentScores.nếpNhăn} strokeColor="#52c41a" />
                      </div>
                    </div>

                    <div className="summary">
                      <div className="total">Tổng điểm: <span className="score">{totalScore}</span></div>
                      <Tag color="#f50" className="skin-type">Loại da: {skinTypeLabel}</Tag>
                    </div>

                    {apiResult?.advice_detail && (
                      <div className="routine-section">
                        <div className="routine-title">Quy trình gợi ý</div>
                        <div className="routine-grid">
                          <div className="routine-card morning">
                            <div className="r-label">BUỔI SÁNG</div>
                            <div className="r-content">{apiResult.advice_detail.morning_routine}</div>
                          </div>
                          <div className="routine-card evening">
                            <div className="r-label">BUỔI TỐI</div>
                            <div className="r-content">{apiResult.advice_detail.evening_routine}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showRecommend && (
                <div className="phase phase-3">
                  <div className="recommend-title">Sản phẩm đề xuất cho bạn</div>
                  <div className="product-grid">
                    {displayProducts.map((p) => (
                      <Card key={p.id} className="product-card no-drag" variant="shadow">
                        <Link to={`/products/${p.id}`} className="product-link">
                          <img src={p.img} alt={p.name} />
                          <div className="prod-name">{p.name}</div>
                          <div className="prod-price"><DollarOutlined /> {p.price}</div>
                        </Link>
                        <div className="prod-actions">
                          <Button 
                            size="small" 
                            icon={<ShoppingCartOutlined />} 
                            onClick={(e) => { e.preventDefault(); handleAddToCart(p.id); }}
                          >
                            Giỏ hàng
                          </Button>
                          <Button 
                            size="small" 
                            type="primary" 
                            onClick={(e) => { e.preventDefault(); handleBuyNow(p.id); }}
                          >
                            Mua ngay
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ChatboxAI;
