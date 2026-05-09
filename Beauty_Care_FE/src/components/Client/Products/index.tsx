import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { message, Button, Input, Rate, Select, Spin, Typography } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as cartApi from "../../../api/cart";
import * as wishlistApi from "../../../api/wishlist";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./style.scss";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// --- SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ product, isFavorite, onToggleWishlist, onAddToCart }: any) => {
  const navigate = useNavigate();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFavorite(!localFavorite); // Optimistic Update
    onToggleWishlist(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div
      className={`product-card dark-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="card-media">
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="tag-new">MỚI</span>}
        {!product.inStock && <div className="overlay-out">Hết hàng</div>}
        <button 
          className={`wish-btn ${localFavorite ? 'active' : ''}`} 
          onClick={handleWishlistClick}
        >
          {localFavorite ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>
      <div className="card-body">
        <span className="card-cat">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating">
          <Rate disabled defaultValue={Number(product.rating ?? 0)} style={{ fontSize: 12 }} />
          <span>({product.reviews ?? 0})</span>
        </div>
        <div className="card-price">
          <span className="current-price">{Number(product.price ?? 0).toLocaleString()}đ</span>
          {product.originalPrice && <span className="old-price">{Number(product.originalPrice).toLocaleString()}đ</span>}
        </div>
        <button 
          className="add-cart-btn" 
          disabled={!product.inStock} 
          onClick={handleAddToCartClick}
        >
          <ShoppingCartOutlined /> THÊM VÀO GIỎ
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ProductsComponent = () => {
  const [query, setQuery] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("popular");

  // Fetch Products
  const { data: productsData, isLoading: loading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8088/api/v1/product");
      const data = res.data?.data ?? res.data;
      const items = Array.isArray(data?.items ? data.items : data) ? (data?.items ? data.items : data) : [];
      return items.map((p: any) => ({
        id: p.id ?? p.productId ?? "",
        name: p.name ?? p.productName ?? "",
        image: p.image ?? p.thumbnail ?? "",
        category: p.categoryData?.name ?? p.category ?? "",
        brand: p.brand ?? "Thương hiệu Khác",
        price: Number(p.price ?? 0),
        originalPrice: p.discountPrice ?? p.originalPrice ?? null,
        rating: Number(p.rating ?? 4.5),
        reviews: Number(p.reviews ?? 0),
        isNew: Boolean(p.isNew ?? false),
        inStock: Number(p.stock ?? 0) > 0,
      }));
    }
  });
  const products = productsData ?? [];

  // Fetch Wishlist for IDs
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
    enabled: !!token
  });
  const favoriteIds = useMemo(() => {
    const list = wishlistData?.data ?? wishlistData ?? [];
    return new Set((Array.isArray(list) ? list : []).map((i: any) => i.productId));
  }, [wishlistData]);

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

  const toggleWishlistMutation = useMutation({
    mutationFn: (id: number) => wishlistApi.toggleWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });

  const handleAddToCart = (product: any) => {
    if (!token) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng này");
      return navigate("/login");
    }
    addToCartMutation.mutate(product);
  };

  const handleToggleWishlist = (id: any) => {
    if (!token) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng này");
      return navigate("/login");
    }
    toggleWishlistMutation.mutate(Number(id));
  };

  // Brands & Filtering logic
  const brandsList = useMemo(() => {
    const brands = new Set(products.map((p: any) => p.brand));
    return ["all", ...Array.from(brands)];
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter((p: any) => {
        const name = (p.name ?? "").toString();
        const matchQuery = name.toLowerCase().includes(query.toLowerCase());
        const matchBrand = selectedBrand === "all" || p.brand === selectedBrand;
        return matchQuery && matchBrand;
      })
      .sort((a: any, b: any) => {
        if (sortKey === "price-asc") return a.price - b.price;
        if (sortKey === "price-desc") return b.price - a.price;
        return b.rating - a.rating;
      });
  }, [products, query, selectedBrand, sortKey]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtered.forEach((p: any) => {
      if (!groups[p.brand]) groups[p.brand] = [];
      groups[p.brand].push(p);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="products-page dark-aesthetic">
      {/* 1. HERO SLIDER */}
      <section className="product-hero-slider">
        <Swiper
          modules={[Autoplay, EffectFade, SwiperPagination]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="mySwiper"
        >
          {[
            { 
              title: "KHÁM PHÁ BÍ QUYẾT LÀM ĐẸP", 
              desc: "Ưu đãi đến 30% khi mua trọn bộ chăm sóc sắc đẹp.", 
              img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000" 
            },
            { 
              title: "MUA 1 TẶNG 1 - GIỚI HẠN", 
              desc: "Tỏa sáng rạng rỡ với bộ sưu tập tinh chất phục hồi.", 
              img: "https://images.unsplash.com/photo-1615397323315-46016183377a?q=80&w=2000" 
            }
          ].map((s, i) => (
            <SwiperSlide key={i}>
              <div className="slide-bg" style={{ backgroundImage: `url('${s.img}')` }}>
                <div className="slide-overlay"></div>
                <div className="slide-content container">
                  <Typography.Title level={1} className="slide-title">{s.title}</Typography.Title>
                  <Typography.Paragraph className="slide-desc">{s.desc}</Typography.Paragraph>
                  <button className="ghost-btn">MUA NGAY</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="container">
        {/* 2. TOOLBAR */}
        <div className="products-toolbar">
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Tìm kiếm sản phẩm..." 
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="toolbar-right">
            <Select 
              value={selectedBrand} 
              onChange={setSelectedBrand} 
              className="brand-select dark-select"
              options={brandsList.map(b => ({ value: b, label: b === "all" ? "Tất cả thương hiệu" : b }))} 
            />
            <Select 
              value={sortKey} 
              onChange={setSortKey} 
              className="sort-select dark-select"
              options={[
                { value: "popular", label: "Phổ biến nhất" },
                { value: "price-asc", label: "Giá: Thấp đến Cao" },
                { value: "price-desc", label: "Giá: Cao đến Thấp" },
              ]} 
            />
          </div>
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="results-area">
          {loading ? (
            <div className="loading-center" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>Không tìm thấy sản phẩm nào</p>
              <Button className="ghost-btn" onClick={() => {setQuery(""); setSelectedBrand("all");}}>Xoá bộ lọc</Button>
            </div>
          ) : (
            <div className="brand-groups-container">
              {Object.keys(groupedProducts).map((brandName) => (
                <section key={brandName} className="brand-section">
                  <Typography.Title level={2} className="brand-title">
                    {brandName === "Thương hiệu Khác" ? brandName : `Thương hiệu ${brandName}`}
                  </Typography.Title>
                  <div className="results-grid">
                    {groupedProducts[brandName].map((p) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        isFavorite={favoriteIds.has(Number(p.id))}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsComponent;