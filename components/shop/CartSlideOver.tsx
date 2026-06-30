"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectCartTotal, selectCartItemCount } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { CustomizationDisplay } from "@/components/product/CustomizationDisplay";

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSlideOver({ isOpen, onClose }: CartSlideOverProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totals = useCartStore((state) => state.totals);
  const itemCount = useCartStore(selectCartItemCount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-md flex-col bg-[var(--color-ink-deep)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-hairline-violet)] p-6">
              <h2 className="text-xl font-bold text-white">Your Cart ({itemCount})</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-[var(--color-surface-dark)] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-[var(--color-on-dark-muted)] mb-6">Add some products to get started</p>
                  <Button onClick={onClose} className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-[var(--color-surface-dark)] rounded-xl"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--color-primary)] flex-shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.variantTitle} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[var(--color-violet)]" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.product}</h4>
                        <p className="text-xs text-[var(--color-on-dark-muted)]">{item.variantTitle}</p>
                        {item.customizations.length > 0 ? (
                          <CustomizationDisplay
                            customizations={item.customizations}
                            className="text-xs text-[var(--color-lime)] space-y-0.5"
                          />
                        ) : item.customization ? (
                          <p className="text-xs text-[var(--color-lime)]">Custom: {item.customization}</p>
                        ) : null}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[var(--color-hairline-violet)] rounded">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white text-sm"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[var(--color-lime)] font-bold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/40 hover:text-red-500 transition-colors self-start"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--color-hairline-violet)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-on-dark-muted)]">Subtotal</span>
                  <span className="text-2xl font-bold text-[var(--color-lime)]">
                    ₹{totals.total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-on-dark-muted)]">Shipping calculated at checkout</p>
                <Link href="/checkout" onClick={() => {
                  onClose();
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("checkout_return_url", window.location.pathname);
                  }
                }}>
                  <Button className="w-full bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] py-3 text-lg font-bold">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}