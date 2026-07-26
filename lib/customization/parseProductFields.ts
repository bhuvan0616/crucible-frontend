import type {
  CustomizationFieldDef,
  CustomizationWhen,
  ProductCustomizationConfig,
  SelectOption,
  TextFieldDef,
} from "./types";
import { coerceJsonArray } from "./coerceJson";

const DEFAULT_TEXT_MAX = 7;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSelectOptions(raw: unknown): SelectOption[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(isRecord)
    .map((opt) => ({
      value: String(opt.value ?? ""),
      label: String(opt.label ?? opt.value ?? ""),
      image_url: opt.image_url ? String(opt.image_url) : undefined,
    }))
    .filter((opt) => opt.value.length > 0);
}

function parseField(raw: unknown): CustomizationFieldDef | null {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.type !== "string") {
    return null;
  }

  const base = {
    id: raw.id,
    label: String(raw.label ?? raw.id),
    helper: raw.helper ? String(raw.helper) : undefined,
    required: raw.required === true,
  };

  switch (raw.type) {
    case "text":
      return {
        ...base,
        type: "text",
        max_length:
          typeof raw.max_length === "number"
            ? raw.max_length
            : DEFAULT_TEXT_MAX,
        placeholder: raw.placeholder ? String(raw.placeholder) : undefined,
      };
    case "select": {
      const options = parseSelectOptions(raw.options);
      if (options.length === 0) return null;
      return { ...base, type: "select", options };
    }
    case "logo": {
      const options = parseSelectOptions(raw.options);
      const allowUpload = raw.allow_upload !== false;
      if (options.length === 0 && !allowUpload) return null;
      return {
        ...base,
        type: "logo",
        options: options.length > 0 ? options : undefined,
        allow_upload: allowUpload,
        accept: Array.isArray(raw.accept)
          ? raw.accept.map(String)
          : ["image/png", "image/svg+xml", "image/jpeg"],
        max_size_mb:
          typeof raw.max_size_mb === "number" ? raw.max_size_mb : 2,
      };
    }
    default:
      return null;
  }
}

function legacyTextField(metadata: Record<string, unknown>): TextFieldDef | null {
  if (metadata.customization !== true) return null;

  return {
    id: "engraving_text",
    type: "text",
    label: String(metadata.customization_label ?? "Custom Text"),
    helper: metadata.customization_helper
      ? String(metadata.customization_helper)
      : undefined,
    required: metadata.customization_required === true,
    max_length:
      typeof metadata.max_chars === "number"
        ? metadata.max_chars
        : DEFAULT_TEXT_MAX,
    placeholder: metadata.customization_placeholder
      ? String(metadata.customization_placeholder)
      : undefined,
  };
}

function isFieldDefinitionRecord(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.type === "string"
  );
}

function parseFieldsFromRaw(rawFields: unknown): CustomizationFieldDef[] {
  let array = coerceJsonArray(rawFields);
  if (!array && isFieldDefinitionRecord(rawFields)) {
    array = [rawFields];
  }
  if (!array) return [];

  return array
    .map(parseField)
    .filter((field): field is CustomizationFieldDef => field !== null);
}

function isConfigRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && value.fields !== undefined;
}

function parseWhen(raw: unknown): CustomizationWhen | undefined {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    const colon = trimmed.indexOf(":");
    if (colon <= 0 || colon >= trimmed.length - 1) return undefined;
    return {
      option: trimmed.slice(0, colon).trim(),
      value: trimmed.slice(colon + 1).trim(),
    };
  }

  if (!isRecord(raw)) return undefined;

  if (typeof raw.option === "string" && typeof raw.value === "string") {
    const option = raw.option.trim();
    const value = raw.value.trim();
    if (option && value) return { option, value };
  }

  return undefined;
}

function parseCustomizationFieldsSource(
  raw: unknown
): { fields: unknown; when?: unknown } | null {
  if (Array.isArray(raw)) {
    // Common Admin mistake: [{ "when": {...}, "fields": [...] }] instead of a bare object
    if (raw.length === 1 && isConfigRecord(raw[0])) {
      return { fields: raw[0].fields, when: raw[0].when };
    }
    return { fields: raw };
  }

  if (isConfigRecord(raw)) {
    return { fields: raw.fields, when: raw.when };
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    try {
      return parseCustomizationFieldsSource(JSON.parse(trimmed) as unknown);
    } catch {
      return null;
    }
  }

  return null;
}

function configFromCustomizationFieldsRaw(
  rawFields: unknown
): ProductCustomizationConfig | null {
  const source = parseCustomizationFieldsSource(rawFields);
  if (!source) return null;

  const fields = parseFieldsFromRaw(source.fields);
  if (fields.length === 0) return null;

  const when = parseWhen(source.when);
  return when ? { fields, when } : { fields };
}

export function parseProductCustomizationConfig(
  metadata?: Record<string, unknown> | null
): ProductCustomizationConfig {
  if (!metadata) return { fields: [] };

  if (metadata.customization_fields !== undefined) {
    const config = configFromCustomizationFieldsRaw(metadata.customization_fields);
    if (config) return config;
  }

  const legacy = legacyTextField(metadata);
  return legacy ? { fields: [legacy] } : { fields: [] };
}

export function parseProductCustomizationFields(
  metadata?: Record<string, unknown> | null
): CustomizationFieldDef[] {
  return parseProductCustomizationConfig(metadata).fields;
}

export function hasCustomizationFields(
  metadata?: Record<string, unknown> | null
): boolean {
  return parseProductCustomizationConfig(metadata).fields.length > 0;
}
