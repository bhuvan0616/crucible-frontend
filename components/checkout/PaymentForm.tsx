"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";
import {
  CASHFREE_PROVIDER_ID,
  SYSTEM_PROVIDER_ID,
} from "@/lib/cashfree";

interface PaymentFormProps {
  onComplete: (providerId: string) => void;
  onBack: () => void;
  isProcessing: boolean;
  cartId: string;
  errorMessage?: string | null;
}

type PaymentChoice = "cashfree" | "system";

export function PaymentForm({
  onComplete,
  onBack,
  isProcessing,
  cartId,
  errorMessage,
}: PaymentFormProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentChoice>("cashfree");
  const [cashfreeAvailable, setCashfreeAvailable] = useState(true);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCartCurrency() {
      if (!cartId) {
        setIsLoadingCart(false);
        return;
      }

      try {
        const { cart } = await sdk.store.cart.retrieve(cartId, {
          fields: "currency_code",
        });
        if (cancelled) return;

        const isInr = (cart.currency_code || "inr").toLowerCase() === "inr";
        setCashfreeAvailable(isInr);
        if (!isInr) {
          setSelectedProvider("system");
        }
      } catch {
        if (!cancelled) {
          setCashfreeAvailable(false);
          setSelectedProvider("system");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCart(false);
        }
      }
    }

    loadCartCurrency();
    return () => {
      cancelled = true;
    };
  }, [cartId]);

  const handleSubmit = () => {
    const providerId =
      selectedProvider === "cashfree" ? CASHFREE_PROVIDER_ID : SYSTEM_PROVIDER_ID;
    onComplete(providerId);
  };

  const buttonLabel =
    selectedProvider === "cashfree"
      ? isProcessing
        ? "Redirecting..."
        : "Pay now"
      : isProcessing
        ? "Processing..."
        : "Place order";

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Payment</h3>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        {cashfreeAvailable && (
          <label className="block p-4 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-surface-dark)] cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_provider"
                value="cashfree"
                checked={selectedProvider === "cashfree"}
                onChange={() => setSelectedProvider("cashfree")}
                disabled={isProcessing || isLoadingCart}
                className="accent-[var(--color-lime)]"
              />
              <div className="flex-grow">
                <span className="font-medium text-white">
                  Pay with UPI, Cards, Net Banking (Cashfree)
                </span>
                <p className="text-sm text-[var(--color-on-dark-muted)]">
                  Secure online payment via Cashfree
                </p>
              </div>
            </div>
          </label>
        )}

        <label className="block p-4 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-surface-dark)] cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment_provider"
              value="system"
              checked={selectedProvider === "system"}
              onChange={() => setSelectedProvider("system")}
              disabled={isProcessing || isLoadingCart}
              className="accent-[var(--color-lime)]"
            />
            <div className="flex-grow">
              <span className="font-medium text-white">System Payment</span>
              <p className="text-sm text-[var(--color-on-dark-muted)]">
                Pay manually (Cash on Delivery, Bank Transfer)
              </p>
            </div>
            <div className="text-[var(--color-lime)] text-sm font-medium">
              COD Available
            </div>
          </div>
        </label>
      </div>

      <div className="bg-[var(--color-surface-dark)] rounded-lg p-4 border border-[var(--color-hairline-violet)]">
        <p className="text-sm text-[var(--color-on-dark-muted)]">
          {selectedProvider === "cashfree"
            ? "You will be redirected to Cashfree to complete payment securely."
            : "For cash on delivery, payment is collected upon delivery."}
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || isLoadingCart}
          className="flex-1 bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
