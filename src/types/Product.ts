
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;

    price: number;
    originalPrice?: number;

    image: string;
    images?: string[];

    brand: string;
    category: string;
    paintType: string;
    capacity: string;

    stock: number;
    isFeatured?: boolean;
    isActive: boolean;
}
