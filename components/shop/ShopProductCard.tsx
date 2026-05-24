"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { trackAddToCart } from "@/lib/analytics/ga4";
import type { HttpTypes } from "@medusajs/types";
import { formatPrice } from "@/lib/utils/formatPrice";

interface ShopProductCardProps {
  product: HttpTypes.StoreProduct;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const firstVariant = product.variants?.[0];
  const imageUrl = product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg";

  // Extract edition from collection or tags
  const collectionTitle = product.collection?.title?.toLowerCase() || "";
  const tags = product.tags || [];
  const edition: "standard" | "pro" | "limited" = collectionTitle.includes("pro") || tags.some((t) => t.value?.toLowerCase().includes("pro"))
    ? "pro"
    : collectionTitle.includes("limited") || tags.some((t) => t.value?.toLowerCase().includes("limited"))
    ? "limited"
    : "standard";

  // Find the lowest price among all variants
  const lowestPrice = product.variants?.reduce((min, variant) => {
    const price = variant.calculated_price?.calculated_amount ?? Infinity;
    return price < min ? price : min;
  }, Infinity) ?? 0;

  const priceDisplay = lowestPrice > 0 ? formatPrice(lowestPrice) : "Contact for price";

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -12 }}
        transition={{ duration: 0.3 }}
        className="group relative z-[10] h-full"
      >
        <div className="relative bg-[var(--color-surface-night)] rounded-[1.5rem] overflow-hidden border border-[var(--color-hairline-violet)] shadow-2xl transition-all duration-500 group-hover:border-[var(--color-lime)]/50">
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-night)] via-transparent to-transparent opacity-70" />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute inset-0 bg-[var(--color-lime)]/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <span className="text-white font-bold tracking-wider uppercase">View Product</span>
            </motion.div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-white/50 line-clamp-1">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-hairline-violet)]">
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs text-white/50">Starts from</span>
                <span className="text-xl font-bold text-[var(--color-accent)]">{priceDisplay}</span>
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="text-white/30"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-lime)]/30 rounded-[1.5rem] transition-colors duration-500 pointer-events-none"
          />
        </div>
      </motion.div>
    </Link>
  );
}

function getColorHex(colorName: string): string {
  const name = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    black: "#1a1a1a",
    grey: "#4a4a4a",
    gray: "#4a4a4a",
    "space grey": "#6b6b6b",
    "stealth black": "#0d0d0d",
    charcoal: "#36454f",
    teal: "#008080",
    purple: "#2d1b4e",
    green: "#228b22",
    red: "#b22222",
    brown: "#5d432c",
    terracotta: "#c04000",
    navy: "#1a1a4e",
    white: "#f5f5f5",
    silver: "#c0c0c0",
    default: "#6b6b6b",
  };
  for (const [key, hex] of Object.entries(colorMap)) {
    if (name.includes(key)) return hex;
  }
  return colorMap.default;
}