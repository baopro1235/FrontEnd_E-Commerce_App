
import "./Header.css";

interface HeaderProps {
    currentPath?: string;
}

function Header({ currentPath = "/" }: HeaderProps) {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <a
                    href="/"
                    className="header-logo"
                    onClick={(e) => handleNavClick(e, "/")}
                >
                    PAINT SHOP
                </a>

                {/* Search */}
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm sơn..."
                    />
                    <button
                        type="button"
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent("navigate", { detail: "/products" }));
                        }}
                    >
                        Tìm kiếm
                    </button>
                </div>

                {/* User and Cart */}
                <div className="header-actions">
                    <a href="/login" onClick={(e) => handleNavClick(e, "/login")}>Tài khoản</a>
                    <a href="/cart" onClick={(e) => handleNavClick(e, "/cart")}>Giỏ hàng</a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="header-nav">
                <a
                    href="/"
                    className={currentPath === "/" ? "active" : ""}
                    onClick={(e) => handleNavClick(e, "/")}
                >
                    Trang chủ
                </a>
                <a
                    href="/products"
                    className={currentPath.startsWith("/products") ? "active" : ""}
                    onClick={(e) => handleNavClick(e, "/products")}
                >
                    Sản phẩm
                </a>
                <a href="/categories" onClick={(e) => handleNavClick(e, "/categories")}>Danh mục</a>
                <a href="/about" onClick={(e) => handleNavClick(e, "/about")}>Giới thiệu</a>
                <a href="/contact" onClick={(e) => handleNavClick(e, "/contact")}>Liên hệ</a>
            </nav>
        </header>
    );
}

export default Header;
