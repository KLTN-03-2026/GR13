import "./style.scss";
import product1 from "../../../assets/images/698617cdf791d6d2cdb0bcc0_skincare-routine-reset.webp";
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  Pagination,
  Rate,
  Select,
  Slider,
  Tag,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import {
  FilterOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";

const { Title, Text, Paragraph } = Typography;

type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
  skinTypes: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  inStock: boolean;
};

const formatVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

const getDiscountPercent = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Serum Phục Hồi Skin Reset",
    image: product1,
    category: "Serum",
    skinTypes: ["Da nhạy cảm", "Da khô"],
    price: 790000,
    originalPrice: 990000,
    rating: 4.8,
    reviews: 1240,
    isNew: true,
    inStock: true,
  },
  {
    id: "p-2",
    name: "Kem Dưỡng Glow & Hydrate",
    image: product1,
    category: "Kem dưỡng",
    skinTypes: ["Da khô", "Da thiếu nước"],
    price: 690000,
    originalPrice: 850000,
    rating: 4.7,
    reviews: 980,
    inStock: true,
  },
  {
    id: "p-3",
    name: "Sữa Rửa Mặt Dịu Nhẹ pH 5.5",
    image: product1,
    category: "Làm sạch",
    skinTypes: ["Da dầu", "Da hỗn hợp", "Da nhạy cảm"],
    price: 320000,
    rating: 4.6,
    reviews: 1523,
    inStock: true,
  },
  {
    id: "p-4",
    name: "Toner Cân Bằng & Làm Dịu",
    image: product1,
    category: "Toner",
    skinTypes: ["Da nhạy cảm", "Da hỗn hợp"],
    price: 420000,
    originalPrice: 520000,
    rating: 4.5,
    reviews: 640,
    inStock: true,
  },
  {
    id: "p-5",
    name: "Kem Chống Nắng SPF50+ PA++++",
    image: product1,
    category: "Chống nắng",
    skinTypes: ["Da dầu", "Da hỗn hợp", "Da khô"],
    price: 540000,
    originalPrice: 640000,
    rating: 4.9,
    reviews: 2311,
    inStock: true,
  },
  {
    id: "p-6",
    name: "Mặt Nạ Cấp Ẩm Đa Tầng",
    image: product1,
    category: "Mặt nạ",
    skinTypes: ["Da thiếu nước", "Da khô"],
    price: 220000,
    originalPrice: 300000,
    rating: 4.4,
    reviews: 510,
    inStock: false,
  },
  {
    id: "p-7",
    name: "Tinh Chất Giảm Mụn & Giảm Dầu",
    image: product1,
    category: "Serum",
    skinTypes: ["Da dầu", "Da mụn"],
    price: 650000,
    originalPrice: 820000,
    rating: 4.6,
    reviews: 888,
    inStock: true,
  },
  {
    id: "p-8",
    name: "Kem Dưỡng Nâng Cơ Lift Therapy",
    image: product1,
    category: "Kem dưỡng",
    skinTypes: ["Chống lão hoá", "Da thường"],
    price: 1150000,
    originalPrice: 1390000,
    rating: 4.8,
    reviews: 412,
    isNew: true,
    inStock: true,
  },
  {
    id: "p-9",
    name: "Xịt Khoáng Phục Hồi Hàng Rào Da",
    image: product1,
    category: "Xịt khoáng",
    skinTypes: ["Da nhạy cảm", "Da khô", "Da thường"],
    price: 280000,
    rating: 4.3,
    reviews: 290,
    inStock: true,
  },
  {
    id: "p-10",
    name: "Tẩy Tế Bào Chết Dịu Nhẹ (AHA/PHA)",
    image: product1,
    category: "Tẩy da chết",
    skinTypes: ["Da hỗn hợp", "Da thường"],
    price: 460000,
    originalPrice: 560000,
    rating: 4.5,
    reviews: 730,
    inStock: true,
  },
  {
    id: "p-11",
    name: "Sản phẩm Dưỡng Ẩm Cho Da Dầu",
    image: product1,
    category: "Kem dưỡng",
    skinTypes: ["Da dầu", "Da mụn"],
    price: 590000,
    rating: 4.2,
    reviews: 180,
    inStock: true,
  },
  {
    id: "p-12",
    name: "Serum Làm Sáng Đều Màu",
    image: product1,
    category: "Serum",
    skinTypes: ["Da thường", "Da hỗn hợp"],
    price: 890000,
    originalPrice: 1090000,
    rating: 4.7,
    reviews: 560,
    inStock: true,
  },
];

const ProductsComponent = () => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortKey, setSortKey] = useState<string>("popular");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.category));
    return Array.from(set);
  }, []);

  const skinTypes = useMemo(() => {
    const set = new Set(PRODUCTS.flatMap((p) => p.skinTypes));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = PRODUCTS.filter((p) => {
      const matchQuery = q.length === 0 || p.name.toLowerCase().includes(q);
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      const matchSkin =
        selectedSkinTypes.length === 0 ||
        p.skinTypes.some((t) => selectedSkinTypes.includes(t));
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      const matchDiscount =
        !onlyDiscount || getDiscountPercent(p.price, p.originalPrice) > 0;
      const matchStock = !onlyInStock || p.inStock;
      return (
        matchQuery &&
        matchCategory &&
        matchSkin &&
        matchPrice &&
        matchRating &&
        matchDiscount &&
        matchStock
      );
    });

    result.sort((a, b) => {
      if (sortKey === "price-asc") return a.price - b.price;
      if (sortKey === "price-desc") return b.price - a.price;
      if (sortKey === "rating-desc") return b.rating - a.rating;
      if (sortKey === "discount-desc")
        return (
          getDiscountPercent(b.price, b.originalPrice) -
          getDiscountPercent(a.price, a.originalPrice)
        );
      if (sortKey === "newest")
        return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      return b.reviews - a.reviews;
    });

    return result;
  }, [
    minRating,
    onlyDiscount,
    onlyInStock,
    priceRange,
    query,
    selectedCategories,
    selectedSkinTypes,
    sortKey,
  ]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    setPriceRange([0, 1500000]);
    setMinRating(0);
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setSortKey("popular");
    setPage(1);
  };

  const FilterPanel = (
    <div className="products-filters__panel">
      <div className="filter-section">
        <div className="filter-title">Danh mục</div>
        <Checkbox.Group
          className="filter-checkboxes"
          value={selectedCategories}
          onChange={(vals) => {
            setSelectedCategories(vals as string[]);
            setPage(1);
          }}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Loại da</div>
        <Checkbox.Group
          className="filter-checkboxes"
          value={selectedSkinTypes}
          onChange={(vals) => {
            setSelectedSkinTypes(vals as string[]);
            setPage(1);
          }}
          options={skinTypes.map((c) => ({ label: c, value: c }))}
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Khoảng giá</div>
        <div className="filter-price">
          <div className="filter-price__row">
            <span>{formatVnd(priceRange[0])}</span>
            <span>{formatVnd(priceRange[1])}</span>
          </div>
          <Slider
            range
            min={0}
            max={1500000}
            step={50000}
            value={priceRange}
            onChange={(val) => {
              setPriceRange(val as [number, number]);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Đánh giá</div>
        <div className="filter-rating">
          {[0, 4, 4.5].map((v) => (
            <button
              key={v}
              className={`filter-rating__item ${minRating === v ? "is-active" : ""}`}
              onClick={() => {
                setMinRating(v);
                setPage(1);
              }}
              type="button"
            >
              <Rate allowHalf disabled value={v === 0 ? 0 : v} />
              <span className="filter-rating__text">
                {v === 0 ? "Tất cả" : `Từ ${v} trở lên`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Tuỳ chọn</div>
        <div className="filter-toggles">
          <Checkbox
            checked={onlyDiscount}
            onChange={(e) => {
              setOnlyDiscount(e.target.checked);
              setPage(1);
            }}
          >
            Đang giảm giá
          </Checkbox>
          <Checkbox
            checked={onlyInStock}
            onChange={(e) => {
              setOnlyInStock(e.target.checked);
              setPage(1);
            }}
          >
            Còn hàng
          </Checkbox>
        </div>
      </div>

      <div className="filter-actions">
        <Button className="filter-reset" onClick={resetFilters}>
          Xoá bộ lọc
        </Button>
      </div>
    </div>
  );

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero-section">
        <div className="products-container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={12}>
              <div className="hero-image-wrapper" style={{ height: "500px" }}>
                <img
                  src="https://res.cloudinary.com/dfsv98v6q/image/upload/v1740674100/659620060006da09be0bc90c_Hero_Image_p-800_dqzvxz.webp"
                  alt="Botanical Radiance Elixir"
                  className="hero-image"
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="hero-content">
                <Text className="hero-subtitle">BOTANICAL COLLECTION</Text>
                <Title level={1} className="hero-title">
                  Botanical Radiance Elixir
                </Title>
                <Paragraph className="hero-description">
                  A transformative infusion designed to restore the skin's
                  natural luminosity through the precision of cellular alchemy.
                </Paragraph>
                <div className="hero-price-row">
                  <span className="hero-price">$120</span>
                  <span className="hero-size">30ml / 1.0 fl. oz</span>
                </div>
                <Button className="hero-cta-btn" size="large">
                  ADD TO CEREMONY
                </Button>
                <div className="hero-features">
                  <div className="feature-item">
                    <span className="feature-value">98%</span>
                    <span className="feature-label">NATURAL ORIGIN</span>
                  </div>
                  <div className="feature-divider" />
                  <div className="feature-item">
                    <span className="feature-value">Vegan</span>
                    <span className="feature-label">CRUELTY FREE</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Category Navigation - Removed because we use Sidebar now */}

      <div className="products-container">
        <div className="products-toolbar">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            allowClear
            placeholder="Tìm sản phẩm (serum, kem dưỡng, chống nắng...)"
            className="products-search"
            size="large"
          />

          <div className="products-toolbar__right">
            <Button
              className="products-filterBtn"
              icon={<FilterOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Bộ lọc
            </Button>
            <Select
              className="products-sort"
              value={sortKey}
              onChange={(v) => {
                setSortKey(v);
                setPage(1);
              }}
              size="large"
              options={[
                { value: "popular", label: "Phổ biến" },
                { value: "newest", label: "Mới nhất" },
                { value: "rating-desc", label: "Đánh giá cao" },
                { value: "discount-desc", label: "Giảm giá nhiều" },
                { value: "price-asc", label: "Giá tăng dần" },
                { value: "price-desc", label: "Giá giảm dần" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="products-container products-main">
        <aside className="products-filters">{FilterPanel}</aside>

        <section className="products-results">
          <div className="products-results__meta">
            <div className="products-count">{filtered.length} sản phẩm</div>
            <div className="products-metaTags">
              {onlyDiscount && <Tag color="green">Giảm giá</Tag>}
              {onlyInStock && <Tag color="blue">Còn hàng</Tag>}
              {minRating > 0 && <Tag color="gold">Từ {minRating}★</Tag>}
            </div>
          </div>

          <div className="products-grid">
            {pageItems.map((p) => {
              const discount = getDiscountPercent(p.price, p.originalPrice);
              return (
                <article
                  className={`product-card ${!p.inStock ? "is-out" : ""}`}
                  key={p.id}
                >
                  <div className="product-card__media">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-card__img"
                    />
                    <div className="product-card__badges">
                      {p.isNew && <span className="badge badge--new">Mới</span>}
                      {discount > 0 && (
                        <span className="badge badge--off">-{discount}%</span>
                      )}
                      {!p.inStock && (
                        <span className="badge badge--out">Hết hàng</span>
                      )}
                    </div>
                    <button
                      className="product-card__wish"
                      type="button"
                      aria-label="Yêu thích"
                    >
                      <HeartOutlined />
                    </button>
                  </div>

                  <div className="product-card__body">
                    <div className="product-card__category">{p.category}</div>
                    <h3 className="product-card__title">{p.name}</h3>

                    <div className="product-card__rating">
                      <Rate allowHalf disabled value={p.rating} />
                      <span className="product-card__reviews">
                        ({p.reviews})
                      </span>
                    </div>

                    <div className="product-card__price">
                      <span className="product-card__priceNow">
                        {formatVnd(p.price)}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="product-card__priceOld">
                          {formatVnd(p.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="product-card__tags">
                      {p.skinTypes.slice(0, 2).map((t) => (
                        <span className="product-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="product-card__actions">
                      <button
                        className="product-card__btn"
                        type="button"
                        disabled={!p.inStock}
                      >
                        <ShoppingCartOutlined />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="products-pagination">
            <Pagination
              current={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(p) => setPage(p)}
            />
          </div>
        </section>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        title="Bộ lọc sản phẩm"
        className="products-drawer"
      >
        {FilterPanel}
      </Drawer>
    </div>
  );
};
export default ProductsComponent;
