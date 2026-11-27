import { useEffect, useState } from "react";
import Header from "./components/common/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";

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

        // Trang giỏ hàng: /cart
        if (currentPath === "/cart") {
            return <CartPage />;
        }

        // Mặc định: Trang chủ
        return <HomePage />;
    };

    return (
        <CartProvider>
            <div className="app-container">
                <Header currentPath={currentPath} />
                {renderContent()}
            </div>
        </CartProvider>
    );
}

export default App;
