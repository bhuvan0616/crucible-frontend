"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  onCheckout?: () => void;
}

export function CartSummary({ subtotal, shippingCost, total, itemCount, onCheckout }: CartSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-6 sticky top-24"
    >
      <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-on-dark-muted)]">Items ({itemCount})</span>
          <span className="text-white">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-on-dark-muted)]">Shipping</span>
          <span className="text-white">
            {shippingCost === 0 ? (
              <span className="text-[var(--color-lime)]">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="h-px bg-[var(--color-hairline-violet)] my-2" />
        <div className="flex justify-between">
          <span className="text-white font-semibold">Total</span>
          <span className="text-[var(--color-lime)] text-2xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Link href="/checkout" onClick={() => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("checkout_return_url", "/cart");
          }
        }}>
        <Button className="w-full bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] py-3 text-lg font-bold">
          Proceed to Checkout
        </Button>
      </Link>

      <p className="text-xs text-[var(--color-on-dark-muted)] text-center mt-3">
        Free shipping on orders above ₹499
      </p>
    </motion.div>
  );
}