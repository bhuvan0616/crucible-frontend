import type { LineItemCustomization, LineItemCustomizationMetadata } from "./types";
import { coerceJsonArray } from "./coerceJson";

function isCustomizationArray(value: unknown): value is LineItemCustomization[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as LineItemCustomization).field_id === "string" &&
      typeof (item as LineItemCustomization).value === "string"
  );
}

export function parseLineItemCustomizations(
  metadata?: Record<string, unknown> | null
): LineItemCustomization[] {
  if (!metadata) return [];

  const raw = metadata as LineItemCustomizationMetadata;

  const parsedCustomizations = coerceJsonArray(raw.customizations);
  if (parsedCustomizations && isCustomizationArray(parsedCustomizations)) {
    return parsedCustomizations;
  }

  if (typeof raw.customization === "string" && raw.customization.trim()) {
    return [
      {
        field_id: "engraving_text",
        type: "text",
        label: "Custom Text",
        value: raw.customization,
        display: raw.customization,
      },
    ];
  }

  return [];
}

export function formatCustomizationDisplay(
  customization: LineItemCustomization
): string {
  if (customization.display) return customization.display;
  if (customization.filename) return customization.filename;
  return customization.value;
}
