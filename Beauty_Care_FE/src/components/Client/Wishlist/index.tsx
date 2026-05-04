import "./style.scss";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import { Row, Col, Card, Button, Empty, Skeleton, message, Popconfirm } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface ProductItem {
  id: number | string;
  name?: string;
  price?: number;
  images?: string[];
  image?: string;
  stock?: number;
}

const Wishlist: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:8088/api/v1/wishlist", { headers });
      const data = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddToCart = async (productId: number | string) => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.post(
        "http://localhost:8088/api/v1/cart/add",
        { productId: Number(productId), quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.err === 0) message.success("Đã thêm vào giỏ hàng");
      else message.error(res.data?.mess || "Thêm vào giỏ hàng thất bại");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.mess || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleRemove = async (productId: number | string) => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.delete(`http://localhost:8088/api/v1/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.err === 0) {
        setItems((s) => s.filter((p) => String(p.id) !== String(productId)));
        message.success("Đã xóa khỏi danh sách yêu thích");
      } else message.error(res.data?.mess || "Xóa thất bại");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.mess || "Lỗi khi xóa");
    }
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header"><h2>Danh sách yêu thích của bạn</h2></div>

        {loading ? (
          <Row gutter={[24, 24]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Col xs={24} sm={12} md={12} lg={6} key={i}>
                <Card className="fav-skel-card">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Empty description="Danh sách yêu thích rỗng" />
            <Button type="primary" onClick={() => navigate('/products')} style={{ marginTop: 16 }}>
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {items.map((p) => {
              const img = (p.images && p.images[0]) || p.image || "https://via.placeholder.com/300x300?text=No+Image";
              return (
                <Col xs={24} sm={12} md={12} lg={6} key={String(p.id)}>
                  <Card
                    hoverable
                    className="fav-card"
                    cover={<img alt={p.name} src={img} className="product-img" />}
                  >
                    <div className="product-meta">
                      <h4 className="product-name" onClick={() => navigate(`/products/${p.id}`)}>{p.name}</h4>
                      <div className="product-price">{p.price ? `${p.price.toLocaleString()}₫` : "—"}</div>
                      <div className={`stock ${p.stock && p.stock > 0 ? 'in' : 'out'}`}>
                        {p.stock && p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </div>
                    </div>

                    <div className="card-actions">
                      <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => handleAddToCart(p.id)}>
                        Thêm vào giỏ
                      </Button>
                      <Popconfirm title="Xóa sản phẩm khỏi yêu thích?" onConfirm={() => handleRemove(p.id)} okText="Xóa" cancelText="Hủy">
                        <Button danger icon={<DeleteOutlined />} className="btn-delete" />
                      </Popconfirm>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
