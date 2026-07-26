import type {
  CustomizationFieldDef,
  CustomizationFormValues,
  LineItemCustomization,
  LogoFieldValue,
} from "./types";

function isLogoValue(value: unknown): value is LogoFieldValue {
  if (!value || typeof value !== "object") return false;
  const v = value as LogoFieldValue;
  return v.source === "preset" || v.source === "upload";
}

export function buildLineItemCustomizations(
  fields: CustomizationFieldDef[],
  values: CustomizationFormValues
): LineItemCustomization[] {
  const result: LineItemCustomization[] = [];

  for (const field of fields) {
    const raw = values[field.id];

    if (field.type === "text") {
      const text = typeof raw === "string" ? raw.trim() : "";
      if (!text) continue;
      result.push({
        field_id: field.id,
        type: "text",
        label: field.label,
        value: text.slice(0, field.max_length ?? 7),
        display: text.slice(0, field.max_length ?? 7),
      });
      continue;
    }

    if (field.type === "select") {
      const selected = typeof raw === "string" ? raw.trim() : "";
      if (!selected) continue;
      const option = field.options.find((opt) => opt.value === selected);
      result.push({
        field_id: field.id,
        type: "select",
        label: field.label,
        value: selected,
        display: option?.label ?? selected,
        image_url: option?.image_url,
      });
      continue;
    }

    if (field.type === "logo" && isLogoValue(raw)) {
      if (raw.source === "preset") {
        if (!raw.value.trim()) continue;
        result.push({
          field_id: field.id,
          type: "logo",
          label: field.label,
          source: "preset",
          value: raw.value,
          display: raw.display,
          image_url: raw.image_url,
        });
        continue;
      }

      if (!raw.url.trim()) continue;
      result.push({
        field_id: field.id,
        type: "logo",
        label: field.label,
        source: "upload",
        value: raw.url,
        filename: raw.filename,
        display: raw.filename,
        image_url: raw.url,
      });
    }
  }

  return result;
}

export function buildLineItemMetadata(
  fields: CustomizationFieldDef[],
  values: CustomizationFormValues
): Record<string, unknown> {
  const customizations = buildLineItemCustomizations(fields, values);
  if (customizations.length === 0) return {};

  const metadata: Record<string, unknown> = { customizations };

  const legacyText = customizations.find(
    (c) => c.type === "text" && c.field_id === "engraving_text"
  );
  if (legacyText) {
    metadata.customization = legacyText.value;
  }

  return metadata;
}
