import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Rate,
  message,
  Breadcrumb,
  Tag,
  Row,
  Col,
  Image,
  InputNumber,
  Skeleton,
  Tabs,
  Avatar,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../../../hooks/useAuth';
import { useQueryClient } from "@tanstack/react-query";
import './style.scss';

const { TabPane } = Tabs;

const ProductsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const reviewRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [liked, setLiked] = useState<boolean>(false);
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    axios
      .get(`http://localhost:8088/api/v1/product/${id}`)
      .then((res) => {
        const p = res.data?.data ?? res.data;
        if (!p) return;
        
        let imgs: string[] = [];
        try {
          if (Array.isArray(p.images)) imgs = p.images;
          else if (typeof p.images === 'string' && p.images.trim()) imgs = JSON.parse(p.images);
        } catch (e) { imgs = []; }
        
        if (p.image && !imgs.includes(p.image)) imgs.unshift(p.image);
        
        const normalized = {
          id: p.id,
          name: p.name,
          category: p.categoryData?.name ?? p.category ?? '',
          description: p.description ?? '',
          ingredients: p.ingredients ?? [],
          price: Number(p.price ?? 0),
          originalPrice: p.discountPrice ?? null,
          stock: Number(p.stock ?? 0),
          image: p.image ?? imgs[0] ?? undefined,
          images: imgs,
          isNew: p.isNew ?? true
        };

        if (mounted) {
          setProduct(normalized);
          setImages(normalized.images);
          setMainImage(normalized.image);
        }

        // Related Products
        const catId = p.categoryId;
        if (catId) {
          axios.get(`http://localhost:8088/api/v1/product?categoryId=${catId}&limit=5`)
            .then((r) => {
              const items = r.data?.data ?? r.data ?? [];
              if (mounted) {
                setRelated((Array.isArray(items) ? items : []).filter((it: any) => it.id !== normalized.id).slice(0, 4));
              }
            });
        }

        // Reviews
        axios.get(`http://localhost:8088/api/v1/review/product/${id}`)
          .then((r) => {
            const rv = r.data?.data ?? r.data ?? [];
            if (mounted) setReviews(Array.isArray(rv) ? rv : []);
          });
      })
      .catch(() => message.error('Không thể tải thông tin sản phẩm'))
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [id]);

  // Check if product is in wishlist on load or when token changes
  useEffect(() => {
    if (user && token && product && id) {
      axios.get('http://localhost:8088/api/v1/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log("DEBUG - Wishlist data:", res.data);
        if (res.data?.err === 0) {
          const isLiked = res.data.data.some((item: any) => Number(item.productId) === Number(id));
          console.log("DEBUG - isLiked for product", id, ":", isLiked);
          setLiked(isLiked);
        }
      })
      .catch(err => console.error("Error checking wishlist:", err));
    }
  }, [user, token, product, id]);

  const handleAddToCart = async () => {
    if (!user || !token) return message.error('Bạn phải đăng nhập để tiếp tục');
    if (!product) return;
    try {
      const res = await axios.post(
        'http://localhost:8088/api/v1/cart/add',
        { productId: Number(product.id), quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.err === 0) {
        message.success('Đã thêm vào giỏ hàng');
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    } catch (err: any) { message.error('Lỗi khi thêm vào giỏ hàng'); }
  };

  const handleToggleWishlist = async () => {
    if (!user || !token) return message.error('Bạn phải đăng nhập để tiếp tục');
    if (!product) return;
    console.log("DEBUG - Toggling wishlist for Product ID:", product.id, "URL Param ID:", id);
    try {
      const res = await axios.post(
        'http://localhost:8088/api/v1/wishlist/toggle',
        { productId: Number(product.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("DEBUG - Toggle response status:", res.data?.err, "Message:", res.data?.mess);
      if (res.data?.err === 0) {
        setLiked(!liked);
        message.success(res.data?.mess);
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }
    } catch (err: any) { 
      console.error("DEBUG - Toggle error:", err);
      message.error('Lỗi khi cập nhật yêu thích'); 
    }
  };

  const ingredientList = useMemo(() => {
    if (typeof product?.ingredients === 'string') {
      try { return JSON.parse(product.ingredients); } catch(e) { return [product.ingredients]; }
    }
    return product?.ingredients ?? [];
  }, [product]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 5;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const scrollToReviews = () => {
    setActiveTab("3");
    setTimeout(() => {
      reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="productDetailPage">
      <div className="backButton">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} className="backBtn">
          Quay lại danh sách sản phẩm
        </Button>
      </div>

      <Skeleton active loading={loading} paragraph={{ rows: 12 }} className="skeleton-luxury">
        {product && (
          <div className="productDetailContainer luxury">
            <Row gutter={[60, 40]} className="layout-row">
              {/* LEFT: GALLERY */}
              <Col xs={24} lg={11}>
                <div className="gallery">
                  <div className="main-photo">
                    <Image src={mainImage} alt={product.name} preview={{ src: mainImage }} />
                  </div>
                  <div className="thumbs">
                    {images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`thumb-item ${mainImage === img ? 'active' : ''}`}
                        onClick={() => setMainImage(img)}
                      >
                        <img src={img} alt={`${product.name} ${idx}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              {/* RIGHT: INFO */}
              <Col xs={24} lg={13}>
                <div className="productHeader">
                  <Breadcrumb separator="•">
                    <Breadcrumb.Item onClick={() => navigate('/')}>Trang Chủ</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/products')}>Sản Phẩm</Breadcrumb.Item>
                    <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
                  </Breadcrumb>

                  <div className="tag-row">
                    <Tag>{product.isNew ? 'NEW ARRIVAL' : 'BEST SELLER'}</Tag>
                  </div>
                  
                  <h1 className="productName">{product.name}</h1>
                  
                  <div className="ratingSection" onClick={scrollToReviews} style={{ cursor: 'pointer' }}>
                    <Rate disabled defaultValue={Number(avgRating)} allowHalf />
                    <span className="ratingText">| {avgRating}/5 ({reviews.length} đánh giá)</span>
                  </div>
                </div>

                <div className="priceSection">
                  <div className="priceRow">
                    <span className="currentPrice">{product.price.toLocaleString()}đ</span>
                    {product.originalPrice && (
                      <span className="originalPrice">{product.originalPrice.toLocaleString()}đ</span>
                    )}
                  </div>
                  
                  <div className="shortDesc">
                    <p>{product.description?.replace(/<[^>]*>/g, '').slice(0, 250)}...</p>
                  </div>

                  <div className="action-row">
                    <div className="qty-selector">
                      <InputNumber 
                        min={1} 
                        max={product.stock} 
                        value={quantity} 
                        onChange={(v) => setQuantity(Number(v ?? 1))} 
                      />
                    </div>
                    
                    <Button 
                      className="btn-add-cart" 
                      icon={<ShoppingCartOutlined />} 
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                    </Button>

                    <button 
                      className={`btn-wish ${liked ? 'active' : ''}`} 
                      onClick={handleToggleWishlist}
                    >
                      {liked ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </div>

                  <div style={{ marginTop: 20, fontSize: 13, color: product.stock > 0 ? '#52c41a' : '#ff4d4f', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {product.stock > 0 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    {product.stock > 0 ? `Sẵn sàng giao hàng (${product.stock} sản phẩm)` : 'Hiện tại đã hết hàng'}
                  </div>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                  <TabPane tab="Mô tả sản phẩm" key="1">
                    <div className="tab-content" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </TabPane>
                  <TabPane tab="Thành phần" key="2">
                    <div className="tab-content">
                      <p>Danh sách các thành phần chọn lọc có trong sản phẩm:</p>
                      <ul>
                        {ingredientList.length ? (
                          ingredientList.map((ing: any, i: number) => <li key={i}>{ing}</li>)
                        ) : (
                          <li>Thông tin thành phần đang được cập nhật.</li>
                        )}
                      </ul>
                    </div>
                  </TabPane>
                  <TabPane tab={`Đánh giá (${reviews.length})`} key="3">
                    <div className="tab-content reviews-container" ref={reviewRef}>
                      {reviews.length ? (
                        reviews.map((r: any) => (
                          <div key={r.id} className="review-card-luxury">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <Avatar src={r.userData?.avatar} size={40} className="luxury-avatar">
                                  {r.userName?.charAt(0).toUpperCase() || 'U'}
                                </Avatar>
                                <div>
                                  <div className="reviewer-name">{r.userName || 'Khách hàng'}</div>
                                  <div className="review-date">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</div>
                                </div>
                              </div>
                              <div className="verified-badge">
                                <SafetyCertificateOutlined /> Verified Purchase
                              </div>
                            </div>
                            <div className="review-rating">
                              <Rate disabled defaultValue={Number(r.rating || 5)} />
                            </div>
                            <div className="review-comment">{r.comment}</div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-reviews">
                          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                          <p>Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
                        </div>
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>

            {/* RELATED PRODUCTS */}
            <div className={`related-section-wrapper ${activeTab === '3' ? 'pushed-down' : ''}`}>
              {related.length > 0 && (
                <div className="related-section">
                  <h2 className="section-title">Sản phẩm cùng dòng</h2>
                  <div className="related-grid">
                    {related.map((rp: any) => (
                      <div 
                        key={rp.id} 
                        className="related-card" 
                        onClick={() => {
                          navigate(`/products/${rp.id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <div className="img-wrap">
                          <img alt={rp.name} src={rp.image || (Array.isArray(rp.images) ? rp.images[0] : '')} />
                        </div>
                        <div className="info">
                          <div className="p-name">{rp.name}</div>
                          <div className="p-price">{Number(rp.price).toLocaleString()}đ</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Skeleton>
    </div>
  );
};

export default ProductsDetail;