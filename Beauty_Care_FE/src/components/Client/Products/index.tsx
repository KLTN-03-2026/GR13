import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { message } from "antd";
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  Pagination,
  Rate,
  Select,
  Slider,
  Spin,
  Row,
  Col,
  Typography,
} from "antd";
import axios from "axios";
import {
  FilterOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// Import trực tiếp file SCSS
import "./style.scss";
// Products will be fetched from API

const ProductsComponent = () => {
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [sortKey, setSortKey] = useState<string>("popular");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      message.error('Bạn phải đăng nhập để tiếp tục');
    } else {
      message.success('Đã thêm vào giỏ hàng thành công!');
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("http://localhost:8088/api/v1/product")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const items = Array.isArray(data) ? data : [];
          const mapped = items.map((p: any) => ({
          id: p.id ?? p.productId ?? "",
          name: p.name ?? p.productName ?? "",
          image: p.image ?? p.thumbnail ?? "",
          category: p.categoryData?.name ?? p.category ?? "",
          price: Number(p.price ?? 0),
          originalPrice: p.discountPrice ?? p.originalPrice ?? null,
          rating: Number(p.rating ?? 4.5),
          reviews: Number(p.reviews ?? 0),
          isNew: Boolean(p.isNew ?? false),
          inStock: Number(p.stock ?? 0) > 0,
        }));
        if (mounted) setProducts(mapped);
        if (items.length === 0) message.info("Không tìm thấy sản phẩm");
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        message.error("Không thể lấy danh sách sản phẩm");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Logic Lọc sản phẩm
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const name = (p.name ?? "").toString();
        const price = Number(p.price ?? 0);
        const matchQuery = name.toLowerCase().includes(query.toLowerCase());
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        const matchPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchQuery && matchCategory && matchPrice;
      })
      .sort((a, b) => {
        if (sortKey === "price-asc") return Number(a.price ?? 0) - Number(b.price ?? 0);
        if (sortKey === "price-desc") return Number(b.price ?? 0) - Number(a.price ?? 0);
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      });
  }, [products, query, selectedCategories, priceRange, sortKey]);

  const pageSize = 9;
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const FilterPanel = (
    <div className="filter-panel-content">
      <div className="filter-group">
        <h4 className="filter-label">Danh mục sản phẩm</h4>
        <Checkbox.Group 
          options={["Serum", "Kem dưỡng", "Làm sạch", "Toner", "Chống nắng"]} 
          value={selectedCategories}
          onChange={(v) => setSelectedCategories(v as string[])}
        />
      </div>
      <div className="filter-group">
        <h4 className="filter-label">Khoảng giá (VND)</h4>
        <Slider range min={0} max={2000000} step={50000} value={priceRange} onChange={(v) => setPriceRange(v as [number, number])} />
        <div className="price-display">
          <span>{priceRange[0].toLocaleString()}đ</span>
          <span>{priceRange[1].toLocaleString()}đ</span>
        </div>
      </div>
      <Button className="reset-btn" block onClick={() => {setQuery(""); setSelectedCategories([]); setPriceRange([0, 2000000]);}}>
        Xoá tất cả bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="products-page">
      {/* 1. HERO SECTION LUXURY */}
      <section className="hero-banner">
        <div className="container">
          <Row gutter={[60, 0]} align="middle">
            <Col xs={24} md={12}>
              <Typography.Text className="hero-badge">SUMMER COLLECTION 2026</Typography.Text>
              <Typography.Title level={1} className="hero-title">
                Đánh thức vẻ đẹp <br/> <span>từ sâu bên trong</span>
              </Typography.Title>
              <Typography.Paragraph className="hero-desc">
                Khám phá dòng sản phẩm Botanical Radiance mới nhất - Sự kết hợp hoàn hảo giữa thảo dược quý hiếm và công nghệ tế bào.
              </Typography.Paragraph>
              <Button className="hero-btn">MUA NGAY BỘ SƯU TẬP</Button>
            </Col>
            <Col xs={24} md={12}>
              <div className="hero-img-box">
                <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800" alt="Hero" />
                <div className="floating-card">
                  <strong>98%</strong>
                  <span>Gốc tự nhiên</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. TOOLBAR */}
      <div className="container">
        <div className="products-toolbar">
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Tìm kiếm sản phẩm sắc đẹp..." 
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="toolbar-right">
            <Button className="mobile-filter-btn" icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>Bộ lọc</Button>
            <Select 
              value={sortKey} 
              onChange={setSortKey} 
              className="sort-select"
              options={[
                { value: "popular", label: "Phổ biến nhất" },
                { value: "price-asc", label: "Giá: Thấp đến Cao" },
                { value: "price-desc", label: "Giá: Cao đến Thấp" },
              ]} 
            />
          </div>
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="main-layout">
          <aside className="sidebar-filters">{FilterPanel}</aside>
          
          <div className="results-area">
            {loading ? (
              <div className="loading-center" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <div className="results-grid">
                  {pageItems.map((p) => (
                    <div
                      key={p.id}
                      className={`product-card ${!p.inStock ? 'out-of-stock' : ''}`}
                      onClick={() => navigate(`/products/${p.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-media">
                        <img src={p.image} alt={p.name} />
                        {p.isNew && <span className="tag-new">MỚI</span>}
                        {!p.inStock && <div className="overlay-out">Hết hàng</div>}
                        <button className="wish-btn"><HeartOutlined /></button>
                      </div>
                      <div className="card-body">
                        <span className="card-cat">{p.category}</span>
                        <h3 className="card-title">{p.name}</h3>
                        <div className="card-rating">
                          <Rate disabled defaultValue={Number(p.rating ?? 0)} style={{ fontSize: 12 }} />
                          <span>({p.reviews ?? 0})</span>
                        </div>
                        <div className="card-price">
                          <span className="current-price">{Number(p.price ?? 0).toLocaleString()}đ</span>
                          {p.originalPrice && <span className="old-price">{Number(p.originalPrice).toLocaleString()}đ</span>}
                        </div>
                        <button className="add-cart-btn" disabled={!p.inStock} onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}>
                          <ShoppingCartOutlined /> THÊM VÀO GIỎ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pagination-box">
                  <Pagination 
                    current={page} 
                    total={filtered.length} 
                    pageSize={pageSize} 
                    onChange={setPage} 
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Drawer title="Bộ lọc sản phẩm" placement="left" onClose={() => setDrawerOpen(false)} open={drawerOpen}>
        {FilterPanel}
      </Drawer>
    </div>
  );
};

export default ProductsComponent;