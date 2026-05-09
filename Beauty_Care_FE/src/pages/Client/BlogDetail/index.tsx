import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './style.module.scss';
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
  content: string; 
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  // Fetch real data from API
  useEffect(() => {
    if (!id) return;
    
    axios.get(`http://localhost:8088/api/v1/blog/${id}`)
      .then(res => {
        const item = res.data?.data ?? res.data;
        if (item) {
          setArticle({
            id: item.id || item._id,
            title: item.title,
            content: item.content || "",
            date: item.createdAt ? dayjs(item.createdAt).format('DD [Tháng] MM, YYYY') : (item.date || ""),
            category: item.blogCategoryData?.name || item.category || "Uncategorized",
            image: item.image || item.thumbnail || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200",
          });

          // Fetch related articles based on category
          const categoryQuery = item.blogCategoryData?.name || item.category || "Uncategorized";
          axios.get(`http://localhost:8088/api/v1/blog?category=${encodeURIComponent(categoryQuery)}&limit=10`)
            .then(relRes => {
              const data = relRes.data?.data?.items || relRes.data?.data || relRes.data;
              const items = Array.isArray(data) ? data : [];
              const mapped = items
                .filter((r: any) => String(r.id || r._id) !== String(id))
                .slice(0, 3)
                .map((r: any) => ({
                  id: r.id || r._id,
                  title: r.title,
                  date: r.createdAt ? dayjs(r.createdAt).format('DD [Tháng] MM, YYYY') : "",
                  category: r.blogCategoryData?.name || r.category || "Uncategorized",
                  image: r.image || r.thumbnail || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
                  content: ""
                }));
              setRelatedArticles(mapped);
            })
            .catch(err => console.error("Error fetching related articles", err));
        }
      })
      .catch(err => {
        console.error("Lỗi load chi tiết blog", err);
      });
    
    // Smooth scroll to top when opening a new detail page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!article) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy bài viết</h2>
        <Link to="/blog">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <article className={styles.blogDetail}>
      {/* Banner ảnh bìa lớn */}
      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <img src={article.image} alt={article.title} className={styles.heroImage} />
        <div className={styles.heroContent}>
          <span className={styles.category}>{article.category}</span>
          <h1 className={styles.mainTitle}>{article.title}</h1>
          <p className={styles.meta}>Đăng vào {article.date} • Bởi BeautyCare Editor</p>
        </div>
      </header>

      <div className={styles.container}>
        {/* Thanh điều hướng nhanh */}
        <div className={styles.breadcrumb}>
          <Link to="/">Trang chủ</Link> <span>/</span> <Link to="/blog">Blog</Link> <span>/</span> <span className={styles.activeBreadcrumb}>{article.title}</span>
        </div>

        <div className={styles.mainWrapper}>
          {/* Nội dung bài viết */}
          <div className={styles.articleBody}>
            <p className={styles.leadText}>
              Làm đẹp là một hành trình thấu hiểu bản thân. Trong bài viết này, BeautyCare sẽ cùng bạn khám phá những bí mật đằng sau vẻ rạng rỡ của làn da.
            </p>
            <div className={styles.richText} dangerouslySetInnerHTML={{ __html: article.content }} />
            
            <div className={styles.tags}>
              <span>#BeautyTips</span>
              <span>#SkincareRoutine</span>
              <span>#BeautyCare2026</span>
            </div>
          </div>

          {/* Sidebar bên phải (Gợi ý thêm) */}
          <aside className={styles.sidebar}>
            <div className={styles.authorCard}>
              <h3>Về tác giả</h3>
              <p>Chuyên gia tư vấn sắc đẹp tại BeautyCare với hơn 5 năm kinh nghiệm trong ngành thẩm mỹ.</p>
            </div>
            <div className={styles.relatedBox}>
              <h3>Đăng ký bản tin</h3>
              <p>Nhận những bí quyết làm đẹp mới nhất gửi thẳng vào hòm thư của bạn.</p>
              <input type="email" placeholder="Email của bạn..." />
              <button>Gửi ngay</button>
            </div>
          </aside>
        </div>
      </div>

      {/* BÀI VIẾT LIÊN QUAN */}
      {relatedArticles.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.container}>
            <div className={styles.relatedHeader}>
              <h2>Bài Viết Liên Quan</h2>
              <p>Khám phá thêm những bí quyết làm đẹp khác từ chuyên gia</p>
            </div>
            
            <div className={styles.relatedGrid}>
              {relatedArticles.map(rel => (
                <Link to={`/blog/${rel.id}`} key={rel.id} className={styles.relatedCard}>
                  <div className={styles.relatedImage}>
                    <img src={rel.image} alt={rel.title} />
                    <span className={styles.relatedCat}>{rel.category}</span>
                  </div>
                  <div className={styles.relatedContent}>
                    <span className={styles.relatedDate}>{rel.date}</span>
                    <h4>{rel.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetailPage;