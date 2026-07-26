import type {
  CustomizationFieldDef,
  CustomizationFormValues,
  LogoFieldDef,
  LogoFieldValue,
} from "./types";

export interface ValidationError {
  fieldId: string;
  message: string;
}

function isLogoValue(value: unknown): value is LogoFieldValue {
  if (!value || typeof value !== "object") return false;
  const v = value as LogoFieldValue;
  return v.source === "preset" || v.source === "upload";
}

function validateLogoField(
  field: LogoFieldDef,
  value: unknown
): ValidationError | null {
  if (!isLogoValue(value)) {
    return field.required
      ? { fieldId: field.id, message: `${field.label} is required` }
      : null;
  }

  if (value.source === "preset") {
    if (!value.value.trim()) {
      return { fieldId: field.id, message: `${field.label} is required` };
    }
    const allowed = field.options?.some((opt) => opt.value === value.value);
    if (field.options?.length && !allowed) {
      return { fieldId: field.id, message: `Invalid ${field.label} selection` };
    }
    return null;
  }

  if (!value.url.trim() || !value.filename.trim()) {
    return { fieldId: field.id, message: `${field.label} upload is incomplete` };
  }

  return null;
}

export function validateCustomizationValues(
  fields: CustomizationFieldDef[],
  values: CustomizationFormValues
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const raw = values[field.id];

    if (field.type === "text") {
      const text = typeof raw === "string" ? raw.trim() : "";
      if (field.required && !text) {
        errors.push({ fieldId: field.id, message: `${field.label} is required` });
        continue;
      }
      if (text.length > (field.max_length ?? 7)) {
        errors.push({
          fieldId: field.id,
          message: `${field.label} must be at most ${field.max_length ?? 7} characters`,
        });
      }
      continue;
    }

    if (field.type === "select") {
      const selected = typeof raw === "string" ? raw.trim() : "";
      if (field.required && !selected) {
        errors.push({ fieldId: field.id, message: `${field.label} is required` });
        continue;
      }
      if (selected && !field.options.some((opt) => opt.value === selected)) {
        errors.push({ fieldId: field.id, message: `Invalid ${field.label} selection` });
      }
      continue;
    }

    if (field.type === "logo") {
      const error = validateLogoField(field, raw);
      if (error) errors.push(error);
    }
  }

  return errors;
}

export function validateLogoFile(
  file: File,
  field: LogoFieldDef
): string | null {
  const accept = field.accept ?? ["image/png", "image/svg+xml", "image/jpeg"];
  const maxBytes = (field.max_size_mb ?? 2) * 1024 * 1024;

  if (!accept.includes(file.type)) {
    return `File type not allowed. Use ${accept.map((t) => t.split("/")[1]?.toUpperCase()).join(", ")}.`;
  }

  if (file.size > maxBytes) {
    return `File must be ${field.max_size_mb ?? 2} MB or smaller.`;
  }

  return null;
}
