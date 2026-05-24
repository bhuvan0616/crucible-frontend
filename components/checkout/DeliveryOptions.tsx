"use client";

import { motion } from "framer-motion";

interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const DELIVERY_OPTIONS = [
  { id: "standard", name: "Standard Delivery", price: 0, description: "5-7 business days" },
  { id: "express", name: "Express Delivery", price: 9900, description: "2-3 business days" },
];

interface DeliveryOptionsProps {
  selected: string;
  onSelect: (id: string) => void;
  subtotal: number;
}

export function DeliveryOptions({ selected, onSelect, subtotal }: DeliveryOptionsProps) {
  const freeShipping = subtotal >= 49900;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">Delivery Method</label>
      {DELIVERY_OPTIONS.map((option) => {
        const effectivePrice = option.id === "standard" && freeShipping ? 0 : option.price;
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={`relative p-4 rounded-xl border cursor-pointer transition-colors ${
              selected === option.id
                ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
                : "border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] hover:border-[var(--color-lime)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === option.id ? "border-[var(--color-lime)]" : "border-[var(--color-hairline-violet)]"
                  }`}
                >
                  {selected === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-[var(--color-lime)]"
                    />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{option.name}</p>
                  <p className="text-xs text-[var(--color-on-dark-muted)]">{option.description}</p>
                </div>
              </div>
              <span className="text-[var(--color-lime)] font-bold">
                {effectivePrice === 0 ? "FREE" : `₹${(effectivePrice / 100).toFixed(0)}`}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}