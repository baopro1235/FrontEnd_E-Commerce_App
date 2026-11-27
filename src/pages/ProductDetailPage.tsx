import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { getProductBySlug, getProducts } from "../api/productService";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/product/ProductCard";
import "./ProductDetailPage.css";

interface ProductDetailPageProps {
    slug: string;
}

const DEFAULT_IMAGE = "/images/interior-paint.svg";

function ProductDetailPage({ slug }: ProductDetailPageProps) {
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"desc" | "guide">("desc");
    const [cartMessage, setCartMessage] = useState("");
    const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE);

    useEffect(() => {
        const loadProductData = async () => {
            setLoading(true);
            try {
                const found = await getProductBySlug(slug);
                setProduct(found);
                if (found) {
                    setImgSrc(found.image || DEFAULT_IMAGE);
                    // Lấy sản phẩm cùng danh mục
                    const allProducts = await getProducts();
                    const related = allProducts.filter(
                        (p) => p.category === found.category && String(p.id) !== String(found.id)
                    );
                    setRelatedProducts(related.slice(0, 4));
                }
            } catch (err) {
                console.error("Lỗi tải thông tin sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProductData();
        setQuantity(1);
        setCartMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    const handleNavigate = (path: string) => {
        window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        setCartMessage(`✓ Đã thêm ${quantity} thùng "${product.name}" vào giỏ hàng!`);
        setTimeout(() => setCartMessage(""), 4000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, quantity);
        handleNavigate("/cart");
    };

    if (loading) {
        return (
            <main className="product-detail-page">
                <p style={{ textAlign: "center", padding: "100px 0", fontSize: "16px" }}>
                    Đang tải chi tiết sản phẩm...
                </p>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail-page">
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <h2>Không tìm thấy sản phẩm!</h2>
                    <p style={{ color: "#6b7280", margin: "12px 0 24px" }}>
                        Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không hợp lệ.
                    </p>
                    <button
                        type="button"
                        className="btn-buy-now"
                        style={{ maxWidth: "240px", margin: "0 auto" }}
                        onClick={() => handleNavigate("/products")}
                    >
                        Quay lại danh sách sản phẩm
                    </button>
                </div>
            </main>
        );
    }

    const discountPercent = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="product-detail-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs" aria-label="Breadcrumb">
                <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate("/"); }}>
                    Trang chủ
                </a>
                <span className="separator">/</span>
                <a href="/products" onClick={(e) => { e.preventDefault(); handleNavigate("/products"); }}>
                    Sản phẩm
                </a>
                <span className="separator">/</span>
                <span className="current">{product.name}</span>
            </nav>

            {/* Khung chi tiết chính */}
            <div className="detail-main">
                {/* Cột trái: Ảnh sản phẩm */}
                <div className="detail-gallery">
                    <div className="main-image-wrapper">
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
                            <span className="badge-featured">SẢN PHẨM NỔI BẬT</span>
                        )}
                    </div>

                    <div className="badges-commitment">
                        <div className="commitment-item">
                            <span className="commitment-icon">🛡️</span>
                            <span>Chính hãng 100%</span>
                        </div>
                        <div className="commitment-item">
                            <span className="commitment-icon">🚚</span>
                            <span>Giao hàng tận nơi</span>
                        </div>
                        <div className="commitment-item">
                            <span className="commitment-icon">🔄</span>
                            <span>Đổi trả 7 ngày</span>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Thông tin & Đặt mua */}
                <div className="detail-info">
                    <span className="brand-tag">{product.brand}</span>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="price-box">
                        <span className="current-price">
                            {product.price.toLocaleString("vi-VN")}₫
                        </span>
                        {product.originalPrice && (
                            <span className="original-price">
                                {product.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                        )}
                        {discountPercent > 0 && (
                            <span className="discount-badge">-{discountPercent}%</span>
                        )}
                    </div>

                    <p className="detail-desc">{product.description}</p>

                    {/* Bảng thông số tóm tắt */}
                    <div className="specs-table">
                        <div className="spec-item">
                            Danh mục: <strong>{product.category}</strong>
                        </div>
                        <div className="spec-item">
                            Loại sơn: <strong>{product.paintType}</strong>
                        </div>
                        <div className="spec-item">
                            Dung tích: <strong>{product.capacity}</strong>
                        </div>
                        <div className="spec-item">
                            Tồn kho: <strong>{product.stock} thùng</strong>
                        </div>
                    </div>

                    {/* Điều khiển số lượng & Đặt mua */}
                    <div className="purchase-section">
                        <div className="quantity-control">
                            <label>Số lượng:</label>
                            <div className="quantity-stepper">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                                >
                                    +
                                </button>
                            </div>
                            <span className="stock-indicator">● Còn hàng</span>
                        </div>

                        {cartMessage && <div className="cart-alert">{cartMessage}</div>}

                        <div className="action-buttons">
                            <button
                                type="button"
                                className="btn-add-cart"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                type="button"
                                className="btn-buy-now"
                                onClick={handleBuyNow}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Mô tả & Hướng dẫn */}
            <section className="detail-tabs-section">
                <div className="tab-headings">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "desc" ? "active" : ""}`}
                        onClick={() => setActiveTab("desc")}
                    >
                        Thông Tin Chi Tiết
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "guide" ? "active" : ""}`}
                        onClick={() => setActiveTab("guide")}
                    >
                        Hướng Dẫn Thi Công & Bảo Quản
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "desc" ? (
                        <div>
                            <h3>Đặc điểm nổi bật của {product.name}</h3>
                            <p style={{ lineHeight: 1.8, color: "#4b5563" }}>
                                {product.name} là dòng sơn chất lượng cao thuộc thương hiệu <strong>{product.brand}</strong>, 
                                được đặc chế phù hợp với khí hậu nhiệt đới tại Việt Nam. Sản phẩm đem lại độ che phủ cao,
                                bề mặt đanh chắc, chống rêu mốc và bền màu vượt trội theo thời gian.
                            </p>
                            <ul style={{ lineHeight: 2, color: "#4b5563", marginTop: "12px" }}>
                                <li><strong>Độ phủ lý thuyết:</strong> 10 - 12 m²/lít/lớp tùy thuộc bề mặt.</li>
                                <li><strong>Thời gian khô bề mặt:</strong> 30 - 45 phút ở 30°C.</li>
                                <li><strong>Thời gian sơn lớp kế tiếp:</strong> Tối thiểu sau 2 giờ.</li>
                                <li><strong>Công nghệ:</strong> Thân thiện với môi trường, hàm lượng VOC cực thấp, an toàn sức khỏe.</li>
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h3>Quy trình thi công sơn chuẩn kỹ thuật</h3>
                            <div className="guide-steps">
                                <div className="step-card">
                                    <span className="step-number">01</span>
                                    <div className="step-body">
                                        <h4>Chuẩn bị bề mặt tường</h4>
                                        <p>Đảm bảo bề mặt cần sơn phải sạch bụi bẩn, dầu mỡ và khô ráo hoàn toàn (độ ẩm tường dưới 16%). Xử lý các vết nứt nẻ trước khi sơn.</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <span className="step-number">02</span>
                                    <div className="step-body">
                                        <h4>Thi công sơn lót kháng kiềm</h4>
                                        <p>Thi công 1 - 2 lớp sơn lót kháng kiềm chuyên dụng để tạo độ bám dính, chống ố vàng và bảo vệ màu sắc tối ưu.</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <span className="step-number">03</span>
                                    <div className="step-body">
                                        <h4>Thi công sơn phủ hoàn thiện</h4>
                                        <p>Khuấy đều thùng sơn trước khi dùng. Thi công 2 lớp sơn hoàn thiện bằng cọ, rulo hoặc súng phun sơn. Mỗi lớp cách nhau 2 giờ.</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <span className="step-number">04</span>
                                    <div className="step-body">
                                        <h4>Bảo quản sản phẩm</h4>
                                        <p>Đậy chặt nắp thùng sơn sau khi sử dụng. Đặt ở nơi khô ráo, thoáng mát, tránh ánh nắng mặt trời trực tiếp và xa tầm tay trẻ em.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Sản phẩm liên quan */}
            {relatedProducts.length > 0 && (
                <section className="related-section">
                    <h2>Sản phẩm cùng danh mục</h2>
                    <div className="related-grid">
                        {relatedProducts.map((relProduct) => (
                            <ProductCard key={relProduct.id} product={relProduct} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetailPage;
