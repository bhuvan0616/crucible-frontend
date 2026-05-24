"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore, selectCartItemCount } from "@/store/cartStore";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totals = useCartStore((state) => state.totals);
  const itemCount = useCartStore(selectCartItemCount);
  const initCart = useCartStore((state) => state.initCart);
  const isInitialized = useCartStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initCart();
    }
  }, [isInitialized, initCart]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-[var(--color-ink-deep)] rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[var(--color-ink-deep)] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-[var(--color-ink-deep)] flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-[var(--color-on-dark-muted)] mb-8">Add some products to get started</p>
            <Link href="/shop">
              <Button className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Your Cart</h1>
          <p className="text-[var(--color-on-dark-muted)]">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div>
            <CartSummary
              subtotal={totals.subtotal}
              shippingCost={totals.shipping_total}
              total={totals.total}
              itemCount={itemCount}
            />
          </div>
        </div>
      </div>
    </main>
  );
}