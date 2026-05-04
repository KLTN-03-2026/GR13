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
} from '@ant-design/icons';
import './style.scss';
import Draggable from 'react-draggable';
import FaceScanner from '../../components/Common/FaceScanner';

const products = [
  { id: 1, name: 'Serum Phục Hồi', price: '₫650.000', img: 'https://i.pravatar.cc/220?img=56' },
  { id: 2, name: 'Kem Dưỡng Glow', price: '₫420.000', img: 'https://i.pravatar.cc/220?img=57' },
  { id: 3, name: 'Mặt Nạ Than', price: '₫210.000', img: 'https://i.pravatar.cc/220?img=58' },
  { id: 4, name: 'Tinh Chất Vitamin C', price: '₫780.000', img: 'https://i.pravatar.cc/220?img=59' },
];

const ChatboxAI: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [centerPos, setCenterPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggableKey, setDraggableKey] = useState(0);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  
  const scannerRef = useRef<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    price: `₫${(p.price || 0).toLocaleString()}`,
    img: p.image_url || 'https://i.pravatar.cc/220?img=56',
  })) : products;

  const currentPreview = previewUrl || "https://i.pravatar.cc/420?img=66";

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
              <Button size="small" className="no-drag" onClick={() => setShowResult((s) => !s)}>
                Demo Result
              </Button>
              <Button size="small" className="no-drag" onClick={() => setShowRecommend((s) => !s)}>
                Recommendations
              </Button>
              <Button type="text" className="no-drag" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
            </Space>
          </div>
        </div>

        <div className="chatbox-body">
          {!showResult && !showRecommend && (
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
              </div>
            </div>
          )}

          {showRecommend && (
            <div className="phase phase-3">
              <div className="recommend-title">Sản phẩm đề xuất</div>
              <div className="product-scroller">
                {displayProducts.map((p) => (
                  <Card key={p.id} className="product-card" variant="shadow">
                    <img src={p.img} alt={p.name} />
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-price"><DollarOutlined /> {p.price}</div>
                    <div className="prod-actions">
                      <Button size="small" icon={<ShoppingCartOutlined />}>Giỏ hàng</Button>
                      <Button size="small" type="primary">Mua ngay</Button>
                    </div>
                  </Card>
                ))}
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
