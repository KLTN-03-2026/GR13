import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import { Row, Col, Card, Button, Empty, Skeleton, message } from "antd";
import { ShoppingCartOutlined, HeartFilled, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import * as cartApi from "../../../api/cart";
import * as wishlistApi from "../../../api/wishlist";
import "./style.scss";

interface ProductItem {
  id: number | string;
  productId?: number;
  name?: string;
  price?: number;
  images?: string[];
  image?: string;
  stock?: number;
  category?: string;
  productData?: any;
}

const Wishlist: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Wishlist using React Query
  const { data: wishlistData, isLoading: loading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
    enabled: !!token
  });

  const items: ProductItem[] = Array.isArray(wishlistData?.data ?? wishlistData) 
    ? (wishlistData?.data ?? wishlistData) 
    : [];

  // Mutations
  const addToCartMutation = useMutation({
    mutationFn: (p: any) => cartApi.addToCart(p.id, 1),
    onSuccess: (res, product) => {
      message.success({
        content: `Đã thêm ${product.name} vào giỏ hàng`,
        style: { marginTop: '10vh' }
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => message.error("Không thể thêm vào giỏ hàng")
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.toggleWishlist(productId),
    onSuccess: () => {
      message.success("Đã xóa khỏi danh sách yêu thích");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => message.error("Xóa thất bại")
  });

  const handleAddToCart = (e: React.MouseEvent, p: ProductItem) => {
    e.stopPropagation();
    if (!token) return navigate("/login");
    addToCartMutation.mutate(p);
  };

  const handleRemove = (e: React.MouseEvent, productId: number | string) => {
    e.stopPropagation();
    if (!token) return navigate("/login");
    removeMutation.mutate(Number(productId));
  };

  const handleCardClick = (productId: number | string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="wishlist-page dark-aesthetic">
      <div className="container">
        <div className="page-header">
          <h2>Danh Sách Yêu Thích</h2>
          <p style={{ color: '#888' }}>Những tuyệt phẩm bạn đã chọn lựa để chăm sóc vẻ đẹp của mình.</p>
        </div>

        {loading ? (
          <Row gutter={[30, 30]}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <div className="fav-skel-card">
                  <Skeleton active paragraph={{ rows: 5 }} />
                </div>
              </Col>
            ))}
          </Row>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có sản phẩm nào trong danh sách yêu thích của bạn." 
            />
            <button className="ghost-btn" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <Row gutter={[30, 30]}>
            {items.map((item) => {
              const p = item.productData || {};
              const img = p.image || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400";
              const productId = item.productId || item.id;
              
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={String(item.id)}>
                  <div className="fav-card" onClick={() => handleCardClick(productId)}>
                    <div className="product-img-wrap">
                      <img alt={p.name} src={img} />
                      <button 
                        className="wish-btn-overlay" 
                        onClick={(e) => handleRemove(e, productId)}
                        title="Xóa khỏi yêu thích"
                      >
                        <HeartFilled />
                      </button>
                    </div>

                    <div className="product-meta">
                      <div className="product-name">{p.name || "Sản phẩm"}</div>
                      <div className="product-price">{p.price ? `${Number(p.price).toLocaleString()}₫` : "—"}</div>
                      <div className={`stock ${Number(p.stock ?? 0) > 0 ? 'in' : 'out'}`}>
                        {Number(p.stock ?? 0) > 0 ? (
                          <><CheckCircleOutlined /> Còn hàng</>
                        ) : (
                          <><CloseCircleOutlined /> Hết hàng</>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />} 
                        onClick={(e) => handleAddToCart(e, p)}
                        disabled={Number(p.stock ?? 0) <= 0}
                      >
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
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
