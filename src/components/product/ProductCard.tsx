
import { useState } from "react";
import type { Product } from "../../types/Product";
import "./ProductCard.css";

interface ProductCardProps {
    product: Product;
}

const DEFAULT_IMAGE = "/images/interior-paint.svg";

function ProductCard({ product }: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_IMAGE);

    const handleDetailClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(
            new CustomEvent("navigate", {
                detail: `/products/${product.slug || product.id}`,
            })
        );
    };

    return (
        <article className="product-card">
            <div
                className="product-card-image"
                style={{ cursor: "pointer" }}
                onClick={handleDetailClick}
            >
                <img
                    src={imgSrc}
                    alt={product.name}
                    onError={() => {
                        if (imgSrc.endsWith(".jpg")) {
                            setImgSrc(imgSrc.replace(".jpg", ".svg"));
                        } else {
                            setImgSrc(DEFAULT_IMAGE);
                        }
                    }}
                />

                {product.isFeatured && (
                    <span className="product-badge">Nổi bật</span>
                )}
            </div>

            <div className="product-card-content">
                <span className="product-brand">{product.brand}</span>

                <h3
                    className="product-name"
                    style={{ cursor: "pointer" }}
                    onClick={handleDetailClick}
                >
                    {product.name}
                </h3>

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
                    href={`/products/${product.slug || product.id}`}
                    className="product-detail-button"
                    onClick={handleDetailClick}
                >
                    Xem chi tiết
                </a>
            </div>
        </article>
    );
}

export default ProductCard;
