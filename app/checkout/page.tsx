"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethodForm } from "@/components/checkout/ShippingMethodForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  CASHFREE_CHECKOUT_CART_KEY,
  CASHFREE_PROVIDER_ID,
  openCashfreeCheckout,
} from "@/lib/cashfree";
import {
  completeCodOrder,
  getCashfreePaymentSessionId,
  initiateProviderSession,
  retrieveCheckoutCart,
  validatePhoneOnCart,
} from "@/lib/checkout/paymentFlow";
import { pageMainClassName } from "@/components/layout/pageShell";

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}

enum CheckoutStep {
  Address = "address",
  Shipping = "shipping",
  Payment = "payment",
  Confirmation = "confirmation",
}

const stepLabels: Record<CheckoutStep, string> = {
  [CheckoutStep.Address]: "Address",
  [CheckoutStep.Shipping]: "Shipping",
  [CheckoutStep.Payment]: "Payment",
  [CheckoutStep.Confirmation]: "Confirmation",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totals = useCartStore((state) => state.totals);
  const cartId = useCartStore((state) => state.cartId);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Address);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const returnUrl = sessionStorage.getItem("checkout_return_url") || "/cart";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkout_return_url", returnUrl);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/checkout");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleBackNavigation = useCallback(() => {
    const returnUrl = sessionStorage.getItem("checkout_return_url") || "/cart";
    sessionStorage.removeItem("checkout_return_url");
    router.push(returnUrl);
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      handleBackNavigation();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [handleBackNavigation]);

  useEffect(() => {
    if (isAuthenticated && items.length === 0 && cartId) {
      router.push("/cart");
    }
  }, [isAuthenticated, items.length, cartId, router]);

  const handleAddressSubmit = (_address: ShippingAddress) => {
    setCurrentStep(CheckoutStep.Shipping);
  };

  const handleShippingSubmit = (optionId: string) => {
    setSelectedShippingOption(optionId);
    setCurrentStep(CheckoutStep.Payment);
  };

  const handlePaymentComplete = (providerId: string) => {
    if (providerId === CASHFREE_PROVIDER_ID) {
      placeCashfreeOrder();
      return;
    }
    placeCodOrder();
  };

  const placeCodOrder = async () => {
    if (!cartId) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cart = await retrieveCheckoutCart(cartId);
      validatePhoneOnCart(cart);

      const completeResponse = await completeCodOrder(cartId);
      const order = "order" in completeResponse ? completeResponse.order : null;
      const error = "error" in completeResponse ? completeResponse.error : null;

      if (order) {
        setOrderData(order);
        setCurrentStep(CheckoutStep.Confirmation);
        localStorage.removeItem("cart_id");
        clearCart();
      } else if (error) {
        setPaymentError(error.message || "Failed to place order");
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const placeCashfreeOrder = async () => {
    if (!cartId) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cart = await retrieveCheckoutCart(cartId);
      validatePhoneOnCart(cart);

      if (!cart.email) {
        throw new Error("Email is required for checkout. Go back to the address step.");
      }

      const { cart: updatedCart } = await initiateProviderSession(
        cartId,
        CASHFREE_PROVIDER_ID
      );

      const paymentSessionId = getCashfreePaymentSessionId(updatedCart);
      if (!paymentSessionId) {
        throw new Error("Failed to start Cashfree payment. Please try again.");
      }

      sessionStorage.setItem(CASHFREE_CHECKOUT_CART_KEY, cartId);
      await openCashfreeCheckout(paymentSessionId);
    } catch (err: any) {
      setPaymentError(err.message || "Failed to start payment");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className={pageMainClassName}>
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-[var(--color-lime)]">Loading checkout...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Checkout</h1>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto">
            {Object.values(CheckoutStep).filter(s => s !== CheckoutStep.Confirmation).map((step, idx) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  currentStep === step
                    ? "bg-[var(--color-lime)] text-[var(--color-ink-deep)]"
                    : Object.values(CheckoutStep).indexOf(currentStep) > idx
                    ? "bg-[var(--color-lime)] text-[var(--color-ink-deep)]"
                    : "bg-[var(--color-ink-deep)] text-white border border-[var(--color-hairline-violet)]"
                }`}>
                  {idx + 1}
                </div>
                <span className={`ml-2 text-sm hidden sm:inline ${
                  currentStep === step ? "text-white" : "text-[var(--color-on-dark-muted)]"
                }`}>
                  {stepLabels[step]}
                </span>
                {idx < 2 && (
                  <div className="w-8 h-px bg-[var(--color-hairline-violet)] mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-6">
                {currentStep === CheckoutStep.Address && (
                  <AddressForm onSubmit={handleAddressSubmit} />
                )}

                {currentStep === CheckoutStep.Shipping && (
                  <ShippingMethodForm
                    cartId={cartId || ""}
                    onSubmit={handleShippingSubmit}
                    selectedOptionId={selectedShippingOption}
                    onBack={() => setCurrentStep(CheckoutStep.Address)}
                  />
                )}

                {currentStep === CheckoutStep.Payment && (
                  <PaymentForm
                    onComplete={handlePaymentComplete}
                    onBack={() => setCurrentStep(CheckoutStep.Shipping)}
                    isProcessing={isProcessing}
                    cartId={cartId || ""}
                    errorMessage={paymentError}
                  />
                )}

                {currentStep === CheckoutStep.Confirmation && orderData && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-lime)]/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                    <p className="text-[var(--color-on-dark-muted)] mb-6">
                      Thank you for your order. Your order number is <span className="text-[var(--color-lime)] font-bold">#{orderData.display_id}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => router.push(`/orders/${orderData.id}`)}
                        variant="outline"
                        className="border-[var(--color-hairline-violet)]"
                      >
                        View Order
                      </Button>
                      <Button
                        onClick={() => router.push("/shop")}
                        className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                <OrderSummary items={items} totals={totals} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
