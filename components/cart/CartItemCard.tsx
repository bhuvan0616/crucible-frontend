"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CartItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)]"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--color-surface-dark)] flex-shrink-0">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.variantTitle} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-[var(--color-violet)]" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">{item.product}</h4>
        <p className="text-xs text-[var(--color-on-dark-muted)]">{item.variantTitle}</p>
        {item.customization && (
          <p className="text-xs text-[var(--color-lime)] mt-1">Custom: {item.customization}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[var(--color-hairline-violet)] rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center text-white text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <p className="text-[var(--color-lime)] font-bold">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-white/40 hover:text-red-500 transition-colors self-start"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  );
}