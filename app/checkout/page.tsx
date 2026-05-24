"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore, selectCartItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethodForm } from "@/components/checkout/ShippingMethodForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";

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
  const itemCount = useCartStore(selectCartItemCount);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Address);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/checkout");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && items.length === 0 && cartId) {
      router.push("/cart");
    }
  }, [isAuthenticated, items.length, cartId, router]);

  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep(CheckoutStep.Shipping);
  };

  const handleShippingSubmit = (optionId: string) => {
    setSelectedShippingOption(optionId);
    setCurrentStep(CheckoutStep.Payment);
  };

  const handlePaymentComplete = () => {
    placeOrder();
  };

  const placeOrder = async () => {
    if (!cartId) return;
    setIsProcessing(true);

    try {
      const response = await sdk.store.cart.complete(cartId);
      const order = "order" in response ? response.order : null;
      const error = "error" in response ? response.error : null;

      if (order) {
        setOrderData(order);
        setCurrentStep(CheckoutStep.Confirmation);
        localStorage.removeItem("cart_id");
        clearCart();
      } else if (error) {
        alert(error.message || "Failed to place order");
      }
    } catch (err: any) {
      alert(err.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
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
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
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
                    <Button
                      onClick={() => router.push("/shop")}
                      className="bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)]"
                    >
                      Continue Shopping
                    </Button>
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