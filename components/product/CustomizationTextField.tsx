"use client";

import { Input } from "@/components/ui/input";
import type { TextFieldDef } from "@/lib/customization";

interface CustomizationTextFieldProps {
  field: TextFieldDef;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CustomizationTextField({
  field,
  value,
  onChange,
  error,
}: CustomizationTextFieldProps) {
  const maxChars = field.max_length ?? 12;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxChars) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white uppercase tracking-wider">
          {field.label}
          {field.required ? " *" : ""}
        </label>
        <span className="text-sm text-[var(--color-on-dark-muted)]">
          {value.length}/{maxChars}
        </span>
      </div>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
        maxLength={maxChars}
        className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white placeholder:text-[var(--color-on-dark-faint)]"
      />
      {field.helper && (
        <p className="text-xs text-[var(--color-on-dark-muted)]">{field.helper}</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
