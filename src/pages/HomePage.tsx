
import "./HomePage.css";
import CategoryList from "../components/product/CategoryList";
import FeaturedProducts from "../components/product/FeatureProducts";

function HomePage() {
    return (
        <main className="home-page">
            <section className="hero-banner">
                <div className="hero-content">
          <span className="hero-label">
            PAINT SHOP - COLOR YOUR LIFE
          </span>

                    <h1>
                        Sắc màu hoàn hảo
                        <br />
                        Không gian như ý
                    </h1>

                    <p>
                        Khám phá bộ sưu tập sơn nội thất, ngoại thất
                        chất lượng cao với đa dạng màu sắc và mức giá
                        phù hợp cho mọi công trình.
                    </p>

                    <a href="/products" className="hero-button">
                        Khám phá sản phẩm
                    </a>
                </div>

                <div className="hero-decoration">
                    <div className="paint-circle circle-one"></div>
                    <div className="paint-circle circle-two"></div>
                    <div className="paint-circle circle-three"></div>

                    <div className="hero-message">
                        <span>COLOR</span>
                        <strong>YOUR WORLD</strong>
                    </div>
                </div>
            </section>
            <CategoryList />
            <FeaturedProducts />
        </main>
    );
}

export default HomePage;
