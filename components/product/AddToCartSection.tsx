"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

interface AddToCartSectionProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  price: number;
}

export function AddToCartSection({
  quantity,
  onQuantityChange,
  onAddToCart,
  price,
}: AddToCartSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[var(--color-hairline-violet)] rounded-lg">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[var(--color-ink-deep)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-white font-medium text-lg">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[var(--color-ink-deep)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="flex-grow">
          <p className="text-sm text-[var(--color-on-dark-muted)] mb-1">Subtotal</p>
          {price > 0 ? (
            <p className="text-2xl font-bold text-[var(--color-lime)]">
              {formatPrice(price * quantity)}
            </p>
          ) : (
            <p className="text-lg font-bold text-[var(--color-on-dark-muted)]">
              --
            </p>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        className="w-full py-4 bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-bold text-lg rounded-xl hover:bg-[var(--color-lime-dark)] transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      </motion.button>
    </div>
  );
}