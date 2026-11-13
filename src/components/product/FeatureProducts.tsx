
import { products } from "../../data/products.ts";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

function FeaturedProducts() {
    const featuredProducts = products.filter(
        (product) => product.isFeatured
    );

    return (
        <section className="featured-products">
            <div className="featured-products-heading">
        <span className="featured-products-label">
          OUR PRODUCTS
        </span>

                <h2>Sản phẩm nổi bật</h2>

                <p>
                    Khám phá những dòng sơn chất lượng,
                    giúp không gian của bạn trở nên hoàn hảo hơn.
                </p>
            </div>

            <div className="featured-products-grid">
                {featuredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeaturedProducts;
