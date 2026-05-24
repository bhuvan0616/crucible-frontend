"use client";

import { type CartItem } from "@/types";
import { formatPrice } from "@/lib/utils/formatPrice";

interface CartTotals {
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totals: CartTotals;
  showShipping?: boolean;
}

export function OrderSummary({ items, totals, showShipping = false }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-dark)] overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.product} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--color-violet)]" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.product}</p>
              <p className="text-xs text-[var(--color-on-dark-muted)]">{item.variantTitle}</p>
              <p className="text-xs text-[var(--color-on-dark-muted)]">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm text-white font-medium">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[var(--color-hairline-violet)]" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-on-dark-muted)]">Subtotal</span>
          <span className="text-white">{formatPrice(totals.subtotal)}</span>
        </div>

        {showShipping && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-dark-muted)]">Shipping</span>
            <span className="text-white">
              {totals.shipping_total === 0 ? "FREE" : formatPrice(totals.shipping_total)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-on-dark-muted)]">Tax</span>
          <span className="text-white">{formatPrice(totals.tax_total)}</span>
        </div>

        <div className="h-px bg-[var(--color-hairline-violet)]" />

        <div className="flex justify-between">
          <span className="text-white font-semibold">Total</span>
          <span className="text-[var(--color-lime)] text-xl font-bold">{formatPrice(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}