import { useEffect, useState } from "react";
import Header from "./components/common/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        // Lắng nghe nút Back/Forward của trình duyệt
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener("popstate", handleLocationChange);

        // Lắng nghe sự kiện điều hướng nội bộ SPA
        const handleNavigate = (e: CustomEvent<string>) => {
            window.history.pushState(null, "", e.detail);
            setCurrentPath(e.detail);
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        window.addEventListener("navigate" as any, handleNavigate as any);

        return () => {
            window.removeEventListener("popstate", handleLocationChange);
            window.removeEventListener("navigate" as any, handleNavigate as any);
        };
    }, []);

    // Phân tích route
    const renderContent = () => {
        // Trang chi tiết sản phẩm: /products/:slug
        const productDetailMatch = currentPath.match(/^\/products\/([^/?#]+)/);
        if (productDetailMatch) {
            const slug = decodeURIComponent(productDetailMatch[1]);
            return <ProductDetailPage slug={slug} />;
        }

        // Trang danh sách sản phẩm: /products
        if (currentPath === "/products" || currentPath.startsWith("/products?")) {
            return <ProductsPage />;
        }

        // Trang giỏ hàng (chuẩn bị cho P2)
        if (currentPath === "/cart") {
            return (
                <main style={{ maxWidth: "800px", margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
                    <div style={{ fontSize: "50px", marginBottom: "16px" }}>🛒</div>
                    <h2>Giỏ hàng của bạn</h2>
                    <p style={{ color: "#6b7280", margin: "12px 0 24px" }}>
                        Chức năng giỏ hàng chi tiết đang được chuẩn bị tích hợp trong module tiếp theo.
                    </p>
                    <button
                        type="button"
                        className="hero-button"
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent("navigate", { detail: "/products" }));
                        }}
                    >
                        Tiếp tục mua sắm
                    </button>
                </main>
            );
        }

        // Mặc định: Trang chủ
        return <HomePage />;
    };

    return (
        <div className="app-container">
            <Header currentPath={currentPath} />
            {renderContent()}
        </div>
    );
}

export default App;
