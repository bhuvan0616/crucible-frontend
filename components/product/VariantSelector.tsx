"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Select } from "@/components/ui/select";

interface ProductOption {
  title: string;
  values: Array<{ value: string; hex?: string; variantId: string; price: number }>;
}

interface VariantSelectorProps {
  option: ProductOption;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function VariantSelector({
  option,
  selectedValue,
  onSelect,
}: VariantSelectorProps) {
  const isColor = option.title.toLowerCase().includes('color') || option.title.toLowerCase() === 'colour';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--color-lime)] uppercase tracking-wider">
          {option.title}
        </label>
      </div>

      {isColor ? (
        <div className="flex flex-wrap gap-3">
          {option.values.map((val) => (
            <motion.button
              key={val.value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(val.value)}
              className={`relative w-10 h-10 rounded-full border-2 transition-colors ${
                selectedValue === val.value
                  ? "border-white"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: val.hex || "#6b6b6b" }}
              title={val.value}
            >
              {selectedValue === val.value && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      ) : (
        <Select
          value={selectedValue}
          onValueChange={onSelect}
          options={option.values.map((val) => ({
            value: val.value,
            label: val.value,
          }))}
        />
      )}
    </div>
  );
}