import { useEffect, useState, useMemo } from "react";
import type { Product } from "../types/Product";
import { getProducts } from "../api/productService";
import { products as fallbackProducts } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import "./ProductsPage.css";

const CATEGORIES = [
    "Tất cả",
    "Sơn nội thất",
    "Sơn ngoại thất",
    "Sơn lót",
    "Sơn chuyên dụng",
];

const BRANDS = ["Tất cả", "Dulux", "Jotun", "Nippon", "Kova"];

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get("category");
        if (catParam) {
            const matched = CATEGORIES.find(
                (c) =>
                    c.toLowerCase() === catParam.toLowerCase() ||
                    (catParam === "1" && c === "Sơn nội thất") ||
                    (catParam === "2" && c === "Sơn ngoại thất") ||
                    (catParam === "3" && c === "Sơn lót") ||
                    (catParam === "4" && c === "Sơn chuyên dụng")
            );
            if (matched) return matched;
        }
        return "Tất cả";
    });
    const [selectedBrand, setSelectedBrand] = useState("Tất cả");
    const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await getProducts();
                const list = Array.isArray(data) ? data : [];
                if (list.length > 0) {
                    setProducts(list);
                } else {
                    setProducts(fallbackProducts);
                }
            } catch (err) {
                console.warn("Không thể tải sản phẩm từ API, sử dụng dữ liệu dự phòng:", err);
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // Filter & sort logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Tìm kiếm theo từ khóa
        if (searchKeyword.trim() !== "") {
            const keyword = searchKeyword.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(keyword) ||
                    p.description.toLowerCase().includes(keyword) ||
                    p.brand.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo danh mục
        if (selectedCategory !== "Tất cả") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Lọc theo thương hiệu
        if (selectedBrand !== "Tất cả") {
            result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
        }

        // Sắp xếp theo giá
        if (sortBy === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, searchKeyword, selectedCategory, selectedBrand, sortBy]);

    const handleResetFilters = () => {
        setSearchKeyword("");
        setSelectedCategory("Tất cả");
        setSelectedBrand("Tất cả");
        setSortBy("default");
    };

    return (
        <main className="products-page">
            <div className="products-header">
                <span className="products-header-badge">Cửa hàng sơn</span>
                <h1>Tất Cả Sản Phẩm</h1>
                <p>Khám phá đầy đủ các dòng sơn cao cấp chính hãng từ các thương hiệu hàng đầu.</p>
            </div>

            <div className="products-layout">
                {/* Sidebar bộ lọc */}
                <aside className="filters-sidebar">
                    <div className="filters-header">
                        <h2>Bộ lọc</h2>
                        <button type="button" className="reset-filter-btn" onClick={handleResetFilters}>
                            Đặt lại
                        </button>
                    </div>

                    {/* Tìm kiếm */}
                    <div className="filter-group">
                        <h3>Tìm kiếm</h3>
                        <input
                            type="text"
                            className="filter-search-input"
                            placeholder="Tên sản phẩm, hãng..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>

                    {/* Danh mục */}
                    <div className="filter-group">
                        <h3>Danh mục</h3>
                        <div className="filter-list">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`filter-chip-btn ${selectedCategory === cat ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thương hiệu */}
                    <div className="filter-group">
                        <h3>Thương hiệu</h3>
                        <div className="filter-list">
                            {BRANDS.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    className={`filter-chip-btn ${selectedBrand === brand ? "active" : ""}`}
                                    onClick={() => setSelectedBrand(brand)}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Danh sách kết quả */}
                <section className="products-content">
                    <div className="products-toolbar">
                        <span className="results-count">
                            Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                        </span>

                        <div className="sort-select-wrapper">
                            <label htmlFor="sort-price">Sắp xếp:</label>
                            <select
                                id="sort-price"
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="default">Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến cao</option>
                                <option value="price-desc">Giá: Cao đến thấp</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: "center", padding: "60px 0" }}>Đang tải danh sách sản phẩm...</p>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h3>Không tìm thấy sản phẩm phù hợp</h3>
                            <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc.</p>
                            <button type="button" className="hero-button" onClick={handleResetFilters}>
                                Xem tất cả sản phẩm
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default ProductsPage;
