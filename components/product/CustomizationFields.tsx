"use client";

import type {
  CustomizationFieldDef,
  CustomizationFormValues,
} from "@/lib/customization";
import { CustomizationTextField } from "@/components/product/CustomizationTextField";
import { CustomizationLogoField } from "@/components/product/CustomizationLogoField";

interface CustomizationFieldsProps {
  fields: CustomizationFieldDef[];
  values: CustomizationFormValues;
  onChange: (fieldId: string, value: CustomizationFormValues[string]) => void;
  errors?: Record<string, string>;
}

export function CustomizationFields({
  fields,
  values,
  onChange,
  errors = {},
}: CustomizationFieldsProps) {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        if (field.type === "text") {
          const textValue = values[field.id];
          return (
            <CustomizationTextField
              key={field.id}
              field={field}
              value={typeof textValue === "string" ? textValue : ""}
              onChange={(value) => onChange(field.id, value)}
              error={errors[field.id]}
            />
          );
        }

        if (field.type === "select") {
          const selectValue = values[field.id];
          return (
            <div key={field.id} className="space-y-3">
              <label className="text-sm font-semibold text-white uppercase tracking-wider block">
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <select
                value={typeof selectValue === "string" ? selectValue : ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full rounded-md bg-[var(--color-ink-deep)] border border-[var(--color-hairline-violet)] text-white px-3 py-2 text-sm"
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {field.helper && (
                <p className="text-xs text-[var(--color-on-dark-muted)]">{field.helper}</p>
              )}
              {errors[field.id] && (
                <p className="text-xs text-red-400">{errors[field.id]}</p>
              )}
            </div>
          );
        }

        if (field.type === "logo") {
          const logoValue = values[field.id];
          return (
            <CustomizationLogoField
              key={field.id}
              field={field}
              value={
                logoValue &&
                typeof logoValue === "object" &&
                "source" in logoValue
                  ? logoValue
                  : undefined
              }
              onChange={(value) => onChange(field.id, value)}
              error={errors[field.id]}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
