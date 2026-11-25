import axiosClient from "./axiosClient";
import type { Product } from "../types/Product";
import { products as fallbackProducts } from "../data/products";

// Lấy toàn bộ sản phẩm
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosClient.get<Product[]>("/products");
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.warn("Lỗi gọi API getProducts, dùng dữ liệu dự phòng:", err);
        return fallbackProducts;
    }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const response = await axiosClient.get<Product>(`/products/${id}`);
        return response.data || null;
    } catch {
        const found = fallbackProducts.find((p) => String(p.id) === String(id));
        return found || null;
    }
};

// Lấy sản phẩm theo Slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
        // json-server hỗ trợ query param ?slug=...
        const response = await axiosClient.get<Product[]>(`/products?slug=${encodeURIComponent(slug)}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0];
        }
        // Thử tìm theo ID nếu slug là số/id
        const fallbackId = await getProductById(slug);
        if (fallbackId) return fallbackId;
    } catch {
        // Fallback sang local
    }
    const found = fallbackProducts.find((p) => p.slug === slug || String(p.id) === String(slug));
    return found || null;
};
