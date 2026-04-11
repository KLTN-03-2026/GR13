import "./style.scss";
import homeBanner from "../../../assets/images/BG_chinh.webp";
import imgSkin from "../../../assets/images/698617cdf791d6d2cdb0bcc0_skincare-routine-reset.webp";
import {
  ScanOutlined,
  ClearOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  HeartOutlined,
  StarFilled,
  CheckCircleFilled,
} from "@ant-design/icons";

const HomeComponent = () => {
  return (
    <div className="home-component">
      <section className="home-hero-v2">
        <div className="home-hero-v2__bg">
          <img
            src={homeBanner}
            alt="Forest Sanctuary"
            className="home-hero-v2__bg-img"
          />
          <div className="home-hero-v2__overlay"></div>
        </div>

        <div className="home-container home-hero-v2__content">
          <div className="home-hero-v2__pill">
            <span className="dot"></span> BeautyCare • Công nghệ làm đẹp
          </div>

          <h1 className="home-hero-v2__title">
            <em>Chăm sóc da chuẩn spa, nâng tầm vẻ đẹp tự nhiên</em>
          </h1>

          <div className="home-hero-v2__actions">
            <button className="hero-btn hero-btn--primary">
              Đặt lịch ngay
            </button>
            <button className="hero-btn hero-btn--secondary">
              Tư vấn miễn phí
            </button>
          </div>

          <div className="home-hero-v2__stats">
            <div className="hero-stat">
              <span className="hero-stat__value">10K+</span>
              <span className="hero-stat__label">KHÁCH HÀNG</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__value">4.9/5</span>
              <span className="hero-stat__label">ĐÁNH GIÁ</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__value">60+</span>
              <span className="hero-stat__label">LIỆU TRÌNH</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="home-section__header">
            <h2 className="home-section__title">Dịch vụ nổi bật</h2>
            <p className="home-section__desc">
              Chọn liệu trình theo nhu cầu: phục hồi, cấp ẩm, làm sáng, nâng cơ
              hoặc chăm sóc chuyên sâu cho da mụn.
            </p>
          </div>
          <div className="home-grid home-grid--3">
            <div className="home-card">
              <div className="home-card__title">Skin Reset</div>
              <div className="img-skin-item">
                <img src={imgSkin} alt="" className="img-skin" />
              </div>
              <div className="home-card__desc">
                Làm sạch sâu, cân bằng dầu, dịu da nhạy cảm và phục hồi hàng rào
                bảo vệ.
              </div>
              <div className="home-card__meta">
                <span className="home-chip">60 phút</span>
                <span className="home-chip">Phù hợp da dầu</span>
              </div>
            </div>
            <div className="home-card">
              <div className="home-card__title">Glow & Hydrate</div>
              <div className="img-skin-item">
                <img src={imgSkin} alt="" className="img-skin" />
              </div>
              <div className="home-card__desc">
                Cấp ẩm đa tầng, giảm xỉn màu, tăng độ bóng khoẻ và mịn màng.
              </div>
              <div className="home-card__meta">
                <span className="home-chip">75 phút</span>
                <span className="home-chip">Da thiếu nước</span>
              </div>
            </div>
            <div className="home-card">
              <div className="home-card__title">Lift Therapy</div>
              <div className="img-skin-item">
                <img src={imgSkin} alt="" className="img-skin" />
              </div>
              <div className="home-card__desc">
                Nâng cơ và săn chắc, hỗ trợ giảm nếp nhăn, tạo đường nét gọn
                gàng.
              </div>
              <div className="home-card__meta">
                <span className="home-chip">90 phút</span>
                <span className="home-chip">Chống lão hoá</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--alt home-why">
        <div className="home-container home-why__inner">
          <div className="home-why__image">
            <img
              src="https://res.cloudinary.com/demo/image/upload/v1631234571/spa_illustration.png"
              alt="Why choose Beauty Care"
              className="img-why-spa"
              onError={(e) => {
                (e.target as HTMLImageElement).src = homeBanner; // Fallback to banner if link fails
              }}
            />
          </div>
          <div className="home-why__content">
            <h2 className="home-section__title">Vì sao chọn Beauty Care</h2>
            <p className="home-section__desc">
              Trải nghiệm beautycare tối ưu: hiệu quả rõ rệt, quy trình minh
              bạch và chăm sóc tận tâm.
            </p>
            <div className="home-why__features">
              <div className="home-why-feature">
                <div className="home-why-feature__icon">
                  <UserOutlined />
                </div>
                <div className="home-why-feature__text">
                  <div className="home-why-feature__title">Cá nhân hoá</div>
                  <div className="home-why-feature__desc">
                    Phác đồ theo tình trạng da và mục tiêu của bạn.
                  </div>
                </div>
              </div>
              <div className="home-why-feature">
                <div className="home-why-feature__icon">
                  <CheckCircleOutlined />
                </div>
                <div className="home-why-feature__text">
                  <div className="home-why-feature__title">Chuẩn vệ sinh</div>
                  <div className="home-why-feature__desc">
                    Không gian sạch, dụng cụ tiệt trùng theo quy trình.
                  </div>
                </div>
              </div>
              <div className="home-why-feature">
                <div className="home-why-feature__icon">
                  <CrownOutlined />
                </div>
                <div className="home-why-feature__text">
                  <div className="home-why-feature__title">Công nghệ mới</div>
                  <div className="home-why-feature__desc">
                    Thiết bị hỗ trợ thẩm thấu và phục hồi chuyên sâu.
                  </div>
                </div>
              </div>
              <div className="home-why-feature">
                <div className="home-why-feature__icon">
                  <HeartOutlined />
                </div>
                <div className="home-why-feature__text">
                  <div className="home-why-feature__title">
                    Chăm sóc tận tâm
                  </div>
                  <div className="home-why-feature__desc">
                    Hướng dẫn routine tại nhà để duy trì kết quả lâu dài.
                  </div>
                </div>
              </div>
            </div>
            <button className="home-btn home-btn--primary home-why__btn">
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container-care">
          <div className="home-section__header">
            <h2 className="home-section__title">Quy trình 4 bước</h2>
            <p className="home-section__desc">
              Nhẹ nhàng, rõ ràng và tối ưu thời gian cho bạn.
            </p>
          </div>
          <div className="home-steps">
            <div className="home-step">
              <div className="home-step__image-wrap">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/v1631234571/spa_skin_analysis.jpg"
                  alt="Soi da"
                  className="home-step__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgSkin;
                  }}
                />
                <div className="home-step__icon-float">
                  <ScanOutlined />
                </div>
              </div>
              <div className="home-step__head">
                <span className="home-step__num">01</span>
              </div>
              <div className="home-step__body">
                <h3 className="home-step__title">Soi da</h3>
                <p className="home-step__desc">
                  Phân tích cấu trúc da bằng thiết bị hiện đại để thấu hiểu làn
                  da bạn.
                </p>
              </div>
              <div className="home-step__arrow">
                <ArrowRightOutlined />
              </div>
            </div>

            <div className="home-step">
              <div className="home-step__image-wrap">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/v1631234572/spa_cleansing.jpg"
                  alt="Làm sạch sâu"
                  className="home-step__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgSkin;
                  }}
                />
                <div className="home-step__icon-float">
                  <ClearOutlined />
                </div>
              </div>
              <div className="home-step__head">
                <span className="home-step__num">02</span>
              </div>
              <div className="home-step__body">
                <h3 className="home-step__title">Làm sạch sâu</h3>
                <p className="home-step__desc">
                  Loại bỏ bã nhờn, bụi mịn và tế bào chết bằng dược mỹ phẩm lành
                  tính.
                </p>
              </div>
              <div className="home-step__arrow">
                <ArrowRightOutlined />
              </div>
            </div>

            <div className="home-step">
              <div className="home-step__image-wrap">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/v1631234573/spa_therapy.jpg"
                  alt="Trị liệu"
                  className="home-step__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgSkin;
                  }}
                />
                <div className="home-step__icon-float">
                  <ExperimentOutlined />
                </div>
              </div>
              <div className="home-step__head">
                <span className="home-step__num">03</span>
              </div>
              <div className="home-step__body">
                <h3 className="home-step__title">Trị liệu</h3>
                <p className="home-step__desc">
                  Ứng dụng công nghệ chuyên biệt để giải quyết từng vấn đề của
                  da.
                </p>
              </div>
              <div className="home-step__arrow">
                <ArrowRightOutlined />
              </div>
            </div>

            <div className="home-step">
              <div className="home-step__image-wrap">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/v1631234574/spa_moisturize.jpg"
                  alt="Khoá ẩm"
                  className="home-step__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgSkin;
                  }}
                />
                <div className="home-step__icon-float">
                  <SafetyCertificateOutlined />
                </div>
              </div>
              <div className="home-step__head">
                <span className="home-step__num">04</span>
              </div>
              <div className="home-step__body">
                <h3 className="home-step__title">Khoá ẩm</h3>
                <p className="home-step__desc">
                  Cân bằng độ ẩm và phục hồi màng bảo vệ da cho kết quả bền
                  vững.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--alt home-reviews">
        <div className="home-container">
          <div className="home-section__header home-reviews__header">
            <div className="home-reviews__heading">
              <h2 className="home-section__title">Khách hàng nói gì</h2>
              <p className="home-section__desc">
                Một vài cảm nhận sau khi trải nghiệm liệu trình tại Beauty Care.
              </p>
            </div>
            <div className="home-reviews__trust">
              <CheckCircleFilled className="home-reviews__trustIcon" />
              <span className="home-reviews__trustText">
                4.9/5 • 10K+ đánh giá
              </span>
            </div>
          </div>
          <div className="home-grid home-grid--3 home-reviews__grid">
            <article className="home-review">
              <div className="home-review__top">
                <div className="home-review__avatar">MA</div>
                <div className="home-review__meta">
                  <div className="home-review__nameRow">
                    <div className="home-review__name">Minh Anh</div>
                    <span className="home-review__badge">
                      <CheckCircleFilled />
                      Đã xác thực
                    </span>
                  </div>
                  <div className="home-review__sub">
                    Da nhạy cảm • Skin Reset
                  </div>
                </div>
              </div>
              <div className="home-review__stars" aria-label="5 sao">
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </div>
              <div className="home-review__text">
                Da mình dịu hơn hẳn sau 1 buổi, không còn căng rát. Nhân viên tư
                vấn rất kỹ và nhẹ nhàng.
              </div>
            </article>

            <article className="home-review">
              <div className="home-review__top">
                <div className="home-review__avatar">TL</div>
                <div className="home-review__meta">
                  <div className="home-review__nameRow">
                    <div className="home-review__name">Thuỳ Linh</div>
                    <span className="home-review__badge">
                      <CheckCircleFilled />
                      Đã xác thực
                    </span>
                  </div>
                  <div className="home-review__sub">
                    Da hỗn hợp • Glow &amp; Hydrate
                  </div>
                </div>
              </div>
              <div className="home-review__stars" aria-label="5 sao">
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </div>
              <div className="home-review__text">
                Không gian sạch, thơm. Quy trình rõ ràng, chăm sóc sau liệu
                trình rất có tâm.
              </div>
            </article>

            <article className="home-review">
              <div className="home-review__top">
                <div className="home-review__avatar">NT</div>
                <div className="home-review__meta">
                  <div className="home-review__nameRow">
                    <div className="home-review__name">Ngọc Trâm</div>
                    <span className="home-review__badge">
                      <CheckCircleFilled />
                      Đã xác thực
                    </span>
                  </div>
                  <div className="home-review__sub">
                    Chống lão hoá • Lift Therapy
                  </div>
                </div>
              </div>
              <div className="home-review__stars" aria-label="5 sao">
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </div>
              <div className="home-review__text">
                Liệu trình nâng cơ thấy da săn hơn, makeup bám hơn. Sẽ quay lại
                định kỳ.
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-container home-cta__inner">
          <div className="home-cta__content">
            <h2 className="home-cta__title">
              Sẵn sàng bắt đầu hành trình beautycare?
            </h2>
            <p className="home-cta__desc">
              Đặt lịch trong 60 giây. Nhận tư vấn miễn phí và lộ trình phù hợp
              nhất cho làn da của bạn.
            </p>
          </div>
          <div className="home-cta__actions">
            <button className="home-btn home-btn--dark">Đặt lịch</button>
            <button className="home-btn home-btn--light">Nhắn Zalo</button>
          </div>
        </div>
      </section>

      <section className="home-section home-blog">
        <div className="home-container">
          <div className="home-section__header">
            <div>
              <h2 className="home-section__title">Kiến thức làm đẹp</h2>
              <p className="home-section__desc">
                Cập nhật những xu hướng chăm sóc da mới nhất và lời khuyên từ
                chuyên gia Beauty Care.
              </p>
            </div>
            <button className="home-btn home-btn--ghost">Xem tất cả</button>
          </div>
          <div className="home-grid home-grid--3">
            <article className="home-blog-card">
              <div className="home-blog-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
                  alt="Skincare tips"
                  className="home-blog-card__image"
                />
                <span className="home-blog-card__tag">Chăm sóc da</span>
              </div>
              <div className="home-blog-card__content">
                <div className="home-blog-card__date">25 Tháng 3, 2024</div>
                <h3 className="home-blog-card__title">
                  5 bước chăm sóc da buổi sáng cho làn da căng bóng
                </h3>
                <p className="home-blog-card__desc">
                  Làn da căng mọng không chỉ nhờ mỹ phẩm mà còn ở quy trình đúng
                  cách. Khám phá ngay...
                </p>
                <div className="home-blog-card__more">
                  Đọc thêm <ArrowRightOutlined />
                </div>
              </div>
            </article>

            <article className="home-blog-card">
              <div className="home-blog-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
                  alt="Skincare technology"
                  className="home-blog-card__image"
                />
                <span className="home-blog-card__tag">Công nghệ</span>
              </div>
              <div className="home-blog-card__content">
                <div className="home-blog-card__date">20 Tháng 3, 2024</div>
                <h3 className="home-blog-card__title">
                  Công nghệ Nâng cơ Lift Therapy có thực sự hiệu quả?
                </h3>
                <p className="home-blog-card__desc">
                  Giải mã công nghệ giúp trẻ hoá làn da mà không cần can thiệp
                  phẫu thuật tại Beauty Care.
                </p>
                <div className="home-blog-card__more">
                  Đọc thêm <ArrowRightOutlined />
                </div>
              </div>
            </article>

            <article className="home-blog-card">
              <div className="home-blog-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800"
                  alt="Spa routine"
                  className="home-blog-card__image"
                />
                <span className="home-blog-card__tag">Routine</span>
              </div>
              <div className="home-blog-card__content">
                <div className="home-blog-card__date">15 Tháng 3, 2024</div>
                <h3 className="home-blog-card__title">
                  Tại sao bạn cần soi da định kỳ 3 tháng một lần?
                </h3>
                <p className="home-blog-card__desc">
                  Soi da giúp phát hiện sớm các vấn đề tiềm ẩn bên dưới bề mặt
                  da mà mắt thường không thấy.
                </p>
                <div className="home-blog-card__more">
                  Đọc thêm <ArrowRightOutlined />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomeComponent;
