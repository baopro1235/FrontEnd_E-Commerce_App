
import type { Product } from "../../types/Product";
import "./ProductCard.css";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="product-card">
            <div className="product-card-image">
                <img src={product.image} alt={product.name} />

                {product.isFeatured && (
                    <span className="product-badge">Nổi bật</span>
                )}
            </div>

            <div className="product-card-content">
                <span className="product-brand">{product.brand}</span>

                <h3 className="product-name">{product.name}</h3>

                <p className="product-description">
                    {product.description}
                </p>

                <div className="product-info">
                    <span>{product.capacity}</span>
                    <span>{product.paintType}</span>
                </div>

                <div className="product-price">
                    <strong>
                        {product.price.toLocaleString("vi-VN")}đ
                    </strong>

                    {product.originalPrice && (
                        <del>
                            {product.originalPrice.toLocaleString("vi-VN")}đ
                        </del>
                    )}
                </div>

                <a
                    href={`/products/${product.slug}`}
                    className="product-detail-button"
                >
                    Xem chi tiết
                </a>
            </div>
        </article>
    );
}

export default ProductCard;
