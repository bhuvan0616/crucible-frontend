"use client";

import { motion } from "framer-motion";
import { ShopProductCard } from "./ShopProductCard";
import type { HttpTypes } from "@medusajs/types";

interface ProductGridProps {
  products: HttpTypes.StoreProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-[var(--color-ink-deep)] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-lime)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No products found
        </h3>
        <p className="text-[var(--color-on-dark-muted)]">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      layout
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <ShopProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}