"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { trackPurchase } from "@/lib/analytics/ga4";
import { Button } from "@/components/ui/button";

interface OrderData {
  items: { productId: string; variant: string; quantity: number; price: number }[];
  form: { name: string; address: string; phone: string };
  selectedDelivery: string;
  promoCode: string;
  discount: number;
  shipping: number;
  total: number;
  selectedPayment: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("orderData");
    if (!stored) {
      router.push("/cart");
      return;
    }

    const data = JSON.parse(stored) as OrderData;
    setOrderData(data);

    const newOrderId = crypto.randomUUID().split("-")[0].toUpperCase();
    setOrderId(newOrderId);

    trackPurchase(
      newOrderId,
      data.total,
      data.items.map((item) => ({
        item_id: item.productId,
        item_name: item.productId,
        quantity: item.quantity,
      }))
    );

    sessionStorage.removeItem("orderData");
  }, [router]);

  if (!orderData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-lime)] flex items-center justify-center"
          >
            <svg className="w-12 h-12 text-[var(--color-ink-deep)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-3">Order Placed Successfully!</h1>
          <p className="text-[var(--color-on-dark-muted)] mb-6">
            Thank you for your order
          </p>

          <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-6 mb-8">
            <p className="text-sm text-[var(--color-on-dark-muted)] mb-1">Order Number</p>
            <p className="text-2xl font-bold text-[var(--color-lime)] mb-4">#{orderId}</p>

            <div className="h-px bg-[var(--color-hairline-violet)] my-4" />

            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[var(--color-on-dark-muted)]">Subtotal</span>
                <span className="text-white">₹{((orderData.total - orderData.shipping + orderData.discount) / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-on-dark-muted)]">Shipping</span>
                <span className="text-white">{orderData.shipping === 0 ? "FREE" : `₹${(orderData.shipping / 100).toFixed(0)}`}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-on-dark-muted)]">Discount</span>
                  <span className="text-[var(--color-lime)]">-₹{(orderData.discount / 100).toFixed(0)}</span>
                </div>
              )}
              <div className="h-px bg-[var(--color-hairline-violet)] my-2" />
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[var(--color-lime)] text-xl font-bold">₹{(orderData.total / 100).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-white mb-3">Shipping To</h3>
            <p className="text-white">{orderData.form.name}</p>
            <p className="text-[var(--color-on-dark-muted)] text-sm">{orderData.form.address}</p>
            <p className="text-[var(--color-on-dark-muted)] text-sm">{orderData.form.phone}</p>
          </div>

          <Link href="/shop">
            <Button className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] px-8 py-3 text-lg font-bold">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}