import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './style.module.scss';

interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}


const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  // loading state removed (not used)

  // 🚀 CALL API
  useEffect(() => {
    axios.get("http://localhost:8088/api/v1/blog")
      .then(res => {
        const data = res.data?.data ?? res.data;
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        console.error("Lỗi load blog");
      })
      .finally(() => {});
  }, []);

  // 🔍 FILTER + SEARCH
  const filtered = useMemo(() => {
    return articles.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(query.toLowerCase());
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, query, activeCategory]);

  return (
    <section className={styles.blog}>
  <div className={styles.container}>

    {/* HERO */}
    <div className={styles.hero}>
      <div className={styles.heroLeft}>
        <h1>
          Beauty <span>Journal</span>
        </h1>
        <p>Tạp chí làm đẹp cao cấp dành riêng cho bạn</p>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.searchBox}>
          <input
            placeholder="Tìm bài viết..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.categories}>
          {["All", "Skincare", "Makeup", "Tips"].map((c) => (
            <button
              key={c}
              className={activeCategory === c ? styles.active : ""}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* GRID */}
    <div className={styles.grid}>
      {filtered.map((article) => (
        <div key={article.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={article.image} alt={article.title} />
            <span className={styles.category}>{article.category}</span>
          </div>

          <div className={styles.content}>
            <span className={styles.date}>{article.date}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>

            <Link to={`/blog/${article.id}`}>
              Đọc thêm →
            </Link>
          </div>
        </div>
      ))}
    </div>

    {/* LOAD MORE */}
    <div className={styles.loadMore}>
      <button>Xem thêm bài viết →</button>
    </div>
  </div>
</section>
  );
};

export default Blog;