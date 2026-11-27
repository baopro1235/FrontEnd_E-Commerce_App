import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

const DEFAULT_IMAGE = "/images/interior-paint.svg";

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();

    const [couponCode, setCouponCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");

    // State cho Modal Đặt hàng
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState("");

    // Form đặt hàng
    const [orderForm, setOrderForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: "",
        paymentMethod: "cod",
    });

    const handleNavigate = (path: string) => {
        window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
    };

    // Áp dụng mã giảm giá
    const handleApplyCoupon = () => {
        if (couponCode.trim().toUpperCase() === "PAINTSHOP10") {
            const discount = Math.round(totalAmount * 0.1);
            setDiscountAmount(discount);
            setCouponMessage("✓ Áp dụng mã PAINTSHOP10 thành công (Giảm 10%)!");
        } else if (couponCode.trim() === "") {
            setDiscountAmount(0);
            setCouponMessage("");
        } else {
            setCouponMessage("Mã giảm giá không hợp lệ. Hãy thử mã PAINTSHOP10");
        }
    };

    // Tính toán phí ship
    const shippingFee = totalAmount >= 1000000 || totalAmount === 0 ? 0 : 50000;
    const finalTotal = Math.max(0, totalAmount + shippingFee - discountAmount);

    // Xử lý gửi đơn hàng
    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderForm.fullName || !orderForm.phone || !orderForm.address) {
            alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
            return;
        }

        const newId = "DH-" + Math.floor(100000 + Math.random() * 900000);
        setCreatedOrderId(newId);
        setIsOrderSuccess(true);
        clearCart();
    };

    // Giỏ hàng trống
    if (cartItems.length === 0 && !isOrderSuccess) {
        return (
            <main className="cart-page">
                <div className="empty-cart-container">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>
                        Hãy khám phá các dòng sơn nội thất, ngoại thất và sơn lót cao cấp để bắt đầu trang hoàng không gian!
                    </p>
                    <button
                        type="button"
                        className="btn-checkout"
                        style={{ maxWidth: "260px", margin: "0 auto" }}
                        onClick={() => handleNavigate("/products")}
                    >
                        Khám phá sản phẩm ngay
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <h1 className="cart-title">Giỏ Hàng Của Bạn</h1>

            <div className="cart-layout">
                {/* Cột trái: Danh sách mặt hàng */}
                <section className="cart-items-section">
                    <div className="cart-items-header">
                        <h3>Danh sách sản phẩm ({totalItems})</h3>
                        <button
                            type="button"
                            className="btn-clear-all"
                            onClick={() => {
                                if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
                                    clearCart();
                                }
                            }}
                        >
                            Xóa tất cả
                        </button>
                    </div>

                    <div className="cart-list">
                        {cartItems.map(({ product, quantity }) => (
                            <div className="cart-item-row" key={product.id}>
                                <div
                                    className="cart-item-img"
                                    onClick={() => handleNavigate(`/products/${product.slug || product.id}`)}
                                >
                                    <img
                                        src={product.image || DEFAULT_IMAGE}
                                        alt={product.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                        }}
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <span className="cart-item-brand">{product.brand}</span>
                                    <h4
                                        className="cart-item-name"
                                        onClick={() => handleNavigate(`/products/${product.slug || product.id}`)}
                                    >
                                        {product.name}
                                    </h4>
                                    <span className="cart-item-specs">
                                        Quy cách: {product.capacity} • {product.paintType}
                                    </span>
                                </div>

                                <div className="cart-item-price">
                                    {product.price.toLocaleString("vi-VN")}₫
                                </div>

                                <div className="cart-item-stepper">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-total">
                                    {(product.price * quantity).toLocaleString("vi-VN")}₫
                                </div>

                                <button
                                    type="button"
                                    className="btn-remove-item"
                                    title="Xóa sản phẩm"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer-actions">
                        <button
                            type="button"
                            className="btn-continue-shopping"
                            onClick={() => handleNavigate("/products")}
                        >
                            ← Tiếp tục mua sắm
                        </button>
                    </div>
                </section>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <aside className="cart-summary-section">
                    <h3>Tóm Tắt Đơn Hàng</h3>

                    {/* Thanh thông báo freeship */}
                    <div className="freeship-alert">
                        {totalAmount >= 1000000 ? (
                            <span>🎉 Đơn hàng của bạn đủ điều kiện <strong>Miễn phí vận chuyển</strong>!</span>
                        ) : (
                            <span>
                                Mua thêm <strong>{(1000000 - totalAmount).toLocaleString("vi-VN")}₫</strong> để được <strong>Freeship</strong>!
                            </span>
                        )}
                    </div>

                    <div className="summary-rows">
                        <div className="summary-row">
                            <span>Tạm tính ({totalItems} sản phẩm):</span>
                            <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
                        </div>

                        <div className="summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}₫`}</span>
                        </div>

                        {discountAmount > 0 && (
                            <div className="summary-row" style={{ color: "#16a34a" }}>
                                <span>Giảm giá (PAINTSHOP10):</span>
                                <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                            </div>
                        )}

                        <div className="summary-row total-row">
                            <span>Tổng thanh toán:</span>
                            <span className="total-amount">{finalTotal.toLocaleString("vi-VN")}₫</span>
                        </div>
                    </div>

                    {/* Mã coupon */}
                    <div className="coupon-box">
                        <input
                            type="text"
                            placeholder="Mã giảm giá (ví dụ: PAINTSHOP10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type="button" onClick={handleApplyCoupon}>
                            Áp dụng
                        </button>
                    </div>
                    {couponMessage && (
                        <p style={{ fontSize: "12px", color: discountAmount > 0 ? "#16a34a" : "#dc2626", margin: "-16px 0 16px" }}>
                            {couponMessage}
                        </p>
                    )}

                    <button
                        type="button"
                        className="btn-checkout"
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        TIẾN HÀNH ĐẶT HÀNG
                    </button>
                </aside>
            </div>

            {/* Modal đặt hàng */}
            {isCheckoutOpen && (
                <div className="checkout-modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
                    <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
                        {!isOrderSuccess ? (
                            <>
                                <div className="checkout-header">
                                    <h2>Thông Tin Giao Hàng</h2>
                                    <button
                                        type="button"
                                        className="btn-close-modal"
                                        onClick={() => setIsCheckoutOpen(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleOrderSubmit} className="checkout-form">
                                    <div className="form-field">
                                        <label>Họ và tên người nhận *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nguyễn Văn A"
                                            value={orderForm.fullName}
                                            onChange={(e) => setOrderForm({ ...orderForm, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Số điện thoại liên hệ *</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="0912345678"
                                            value={orderForm.phone}
                                            onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Địa chỉ nhận hàng chi tiết *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Số 123, đường Lê Lợi, Phường 1, Quận 1, TP.HCM"
                                            value={orderForm.address}
                                            onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Phương thức thanh toán</label>
                                        <select
                                            value={orderForm.paymentMethod}
                                            onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                                        >
                                            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                            <option value="bank">Chuyển khoản qua ngân hàng (QR Code)</option>
                                        </select>
                                    </div>

                                    <div className="form-field">
                                        <label>Ghi chú đơn hàng (Tùy chọn)</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Giao hàng vào giờ hành chính, gọi trước khi giao..."
                                            value={orderForm.note}
                                            onChange={(e) => setOrderForm({ ...orderForm, note: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", fontSize: "14px", marginTop: "4px" }}>
                                        Tổng tiền cần thanh toán: <strong style={{ color: "#ea580c" }}>{finalTotal.toLocaleString("vi-VN")}₫</strong>
                                    </div>

                                    <button type="submit" className="btn-checkout" style={{ marginTop: "10px" }}>
                                        XÁC NHẬN ĐẶT HÀNG
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="order-success-box">
                                <div className="order-success-icon">🎉</div>
                                <h2>Đặt Hàng Thành Công!</h2>
                                <p style={{ color: "#4b5563", margin: "12px 0 20px" }}>
                                    Mã đơn hàng của bạn là: <strong style={{ color: "#ea580c" }}>#{createdOrderId}</strong>.
                                    Nhân viên cửa hàng sẽ liên hệ qua số điện thoại <strong>{orderForm.phone}</strong> để xác nhận và giao hàng sớm nhất.
                                </p>
                                <button
                                    type="button"
                                    className="btn-checkout"
                                    onClick={() => {
                                        setIsCheckoutOpen(false);
                                        setIsOrderSuccess(false);
                                        handleNavigate("/");
                                    }}
                                >
                                    Quay về trang chủ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

export default CartPage;
