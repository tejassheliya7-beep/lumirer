export type GoldPurity = '14K' | '18K' | '22K';
export type MetalColor = 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Two-Tone';
export type DiamondShape = 'Round' | 'Princess' | 'Cushion' | 'Oval' | 'Emerald' | 'Pear' | 'Marquise' | 'Asscher' | 'Heart';

export interface Product {
  id: string;
  name: string;
  category: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  goldWeight: number;
  goldPurity: GoldPurity;
  metalColor: MetalColor;
  diamondWeight?: number;
  diamondType?: string;
  diamondShape?: DiamondShape;
  diamondCount?: number; // number of diamond stones used
  images: string[];
  description: string;
  specifications: {
    label: string;
    value: string;
  }[];
  inStock: boolean;
  deliveryDays: number;
  isBestseller?: boolean;
  isNew?: boolean;
  certifications: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  parentSlug?: string;
  subcategories?: Category[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface FilterState {
  priceRange: [number, number];
  goldPurity: string[];
  metalColor: string[];
  diamondType: string[];
  diamondShape: string[];
  weightRange: [number, number];
  inStock: boolean;
  sortBy: 'price-low' | 'price-high' | 'newest' | 'bestseller';
}
