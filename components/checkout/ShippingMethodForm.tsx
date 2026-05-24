"use client";

import { useState } from "react";
import { sdk } from "@/lib/sdk";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

interface ShippingMethodFormProps {
  cartId: string;
  onSubmit: (optionId: string) => void;
  selectedOptionId?: string | null;
  onBack: () => void;
  isLoading?: boolean;
}

interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  amount: number;
}

const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "so_standard",
    name: "Standard Shipping",
    description: "Delivery in 5-7 business days",
    amount: 499,
  },
  {
    id: "so_express",
    name: "Express Shipping",
    description: "Delivery in 2-3 business days",
    amount: 999,
  },
];

export function ShippingMethodForm({
  cartId,
  onSubmit,
  selectedOptionId,
  onBack,
  isLoading = false,
}: ShippingMethodFormProps) {
  const [selectedId, setSelectedId] = useState<string | null>(selectedOptionId ?? MOCK_SHIPPING_OPTIONS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId || !selectedId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await sdk.store.cart.addShippingMethod(cartId, {
        option_id: selectedId,
        data: {},
      });
      onSubmit(selectedId);
    } catch (err: any) {
      setError(err.message || "Failed to select shipping method");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Select Shipping Method</h3>

      <div className="space-y-3">
        {MOCK_SHIPPING_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedId === option.id
                ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
                : "border-[var(--color-hairline-violet)] bg-[var(--color-surface-dark)] hover:border-[var(--color-lime)]/50"
            }`}
          >
            <input
              type="radio"
              name="shipping_method"
              value={option.id}
              checked={selectedId === option.id}
              onChange={() => setSelectedId(option.id)}
              className="mt-1 accent-[var(--color-lime)]"
            />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{option.name}</span>
                <span className="text-[var(--color-lime)] font-bold">
                  {formatPrice(option.amount)}
                </span>
              </div>
              {option.description && (
                <p className="text-sm text-[var(--color-on-dark-muted)] mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!selectedId || isSubmitting || isLoading}
          className="flex-1 bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    </form>
  );
}