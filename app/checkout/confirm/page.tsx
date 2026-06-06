"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { CASHFREE_CHECKOUT_CART_KEY } from "@/lib/cashfree";
import { resolveOrderAfterPayment } from "@/lib/checkout/paymentFlow";
import { pageMainClassName } from "@/components/layout/pageShell";

type ConfirmStatus = "pending" | "success" | "failed";

function CheckoutConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState<ConfirmStatus>("pending");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [displayId, setDisplayId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const paymentSessionId = searchParams.get("order_id");
    const cartId = sessionStorage.getItem(CASHFREE_CHECKOUT_CART_KEY);

    if (!cartId) {
      setStatus("failed");
      setErrorMessage(
        "We could not find your checkout session. Please return to checkout and try again."
      );
      return;
    }

    let cancelled = false;

    async function confirmPayment() {
      try {
        const order = await resolveOrderAfterPayment(cartId!);
        if (cancelled) return;

        if (order) {
          setOrderId(order.id);
          setDisplayId(order.display_id ?? null);
          setStatus("success");
          sessionStorage.removeItem(CASHFREE_CHECKOUT_CART_KEY);
          localStorage.removeItem("cart_id");
          await clearCart();
          return;
        }

        setStatus("failed");
        setErrorMessage(
          paymentSessionId
            ? "Payment confirmation is still pending or failed. You can retry checkout or contact support if you were charged."
            : "Payment could not be confirmed. Please try checkout again."
        );
      } catch (err: any) {
        if (cancelled) return;
        setStatus("failed");
        setErrorMessage(err.message || "Failed to confirm payment.");
      }
    }

    confirmPayment();
    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-8 text-center">
          {status === "pending" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[var(--color-lime)] border-t-transparent animate-spin" />
              <h1 className="text-2xl font-bold text-white mb-2">Confirming payment...</h1>
              <p className="text-[var(--color-on-dark-muted)]">
                Please wait while we verify your payment with Cashfree.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-lime)]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Payment successful</h1>
              {displayId != null && (
                <p className="text-[var(--color-on-dark-muted)] mb-6">
                  Your order number is{" "}
                  <span className="text-[var(--color-lime)] font-bold">#{displayId}</span>
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {orderId && (
                  <Button
                    onClick={() => router.push(`/orders/${orderId}`)}
                    variant="outline"
                    className="border-[var(--color-hairline-violet)]"
                  >
                    View Order
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Payment not confirmed</h1>
              <p className="text-[var(--color-on-dark-muted)] mb-6">
                {errorMessage ||
                  "We could not confirm your payment. You can return to checkout and try again."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-[var(--color-hairline-violet)]"
                  onClick={() => router.push("/checkout")}
                >
                  Return to checkout
                </Button>
                <Button
                  className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]"
                  onClick={() => router.push("/cart")}
                >
                  View cart
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CheckoutConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className={pageMainClassName}>
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-[var(--color-lime)]">Loading...</div>
          </div>
        </main>
      }
    >
      <CheckoutConfirmContent />
    </Suspense>
  );
}
