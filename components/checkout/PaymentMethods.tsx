"use client";

import { motion } from "framer-motion";

interface PaymentMethodsProps {
  selected: string;
  onSelect: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: "razorpay", name: "Razorpay", icon: "₹" },
  { id: "upi", name: "UPI", icon: "↑" },
  { id: "cards", name: "Cards", icon: "💳" },
];

export function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">Payment Method</label>
      {PAYMENT_METHODS.map((method) => (
        <motion.div
          key={method.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(method.id)}
          className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-center gap-4 ${
            selected === method.id
              ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
              : "border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] hover:border-[var(--color-lime)]"
          }`}
        >
          <span className="text-2xl">{method.icon}</span>
          <span className="text-white font-medium">{method.name}</span>
          {selected === method.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <svg className="w-5 h-5 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}