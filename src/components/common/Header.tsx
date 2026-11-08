
import "./Header.css";

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <a href="/" className="header-logo">
                    PAINT SHOP
                </a>

                {/* Search */}
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm sơn..."
                    />
                    <button type="button">Tìm kiếm</button>
                </div>

                {/* User and Cart */}
                <div className="header-actions">
                    <a href="/login">Tài khoản</a>
                    <a href="/cart">Giỏ hàng</a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="header-nav">
                <a href="/">Trang chủ</a>
                <a href="/products">Sản phẩm</a>
                <a href="/categories">Danh mục</a>
                <a href="/about">Giới thiệu</a>
                <a href="/contact">Liên hệ</a>
            </nav>
        </header>
    );
}

export default Header;
