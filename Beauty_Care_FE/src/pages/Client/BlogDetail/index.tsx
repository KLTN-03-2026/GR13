import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './style.module.scss';

// Định nghĩa lại Interface để khớp với trang danh sách
interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string; // Thêm trường nội dung chi tiết
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  // Giả lập lấy dữ liệu từ danh sách 10 bài viết (Thực tế sẽ gọi API)
  useEffect(() => {
    const mockArticles: Article[] = [
      { 
        id: 1, 
        category: 'Skincare', 
        title: '10 Bước dưỡng da chuẩn Hàn cho nàng bận rộn', 
        date: '2026-03-17', 
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200', 
        content: `Dưỡng da chuẩn Hàn (K-Beauty) không nhất thiết phải tốn hàng giờ đồng hồ. Đối với những nàng bận rộn, quy trình 10 bước có thể rút gọn nhưng vẫn giữ được những bước cốt lõi: Làm sạch kép, Toner cân bằng, Serum đặc trị và Kem dưỡng khóa ẩm. 
        
        Bí quyết nằm ở việc thấu hiểu làn da và lựa chọn sản phẩm đa năng. Hãy bắt đầu bằng một loại dầu tẩy trang dịu nhẹ để loại bỏ bụi bẩn, sau đó là sữa rửa mặt dạng gel để làm sạch sâu mà không gây khô da...`
      },
      { 
        id: 2,
        category: 'Skincare', 
        title: '10 Bước dưỡng da chuẩn Hàn cho nàng bận rộn', 
        date: '2026-03-17', 
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200', 
        content: `Dưỡng da chuẩn Hàn (K-Beauty) không nhất thiết phải tốn hàng giờ đồng hồ. Đối với những nàng bận rộn, quy trình 10 bước có thể rút gọn nhưng vẫn giữ được những bước cốt lõi: Làm sạch kép, Toner cân bằng, Serum đặc trị và Kem dưỡng khóa ẩm. 
        
        Bí quyết nằm ở việc thấu hiểu làn da và lựa chọn sản phẩm đa năng. Hãy bắt đầu bằng một loại dầu tẩy trang dịu nhẹ để loại bỏ bụi bẩn, sau đó là sữa rửa mặt dạng gel để làm sạch sâu mà không gây khô da...`
      },
    ];

    const found = mockArticles.find(a => a.id === Number(id));
    setArticle(found || null);
    
    // Cuộn lên đầu trang khi vào trang chi tiết
    window.scrollTo(0, 0);
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
          <Link to="/">Trang chủ</Link> <span>/</span> <Link to="/blog">Blog</Link> <span>/</span> {article.title}
        </div>

        <div className={styles.mainWrapper}>
          {/* Nội dung bài viết */}
          <div className={styles.articleBody}>
            <p className={styles.leadText}>
              Làm đẹp là một hành trình thấu hiểu bản thân. Trong bài viết này, BeautyCare sẽ cùng bạn khám phá những bí mật đằng sau vẻ rạng rỡ của làn da.
            </p>
            <div className={styles.richText}>
              {article.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            
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
    </article>
  );
};

export default BlogDetailPage;