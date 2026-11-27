import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";
import type { CartItem, CartContextType } from "../types/Cart";

const CART_STORAGE_KEY = "paint_shop_cart_data";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Tự động đồng bộ vào localStorage
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (err) {
            console.error("Lỗi lưu giỏ hàng vào localStorage:", err);
        }
    }, [cartItems]);

    // Thêm sản phẩm vào giỏ
    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex(
                (item) => String(item.product.id) === String(product.id)
            );

            if (existingIndex > -1) {
                const updated = [...prevItems];
                const currentQty = updated[existingIndex].quantity;
                const newQty = Math.min(product.stock, currentQty + quantity);
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty,
                };
                return updated;
            } else {
                return [...prevItems, { product, quantity: Math.min(product.stock, quantity) }];
            }
        });
    };

    // Xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId: string | number) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => String(item.product.id) !== String(productId))
        );
    };

    // Cập nhật số lượng
    const updateQuantity = (productId: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (String(item.product.id) === String(productId)) {
                    return {
                        ...item,
                        quantity: Math.min(item.product.stock, quantity),
                    };
                }
                return item;
            })
        );
    };

    // Xóa trắng giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tổng số lượng món
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Tổng thành tiền
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalAmount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook tiện ích để sử dụng Cart
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng bên trong CartProvider");
    }
    return context;
};
