export interface CartItem {
  id: string;
  productId: string;
  product: string;
  variantTitle: string;
  medusaVariantId: string;
  /** @deprecated Use customizations instead */
  customization: string;
  customizations: import("@/lib/customization").LineItemCustomization[];
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
  available: boolean;
  medusaVariantId?: string;
}

export interface Product {
  id: string;
  title: string;
  variant: string;
  description: string;
  price: number;
  images: string[];
  edition: "standard" | "pro" | "limited";
  colors: ColorVariant[];
  specs: Record<string, string>;
  featured: boolean;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  hex?: string;
  available?: boolean;
}