import React, { useEffect, useMemo, useState } from 'react';
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
  Card,
  Space,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../../../hooks/useAuth';
import './style.scss';

const { TabPane } = Tabs;

const ProductsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [liked, setLiked] = useState<boolean>(false);
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    axios
      .get(`http://localhost:8088/api/v1/product/${id}`)
      .then((res) => {
        const p = res.data?.data ?? res.data;
        if (!p) return;
        // normalize images
        let imgs: string[] = [];
        try {
          if (Array.isArray(p.images)) imgs = p.images;
          else if (typeof p.images === 'string' && p.images.trim()) imgs = JSON.parse(p.images);
        } catch (e) {
          imgs = [];
        }
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
        };
        if (mounted) {
          setProduct(normalized);
          setImages(normalized.images);
          setMainImage(normalized.image);
        }

        // fetch related products by categoryId if available
        const catId = p.categoryId ?? p.categoryId;
        if (catId) {
          axios
            .get(`http://localhost:8088/api/v1/product?categoryId=${catId}&limit=4`)
            .then((r) => {
              const items = r.data?.data ?? r.data ?? [];
              if (mounted) {
                const mapped = (Array.isArray(items) ? items : []).map((it: any) => ({
                  id: it.id,
                  name: it.name,
                  price: Number(it.price ?? 0),
                  image: it.image ?? (Array.isArray(it.images) ? it.images[0] : undefined),
                }));
                setRelated(mapped.filter((rp: any) => rp.id !== normalized.id));
              }
            })
            .catch(() => {});
        }

        // fetch reviews for tab
        axios
          .get(`http://localhost:8088/api/v1/review/product/${id}`)
          .then((r) => {
            const rv = r.data?.data ?? r.data ?? [];
            if (mounted) setReviews(Array.isArray(rv) ? rv : []);
          })
          .catch(() => {});
      })
      .catch((err) => {
        console.error('Failed to load product', err);
        message.error('Không thể tải thông tin sản phẩm');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

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
      } else {
        message.error(res.data?.mess || 'Thêm vào giỏ hàng thất bại');
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.mess || 'Lỗi khi thêm vào giỏ hàng');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user || !token) return message.error('Bạn phải đăng nhập để tiếp tục');
    if (!product) return;
    try {
      const res = await axios.post(
        'http://localhost:8088/api/v1/wishlist/toggle',
        { productId: Number(product.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.err === 0) {
        setLiked((v) => !v);
        message.success(res.data?.mess || 'Cập nhật yêu thích');
      } else {
        message.error(res.data?.mess || 'Thao tác thất bại');
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.mess || 'Lỗi khi cập nhật yêu thích');
    }
  };

  const ingredientList = useMemo(() => product?.ingredients ?? [], [product]);

  return (
    <div className="productDetailPage">
      <div className="backButton">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} className="backBtn">
          Quay lại danh sách sản phẩm
        </Button>
      </div>

      <Skeleton active loading={loading} paragraph={{ rows: 8 }}>
        {product && (
          <div className="productDetailContainer luxury">
            <Row gutter={40}>
              <Col xs={24} md={10}>
                <div className="gallery">
                  <div className="main-photo">
                    <Image src={mainImage} alt={product.name} preview={{ src: mainImage }} />
                  </div>
                  <div className="thumbs">
                    <Space>
                      {images && images.length > 0 ? (
                        images.map((img, idx) => (
                          <Image
                            key={idx}
                            width={80}
                            src={img}
                            preview={false}
                            onClick={() => setMainImage(img)}
                            style={{ cursor: 'pointer', border: mainImage === img ? '2px solid var(--ant-primary-color)' : undefined }}
                          />
                        ))
                      ) : (
                        <Image width={80} src={product.image} preview={false} />
                      )}
                    </Space>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={14}>
                <Breadcrumb>
                  <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                  <Breadcrumb.Item> Sản phẩm </Breadcrumb.Item>
                  <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="productHeader">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Tag color={product.isNew ? 'magenta' : 'gold'}>{product.isNew ? 'NEW' : 'TRENDING'}</Tag>
                      <h2 className="productName">{product.name}</h2>
                      <div className="ratingSection">
                        <Rate disabled defaultValue={4.5} style={{ fontSize: 16 }} />
                        <span className="ratingText">({reviews.length} đánh giá)</span>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="text"
                        icon={<HeartOutlined style={{ color: liked ? '#ff4d4f' : undefined }} />}
                        onClick={handleToggleWishlist}
                      />
                    </div>
                  </div>

                  <div className="priceSection">
                    <div className="priceRow">
                      <span className="currentPrice" style={{ color: 'var(--ant-primary-color)', fontWeight: 700, fontSize: 24 }}>
                        {Number(product.price).toLocaleString()}đ
                      </span>
                      {product.originalPrice && (
                        <span className="originalPrice" style={{ textDecoration: 'line-through', marginLeft: 12 }}>
                          {Number(product.originalPrice).toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <div className="shortDesc">
                      <p>{product.description?.slice(0, 220)}</p>
                    </div>
                    <div className="metaRow">
                      <div><SafetyOutlined /> Key Ingredients</div>
                      <div>
                        <InputNumber min={1} max={10} value={quantity} onChange={(v) => setQuantity(Number(v ?? 1))} />
                        <span style={{ marginLeft: 12 }}>
                          {product.stock > 0 ? (
                            <span style={{ color: 'green' }}><CheckCircleOutlined /> Còn hàng</span>
                          ) : (
                            <span style={{ color: 'red' }}>Hết hàng</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: 18 }}>
                      <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} disabled={product.stock <= 0}>
                        THÊM VÀO GIỎ
                      </Button>
                      <Button style={{ marginLeft: 12 }} size="large" icon={<HeartOutlined />} onClick={handleToggleWishlist}>
                        YÊU THÍCH
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
                  <TabPane tab="Mô tả" key="1">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </TabPane>
                  <TabPane tab="Thành phần" key="2">
                    <ul>
                      {ingredientList.length ? (
                        ingredientList.map((ing: any, i: number) => <li key={i}>{ing}</li>)
                      ) : (
                        <li>Không có thông tin thành phần</li>
                      )}
                    </ul>
                  </TabPane>
                  <TabPane tab={`Đánh giá (${reviews.length})`} key="3">
                    {reviews.length ? (
                      reviews.map((r: any) => (
                        <Card key={r.id} style={{ marginBottom: 12 }}>
                          <div><strong>{r.userName ?? 'Người dùng'}</strong></div>
                          <div><Rate disabled defaultValue={Number(r.rating ?? 5)} /></div>
                          <div>{r.comment}</div>
                        </Card>
                      ))
                    ) : (
                      <div>Chưa có đánh giá</div>
                    )}
                  </TabPane>
                </Tabs>
              </Col>
            </Row>

            <div style={{ marginTop: 32 }}>
              <h3>Sản phẩm liên quan</h3>
              <Row gutter={16}>
                {related.map((rp) => (
                  <Col key={rp.id} xs={12} md={6}>
                    <Card hoverable onClick={() => navigate(`/products/${rp.id}`)} cover={<img alt={rp.name} src={rp.image} />}>
                      <Card.Meta title={rp.name} description={`${Number(rp.price).toLocaleString()}đ`} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </Skeleton>
    </div>
  );
};

export default ProductsDetail;