import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import { useQuery } from '@tanstack/react-query';
import { Empty, Skeleton, Button, Spin, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Apply Vietnamese locale globally for dayjs
dayjs.locale('vi');

interface Article {
  id: number | string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page and clear articles when filters change
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
  }, [debouncedQuery, activeCategory]);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['blogs', debouncedQuery, activeCategory, page],
    queryFn: async () => {
      // Increased limit to 20 to better populate category groups
      let url = `http://localhost:8088/api/v1/blog?limit=20&page=${page}`;
      if (debouncedQuery) {
        url += `&search=${encodeURIComponent(debouncedQuery)}`;
      }
      if (activeCategory !== "All") {
        url += `&category=${encodeURIComponent(activeCategory)}`;
      }
      const res = await axios.get(url);
      return res.data;
    },
  });

  // Append data when fetch completes
  useEffect(() => {
    if (data) {
      const payload = data?.data || data;
      const items = Array.isArray(payload?.items) 
        ? payload.items 
        : Array.isArray(payload) 
          ? payload 
          : Array.isArray(data?.items) 
            ? data.items 
            : [];
            
      const mapped = items.map((item: any) => ({
        id: item.id || item._id,
        title: item.title,
        summary: item.desc || item.summary || item.description || "Bài viết chia sẻ những kiến thức làm đẹp chuyên sâu, giúp bạn nuôi dưỡng làn da khỏe mạnh từ bên trong.",
        date: item.createdAt ? dayjs(item.createdAt).format('DD [Tháng] MM, YYYY') : (item.date || ""),
        category: item.blogCategoryData?.name || item.category || "Uncategorized",
        image: item.image || item.thumbnail || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
      }));

      if (page === 1) {
        setArticles(mapped);
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newUnique = mapped.filter((m: Article) => !existingIds.has(m.id));
          return [...prev, ...newUnique];
        });
      }

      if (mapped.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data, page]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isFetching]);

  // Extract featured article and group the rest
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.length > 1 ? articles.slice(1) : [];

  const groupedArticles = useMemo(() => {
    const groups: Record<string, Article[]> = {};
    remainingArticles.forEach(article => {
      if (!groups[article.category]) {
        groups[article.category] = [];
      }
      groups[article.category].push(article);
    });
    return groups;
  }, [remainingArticles]);

  return (
    <div className="blog-page dark-aesthetic">
      
      {/* 1. HERO FEATURE ARTICLE BANNER */}
      {featuredArticle && page === 1 && !isLoading && (
        <section className="blog-hero-banner">
          <div 
            className="hero-bg" 
            style={{ backgroundImage: `url('${featuredArticle.image}')` }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content container">
              <span className="hero-category">{featuredArticle.category}</span>
              <Typography.Title level={1} className="hero-title">
                {featuredArticle.title}
              </Typography.Title>
              <Typography.Paragraph className="hero-desc">
                {featuredArticle.summary}
              </Typography.Paragraph>
              <Link to={`/blog/${featuredArticle.id}`}>
                <button className="ghost-btn">READ MORE</button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. TOOLBAR (SEARCH & FILTER) */}
      <div className="container">
        <div className="blog-toolbar">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input
              placeholder="Tìm kiếm bài viết..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="glass-input"
            />
          </div>
          <div className="categories-filter">
            {["All", "Skincare", "Makeup", "Tips", "News"].map((c) => (
              <button
                key={c}
                className={`filter-btn ${activeCategory === c ? "active" : ""}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* INITIAL LOADING STATE */}
        {isLoading && page === 1 && (
          <div className="results-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="blog-card dark-card">
                <Skeleton.Image active style={{ width: '100%', height: '220px' }} />
                <div style={{ padding: 24 }}>
                  <Skeleton active paragraph={{ rows: 3 }} title={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && articles.length === 0 && (
          <div className="empty-state">
            <Empty 
              description={<span className="empty-text">Không tìm thấy bài viết nào phù hợp</span>}
            >
              <Button 
                className="ghost-btn"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
              >
                Xóa bộ lọc
              </Button>
            </Empty>
          </div>
        )}

        {/* 3. GROUPED EDITORIAL GRID */}
        {articles.length > 0 && (
          <div className="blog-groups-container">
            {Object.keys(groupedArticles).map((categoryName) => (
              <section key={categoryName} className="category-section">
                <Typography.Title level={2} className="category-title">
                  {categoryName}
                </Typography.Title>
                
                <div className="results-grid">
                  {groupedArticles[categoryName].map((article) => (
                    <div key={article.id} className="blog-card dark-card">
                      <div className="card-media">
                        <img src={article.image} alt={article.title} loading="lazy" />
                      </div>
                      <div className="card-body">
                        <span className="card-date">{article.date}</span>
                        <h3 className="card-title">{article.title}</h3>
                        <p className="card-desc">{article.summary}</p>
                        <Link to={`/blog/${article.id}`} className="read-more-link">
                          Đọc thêm →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* INFINITE SCROLL TARGET */}
        {hasMore && articles.length > 0 && (
          <div ref={observerTarget} className="infinite-scroll-target">
            {isFetching && (
              <div className="infinite-loading">
                <Spin size="large" />
                <span>Đang tải thêm...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;