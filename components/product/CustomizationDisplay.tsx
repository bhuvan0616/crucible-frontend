"use client";

import type { LineItemCustomization } from "@/lib/customization";
import { formatCustomizationDisplay } from "@/lib/customization";

interface CustomizationDisplayProps {
  customizations: LineItemCustomization[];
  className?: string;
}

export function CustomizationDisplay({
  customizations,
  className = "text-xs text-[var(--color-lime)] mt-1 space-y-0.5",
}: CustomizationDisplayProps) {
  if (customizations.length === 0) return null;

  return (
    <div className={className}>
      {customizations.map((item) => (
        <p key={item.field_id}>
          {item.label}: {formatCustomizationDisplay(item)}
        </p>
      ))}
    </div>
  );
}
