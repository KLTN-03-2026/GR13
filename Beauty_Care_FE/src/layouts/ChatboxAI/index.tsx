import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Tag, Tooltip, Space } from 'antd';
import {
  RobotOutlined,
  CustomerServiceOutlined,
  CameraOutlined,
  UploadOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import './style.scss';
import Draggable from 'react-draggable';
import { Link, useNavigate } from 'react-router-dom';
import FaceScanner from '../../components/Common/FaceScanner';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const isExpertOrAdmin = (user as any)?.role_code === 'R1' || (user as any)?.role_code === 'R2';
  
  const [open, setOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [centerPos, setCenterPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggableKey, setDraggableKey] = useState(0);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // Compute center on mount and when open
  useEffect(() => {
    const compute = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const w = Math.min(1000, Math.floor(ww * 0.95));
      const h = Math.min(760, Math.floor(wh * 0.85));
      const nx = Math.max(0, Math.floor((ww - w) / 2));
      const ny = Math.max(0, Math.floor((wh - h) / 2));
      setCenterPos({ x: nx, y: ny });
      setDraggableKey(k => k + 1);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Re-compute when open just to be sure it's centered if window size changed while closed
  useEffect(() => {
    if (open) {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const w = Math.min(1000, Math.floor(ww * 0.95));
      const h = Math.min(760, Math.floor(wh * 0.85));
      setCenterPos({ x: Math.floor((ww - w) / 2), y: Math.floor((wh - h) / 2) });
      setDraggableKey(k => k + 1);
    }
  }, [open]);
  
  const scannerRef = useRef<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const scores = {
    mụnViêm: 28, mụnĐầuĐen: 54, thâmNám: 18, lỗChânLông: 72, nếpNhăn: 12,
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
    name: p.name || p.productName,
    img: p.image || p.image_url || (p.images && p.images[0]) || 'https://placehold.co/200x200?text=Beauty+Care',
    price: `${(p.price || p.productPrice || 0).toLocaleString()}đ`,
  })) : products;

  const currentPreview = previewUrl || "https://i.pravatar.cc/420?img=66";

  const handleAddToCart = async (productId: number) => {
    if (!user) { message.error('Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng'); return; }
    try {
      await addToCart(productId, 1);
      message.success('Đã thêm sản phẩm vào giỏ hàng!');
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (err: any) { message.error('Không thể thêm vào giỏ hàng'); }
  };

  const handleBuyNow = async (productId: number) => {
    if (!user) { message.error('Bạn phải đăng nhập để mua hàng'); return; }
    try {
      await addToCart(productId, 1);
      navigate('/cart');
      setOpen(false);
    } catch (err: any) { message.error('Đã xảy ra lỗi'); }
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await API.get('/ai/history');
      if (res.data?.err === 0) setHistoryList(res.data.data);
    } catch (err) { message.error('Không thể tải lịch sử'); }
    finally { setLoadingHistory(false); }
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

  const handleToggle = () => {
    if (!open && !user && localStorage.getItem('bc_guest_scanned') === 'true') {
      message.info('Bạn đã sử dụng lượt soi da miễn phí. Vui lòng đăng nhập để tiếp tục sử dụng không giới hạn!');
      navigate('/login');
      return;
    }
    setOpen(!open);
  };

  const [suggestedBlogs, setSuggestedBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (showRecommend && apiResult?.scores) {
      const fetchBlogs = async () => {
        try {
          const s = apiResult.scores;
          const problems = [
            { label: 'mụn', score: s.acne || 0 },
            { label: 'mụn đầu đen', score: s.blackheads || 0 },
            { label: 'thâm nám', score: s.dark_spots || 0 },
            { label: 'lỗ chân lông', score: s.pores || 0 },
            { label: 'nếp nhăn', score: s.wrinkles || 0 },
          ];
          problems.sort((a, b) => b.score - a.score);
          const topProblem = problems[0];
          const query = topProblem.score > 30 ? `?q=${encodeURIComponent(topProblem.label)}&limit=3` : '?limit=3';
          const res = await API.get(`/blog${query}`);
          let data = res.data?.data?.items ?? res.data?.data ?? res.data;
          if (!Array.isArray(data) || data.length === 0) {
            const fallbackRes = await API.get('/blog?limit=3');
            data = fallbackRes.data?.data?.items ?? fallbackRes.data?.data ?? fallbackRes.data;
          }
          if (Array.isArray(data)) setSuggestedBlogs(data.slice(0, 3));
        } catch (err) {}
      };
      fetchBlogs();
    }
  }, [showRecommend, apiResult]);

  if (isExpertOrAdmin) return null;

  return (
    <div className="chatbox-ai-root">
      <FaceScanner
        ref={scannerRef}
        hideTrigger={true}
        onResult={(data, url) => {
          if (!user) localStorage.setItem('bc_guest_scanned', 'true');
          setApiResult(data);
          setPreviewUrl(url);
          setShowResult(true);
          setShowRecommend(true);
        }}
      />
      <Tooltip title="Beauty AI Consultant">
        <Button
          type="primary"
          shape="circle"
          size="large"
          className={`chatbox-toggle ${open ? 'open' : ''}`}
          onClick={handleToggle}
        >
          <RobotOutlined />
        </Button>
      </Tooltip>

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
                {user && !showHistory && (
                  <Button 
                    size="small" 
                    icon={<HistoryOutlined />} 
                    className="no-drag ghost-btn-header"
                    onClick={() => { setShowHistory(true); fetchHistory(); }}
                  >
                    Lịch sử
                  </Button>
                )}
                {showHistory && (
                  <Button 
                    size="small" 
                    icon={<ArrowLeftOutlined />} 
                    className="no-drag ghost-btn-header"
                    onClick={() => setShowHistory(false)}
                  >
                    Quay lại
                  </Button>
                )}
                {(showResult || showRecommend) && !showHistory && (
                  <Button size="small" className="no-drag ghost-btn-header" onClick={() => {
                    setShowResult(false); setShowRecommend(false);
                  }}>
                    Soi da lại
                  </Button>
                )}
                <Button type="text" className="no-drag close-btn" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
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
                        <div className="history-img"><img src={item.skin_image} alt="skin" /></div>
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
                <Card className="action-card" hoverable>
                  <CameraOutlined className="action-icon" />
                  <div className="action-title">Chụp ảnh gương mặt</div>
                  <div className="action-desc">Hướng dẫn chụp trong điều kiện đủ sáng</div>
                  <Button type="primary" className="action-btn" onClick={() => {
                    if (!user && localStorage.getItem('bc_guest_scanned') === 'true') {
                      message.info('Vui lòng đăng nhập để tiếp tục soi da!');
                      navigate('/login');
                    } else {
                      scannerRef.current?.open();
                    }
                  }}>BẮT ĐẦU</Button>
                </Card>
                <Card className="action-card" hoverable>
                  <UploadOutlined className="action-icon" />
                  <div className="action-title">Tải ảnh từ máy</div>
                  <div className="action-desc">Đăng ảnh để nhận phân tích da</div>
                  <Button className="action-btn" onClick={() => {
                    if (!user && localStorage.getItem('bc_guest_scanned') === 'true') {
                      message.info('Vui lòng đăng nhập để tiếp tục soi da!');
                      navigate('/login');
                    } else {
                      scannerRef.current?.triggerUpload();
                    }
                  }}>TẢI LÊN</Button>
                </Card>
              </div>
            )}

            {(showResult || showRecommend) && !showHistory && (
              <div className="analysis-dashboard">
                {/* LEFT COLUMN: 60% */}
                <div className="dashboard-left">
                  <div className="photo-panel">
                    <div className="photo-wrap">
                      <img src={currentPreview} alt="skin" />
                      <div className="scanning-line" />
                    </div>
                  </div>
                  
                  <div className="metrics-panel">
                    <div className="score-list">
                      <div className="score-row"><div className="label">Mụn viêm</div><Progress percent={currentScores.mụnViêm} format={(p) => <span style={{ color: '#fff' }}>{p}/100</span>} strokeColor="#ff7a45" size="small" /></div>
                      <div className="score-row"><div className="label">Mụn đầu đen</div><Progress percent={currentScores.mụnĐầuĐen} format={(p) => <span style={{ color: '#fff' }}>{p}/100</span>} strokeColor="#faad14" size="small" /></div>
                      <div className="score-row"><div className="label">Thâm nám</div><Progress percent={currentScores.thâmNám} format={(p) => <span style={{ color: '#fff' }}>{p}/100</span>} strokeColor="#9254de" size="small" /></div>
                      <div className="score-row"><div className="label">Lỗ chân lông</div><Progress percent={currentScores.lỗChânLông} format={(p) => <span style={{ color: '#fff' }}>{p}/100</span>} strokeColor="#1890ff" size="small" /></div>
                      <div className="score-row"><div className="label">Nếp nhăn</div><Progress percent={currentScores.nếpNhăn} format={(p) => <span style={{ color: '#fff' }}>{p}/100</span>} strokeColor="#52c41a" size="small" /></div>
                    </div>
                    <div className="compact-summary">
                      <div className="score-info"><span className="label">Tổng điểm:</span><span className="value">{totalScore}/100</span></div>
                      <Tag color="#f50" className="skin-tag">{skinTypeLabel}</Tag>
                    </div>
                  </div>

                  {apiResult?.advice_detail && (
                    <div className="advice-area">
                      <div className="advice-panel">
                        <div className="panel-title"> ✨ Lời khuyên chuyên gia</div>
                        <div className="advice-content">{apiResult.advice_detail.description}</div>
                      </div>
                      <div className="routine-panel">
                        <div className="panel-title">Quy trình gợi ý</div>
                        <div className="routine-flex">
                          <div className="routine-card morning">
                            <div className="r-label">☀️ BUỔI SÁNG</div>
                            <div className="r-content">
                              {apiResult.advice_detail.morning_routine.split(/[•\n]/).filter((s: string) => s.trim()).map((line: string, idx: number) => (
                                <div key={idx} style={{ marginBottom: 4 }}>• {line.trim()}</div>
                              ))}
                            </div>
                          </div>
                          <div className="routine-card evening">
                            <div className="r-label">🌙 BUỔI TỐI</div>
                            <div className="r-content">
                              {apiResult.advice_detail.evening_routine.split(/[•\n]/).filter((s: string) => s.trim()).map((line: string, idx: number) => (
                                <div key={idx} style={{ marginBottom: 4 }}>• {line.trim()}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: 40% */}
                <div className="dashboard-right">
                  <div className="recommend-section">
                    <div className="panel-title">Sản phẩm đề xuất</div>
                    <div className="product-vertical-list scrollable-area">
                      {displayProducts.map((p: any) => (
                        <Card key={p.id} className="product-item-card no-drag" hoverable>
                          <Link to={`/products/${p.id}`} className="p-link" onClick={() => setOpen(false)}>
                            <img src={p.img} alt={p.name} />
                            <div className="p-info">
                              <div className="p-name">{p.name}</div>
                              <div className="p-price">{p.price}</div>
                            </div>
                          </Link>
                          <div className="p-actions">
                            <Button size="small" type="text" icon={<ShoppingCartOutlined />} onClick={(e) => { e.preventDefault(); handleAddToCart(p.id); }} />
                            <Button size="small" type="primary" onClick={(e) => { e.preventDefault(); handleBuyNow(p.id); }}>Mua</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {suggestedBlogs.length > 0 && (
                    <div className="recommend-section blogs-section">
                      <div className="panel-title">Kiến thức làm đẹp</div>
                      <div className="blog-mini-list scrollable-area">
                        {suggestedBlogs.map((blog) => (
                          <Link key={blog.id} to={`/blog/${blog.id}`} className="blog-mini-item no-drag" onClick={() => setOpen(false)}>
                            <img src={blog.image} alt={blog.title} />
                            <div className="b-info">
                              <div className="b-title">{blog.title}</div>
                              <div className="b-tag">{blog.category || 'Skincare'}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ChatboxAI;
