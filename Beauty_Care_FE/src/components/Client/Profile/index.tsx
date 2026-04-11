import React, { useState } from 'react';
import styles from './style.module.scss';

// Định nghĩa kiểu dữ liệu cho Đơn hàng
interface Order {
  id: string;
  date: string;
  status: 'shipping' | 'delivered' | 'cancelled';
  total: number;
}

// Định nghĩa kiểu dữ liệu cho User
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
}

const Profile: React.FC = () => {
  // Quản lý tab đang hoạt động
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  const [userData, setUserData] = useState<UserProfile>({
    firstName: 'Nguyễn Trung',
    lastName: 'Đức',
    email: 'nguyentrungduc@gmail.com',
    phone: '+84 912 345 678',
    birthday: '15/06/1995'
  });

  const orders: Order[] = [
    { id: '#BC-99214', date: '12 Th10, 2023', status: 'shipping', total: 3120000 },
    { id: '#BC-88741', date: '28 Th09, 2023', status: 'delivered', total: 2050000 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        
        {/* SIDEBAR BÊN TRÁI */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatarWrapper}>
              <img src="https://i.pravatar.cc/150?u=sophia" alt="User" />
              <button className={styles.editAvatar}>📷</button>
            </div>
            <h3 className={styles.userName}>{userData.firstName} {userData.lastName}</h3>
            <p className={styles.userDate}>Thành viên từ tháng 1, 2023</p>
          </div>
          
          <nav className={styles.sideNav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className={styles.icon}>👤</span> Thông tin cá nhân
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className={styles.icon}>👜</span> Đơn hàng của tôi
            </button>
            <button className={styles.navItem}>
              <span className={styles.icon}>📍</span> Địa chỉ giao hàng
            </button>
            <div className={styles.divider}></div>
            <button className={`${styles.navItem} ${styles.signOut}`}>
              <span className={styles.icon}>📤</span> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* NỘI DUNG CHÍNH */}
        <main className={styles.content}>
          {activeTab === 'profile' && (
            <section className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.serifTitle}>Thông tin cá nhân</h2>
                <span className={styles.secureBadge}>HỒ SƠ BẢO MẬT</span>
              </div>
              
              <form className={styles.profileForm}>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Tên</label>
                    <input 
                      name="firstName"
                      type="text" 
                      className={styles.customInput} 
                      value={userData.firstName} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Họ</label>
                    <input 
                      name="lastName"
                      type="text" 
                      className={styles.customInput} 
                      value={userData.lastName} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Địa chỉ Email</label>
                  <input type="email" className={styles.customInput} value={userData.email} disabled />
                </div>
                <button type="button" className={styles.saveBtn}>Lưu thay đổi</button>
              </form>
            </section>
          )}

          {activeTab === 'orders' && (
            <section className={styles.ordersCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.serifTitle}>Lịch sử đơn hàng</h2>
              </div>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>MÃ ĐƠN</th>
                    <th>NGÀY ĐẶT</th>
                    <th>TRẠNG THÁI</th>
                    <th>TỔNG TIỀN</th>
                    <th>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className={styles.boldText}>{order.id}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                          ● {order.status === 'shipping' ? 'Đang giao' : 'Đã giao'}
                        </span>
                      </td>
                      <td className={styles.boldText}>{order.total.toLocaleString()}₫</td>
                      <td className={styles.actionText}>Chi tiết</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;