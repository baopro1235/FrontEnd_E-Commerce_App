
import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import { getProducts } from "../../api/productService";
import { products as fallbackProducts } from "../../data/products";
import ProductCard from "./ProductCard";
import "./FeatureProducts.css";

function FeatureProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                const list = Array.isArray(data) ? data : [];

                const featuredProducts = list.filter(
                    (product) => product.isFeatured && product.isActive
                );

                if (featuredProducts.length > 0) {
                    setProducts(featuredProducts);
                } else {
                    setProducts(fallbackProducts.filter((p) => p.isFeatured));
                }
            } catch (err) {
                console.warn("Không kết nối được JSON server, chuyển sang dùng dữ liệu mẫu:", err);
                setProducts(fallbackProducts.filter((p) => p.isFeatured));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "40px" }}>Đang tải sản phẩm...</p>;
    }

    return (
        <section className="featured-products">
            <div className="featured-products-header">
                <span className="featured-products-label">
                    OUR PRODUCTS
                </span>

                <h2>Sản phẩm nổi bật</h2>

                <p>
                    Khám phá những dòng sơn chất lượng dành cho không gian của bạn.
                </p>
            </div>

            <div className="featured-products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeatureProducts;
