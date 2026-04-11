import React from 'react';
import { Link } from 'react-router-dom';
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
  const articles: Article[] = [
    { id: 1, category: 'Skincare', title: '10 Bước dưỡng da chuẩn Hàn cho nàng bận rộn', date: '2026-03-17', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', summary: 'Khám phá bí quyết sở hữu làn da thủy tinh chỉ với 10 phút mỗi tối...' },
    { id: 2, category: 'Makeup', title: 'Xu hướng trang điểm Clean Girl 2026', date: '2026-03-16', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', summary: 'Phong cách trang điểm tự nhiên, tôn vinh nét đẹp nguyên bản đang lên ngôi...' },
    { id: 3, category: 'Haircare', title: 'Bí quyết phục hồi tóc hư tổn sau khi tẩy', date: '2026-03-15', image: 'https://images.unsplash.com/photo-1560869713-7d0a294308b3?w=500', summary: 'Đừng để mái tóc xơ rối làm bạn mất tự tin. Hãy thử ngay 5 loại mặt nạ này...' },
    { id: 4, category: 'Wellness', title: 'Chế độ ăn uống giúp da sáng khỏe từ bên trong', date: '2026-03-14', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500', summary: 'Những thực phẩm vàng bạn cần bổ sung vào thực đơn hàng ngày để có làn da đẹp...' },
    { id: 5, category: 'Skincare', title: 'Review chi tiết các dòng Serum Vitamin C hot nhất', date: '2026-03-13', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', summary: 'Vitamin C là hoạt chất không thể thiếu, nhưng chọn loại nào phù hợp với da bạn?' },
    { id: 6, category: 'Fragrance', title: 'Top 5 mùi hương nước hoa ngọt ngào cho mùa xuân', date: '2026-03-12', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', summary: 'Những nốt hương hoa cỏ nhẹ nhàng giúp bạn thêm phần quyến rũ...' },
    { id: 7, category: 'Nails', title: 'BST Mẫu móng tay Pastel đơn giản sang trọng', date: '2026-03-11', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500', summary: 'Nếu bạn yêu thích sự thanh lịch, đừng bỏ qua những mẫu nails tone màu pastel...' },
    { id: 8, category: 'Skincare', title: 'Kem chống nắng vật lý hay hóa học tốt hơn?', date: '2026-03-10', image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500', summary: 'Phân tích ưu nhược điểm của hai loại KCN phổ biến nhất hiện nay...' },
    { id: 9, category: 'Yoga', title: '5 Bài tập Yoga giúp trẻ hóa làn da hiệu quả', date: '2026-03-09', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', summary: 'Luyện tập mỗi ngày giúp máu lưu thông, mang lại vẻ rạng rỡ cho khuôn mặt...' },
    { id: 10, category: 'Makeup', title: 'Cách kẻ mắt mèo chuẩn xác cho người mới bắt đầu', date: '2026-03-08', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500', summary: 'Đừng lo lắng nếu tay bạn còn run, hãy áp dụng mẹo nhỏ sau đây...' },
  ];

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Beauty Journal</h2>
          <p className={styles.subtitle}>Nơi chia sẻ bí quyết và cảm hứng làm đẹp mỗi ngày</p>
        </div>
        
        <div className={styles.grid}>
          {articles.map((article) => (
            <article key={article.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={article.image} alt={article.title} className={styles.image} />
                <span className={styles.category}>{article.category}</span>
              </div>
              <div className={styles.content}>
                <p className={styles.date}>{article.date}</p>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.summary}>{article.summary}</p>
                <Link to={`/blog/${article.id}`} className={styles.readMore}>
                  Đọc thêm <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;