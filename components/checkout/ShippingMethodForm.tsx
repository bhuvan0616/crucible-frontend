"use client";

import { useState, useEffect } from "react";
import { sdk } from "@/lib/sdk";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  amount: number;
}

interface ShippingMethodFormProps {
  cartId: string;
  onSubmit: (optionId: string) => void;
  onOptionSelect?: (option: ShippingOption) => void;
  selectedOptionId?: string | null;
  onBack: () => void;
  isLoading?: boolean;
}

export function ShippingMethodForm({
  cartId,
  onSubmit,
  onOptionSelect,
  selectedOptionId,
  onBack,
  isLoading = false,
}: ShippingMethodFormProps) {
  const refreshCart = useCartStore((state) => state.refreshCart);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(selectedOptionId ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchShippingOptions() {
      if (!cartId || cancelled) {
        if (!cancelled) {
          setIsFetchingOptions(false);
        }
        return;
      }
      
      try {
        if (!cancelled) {
          setIsFetchingOptions(true);
          setError(null);
        }
        
        const queryParams = { cart_id: cartId };
        console.log("Fetching shipping options with params:", queryParams);
        
        const response = await sdk.store.fulfillment.listCartOptions(queryParams);
        console.log("Shipping options response:", response);
        
        if (cancelled) return;
        
        if ("error" in response && response.error) {
          const shippingError = response.error as { message?: string };
          throw new Error(shippingError.message || "Failed to load shipping options");
        }

        const shippingOptions = response.shipping_options || [];
        const options: ShippingOption[] = shippingOptions.map((opt: any) => ({
          id: opt.id,
          name: opt.name,
          description: opt.type?.description,
          amount: opt.calculated_price?.calculated_amount ?? opt.amount ?? 0,
        }));
        
        if (cancelled) return;
        
        setShippingOptions(options);
        
        if (options.length > 0 && !selectedOptionId) {
          setSelectedId(options[0].id);
          onOptionSelect?.(options[0]);
        } else if (selectedOptionId) {
          const selected = options.find((opt) => opt.id === selectedOptionId);
          if (selected) {
            onOptionSelect?.(selected);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to fetch shipping options:", err);
          setError(err.message || "Failed to load shipping options");
        }
      } finally {
        if (!cancelled) {
          setIsFetchingOptions(false);
        }
      }
    }
    
    fetchShippingOptions();
    
    return () => {
      cancelled = true;
    };
    // Intentionally omit onOptionSelect — parent may pass an inline callback
  }, [cartId, selectedOptionId]);

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
      await refreshCart();
      onSubmit(selectedId);
    } catch (err: any) {
      setError(err.message || "Failed to select shipping method");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingOptions) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Select Shipping Method</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-[var(--color-surface-dark)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Select Shipping Method</h3>

      {shippingOptions.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-on-dark-muted)]">
          No shipping options available for your address.
        </div>
      ) : (
        <div className="space-y-3">
          {shippingOptions.map((option) => (
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
                onChange={() => {
                  setSelectedId(option.id);
                  onOptionSelect?.(option);
                }}
                className="mt-1 accent-[var(--color-lime)]"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{option.name}</span>
                  <span className="text-[var(--color-lime)] font-bold">
                    {option.amount === 0 ? "FREE" : formatPrice(option.amount)}
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
      )}

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
          disabled={!selectedId || isSubmitting || isLoading || shippingOptions.length === 0}
          className="flex-1 bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    </form>
  );
}