"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

interface PaymentFormProps {
  onComplete: () => void;
  onBack: () => void;
  isProcessing: boolean;
  cartId: string;
}

export function PaymentForm({ onComplete, onBack, isProcessing }: PaymentFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Payment</h3>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-surface-dark)]">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment_provider"
              value="system"
              defaultChecked
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
        </div>

        <div className="p-4 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-surface-dark)] opacity-60">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment_provider"
              value="stripe"
              disabled
              className="accent-[var(--color-lime)]"
            />
            <div className="flex-grow">
              <span className="font-medium text-white">Stripe</span>
              <p className="text-sm text-[var(--color-on-dark-muted)]">
                Credit/Debit Card, UPI, etc. (Coming soon)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface-dark)] rounded-lg p-4 border border-[var(--color-hairline-violet)]">
        <p className="text-sm text-[var(--color-on-dark-muted)] mb-2">
          Your payment will be processed after you confirm your order. For cash on delivery, payment is collected upon delivery.
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
          onClick={onComplete}
          disabled={isProcessing}
          className="flex-1 bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}