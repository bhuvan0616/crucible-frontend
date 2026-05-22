"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
  const price = firstVariant?.calculated_price ?? 0;
  const imageUrl = product.thumbnail || product.images?.[0]?.url || "/placeholder-product.png";

  // Extract edition from collection or tags
  const collectionTitle = product.collection?.title?.toLowerCase() || "";
  const tags = product.tags || [];
  const edition: "standard" | "pro" | "limited" = collectionTitle.includes("pro") || tags.some((t) => t.value?.toLowerCase().includes("pro"))
    ? "pro"
    : collectionTitle.includes("limited") || tags.some((t) => t.value?.toLowerCase().includes("limited"))
    ? "limited"
    : "standard";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variant: firstVariant?.title || "Default",
      customization: "",
      quantity: 1,
      price,
      imageUrl,
    });
    trackAddToCart(product.id, product.title, price, 1);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] hover:border-[var(--color-lime)] transition-colors overflow-hidden group h-full">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative aspect-square bg-[var(--color-surface-dark)] overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {edition === "limited" && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-[var(--color-pink)] text-white text-xs font-bold rounded">
                  LIMITED
                </span>
              )}
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                onClick={handleQuickAdd}
                className="absolute bottom-3 right-3 px-3 py-2 bg-[var(--color-lime)] text-[var(--color-ink-deep)] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Quick Add
              </motion.button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-xs text-[var(--color-on-dark-muted)] uppercase tracking-wider mb-1">
                  {edition}
                </p>
                <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-[var(--color-on-dark-faint)] mb-3 line-clamp-1">
                  {firstVariant?.title || "Default"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-[var(--color-lime)] font-bold text-lg">
                  {formatPrice(price)}
                </p>
                <div className="flex gap-1">
                  {product.variants?.slice(0, 3).map((variant, index) => (
                    <span
                      key={index}
                      className="w-4 h-4 rounded-full border border-[var(--color-hairline-violet)]"
                      style={{ backgroundColor: getColorHex(variant.title || "") }}
                      title={variant.title || ""}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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