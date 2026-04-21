import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Rate, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../../../../hooks/useAuth';
import './style.scss';

const SAMPLE_PRODUCT = {
  id: "p-1",
  name: "Serum Phục Hồi Skin Reset",
  image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
  category: "Serum",
  skinTypes: ["Da nhạy cảm"],
  price: 790000,
  originalPrice: 990000,
  rating: 4.8,
  reviews: 1240,
  description: "Serum phục hồi da chuyên sâu với công thức chứa các thành phần tự nhiên giúp tái tạo và phục hồi làn da bị tổn thương. Phù hợp cho mọi loại da, đặc biệt là da nhạy cảm.",
  ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide", "Peptides", "Chamomile Extract"],
  benefits: [
    "Phục hồi da bị tổn thương",
    "Giảm viêm và đỏ da",
    "Tăng cường độ ẩm",
    "Làm sáng da đều màu",
    "Tái tạo collagen"
  ],
  usage: "Sử dụng buổi sáng và tối sau khi làm sạch da. Thoa một lượng nhỏ lên mặt và massage nhẹ nhàng cho đến khi thẩm thấu hoàn toàn.",
  inStock: true
};

const ProductsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  // Trong thực tế sẽ fetch từ API dựa trên id
  const product = SAMPLE_PRODUCT; // Giả sử lấy được product dựa trên id

  const handleAddToCart = () => {
    if (!user) {
      message.error('Bạn phải đăng nhập để tiếp tục');
      return;
    }
    message.success('Đã thêm vào giỏ hàng thành công!');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return <div className="productDetailPage">Sản phẩm không tồn tại</div>;
  }

  return (
    <div className="productDetailPage">
      <div className="backButton">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/products')}
          className="backBtn"
        >
          Quay lại danh sách sản phẩm
        </Button>
      </div>

      <div className="productDetailContainer">
        <div className="productImages">
          <div className="mainImage">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        
        <div className="productInfo">
          <div className="productHeader">
            <span className="category">{product.category}</span>
            <h1 className="productName">{product.name}</h1>
            <div className="ratingSection">
              <Rate disabled defaultValue={product.rating} style={{ fontSize: 16 }} />
              <span className="ratingText">({product.reviews} đánh giá)</span>
            </div>
          </div>

          <div className="priceSection">
            <span className="currentPrice">{product.price.toLocaleString()}đ</span>
            {product.originalPrice && (
              <span className="originalPrice">{product.originalPrice.toLocaleString()}đ</span>
            )}
          </div>

          <div className="productMeta">
            <div className="metaItem">
              <strong>Loại da phù hợp:</strong> {product.skinTypes.join(', ')}
            </div>
            <div className="metaItem">
              <strong>Tình trạng:</strong> {product.inStock ? 'Còn hàng' : 'Hết hàng'}
            </div>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="productDescription">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
          </div>

          {/* Thành phần */}
          <div className="productIngredients">
            <h3>Thành phần chính</h3>
            <ul>
              {product.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Lợi ích */}
          <div className="productBenefits">
            <h3>Lợi ích</h3>
            <ul>
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Cách sử dụng */}
          <div className="productUsage">
            <h3>Cách sử dụng</h3>
            <p>{product.usage}</p>
          </div>

          {/* Phần thêm vào giỏ hàng */}
          {product.inStock && (
            <div className="addToCartSection">
              <div className="quantitySelector">
                <Button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="quantity">{quantity}</span>
                <Button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                className="addToCartBtn"
              >
                Thêm vào giỏ hàng
              </Button>

              <Button
                size="large"
                icon={<HeartOutlined />}
                className="wishlistBtn"
              >
                Yêu thích
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;