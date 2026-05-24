"use client";

import { Input } from "@/components/ui/input";

interface CustomizationInputProps {
  value: string;
  onChange: (value: string) => void;
  maxChars: number;
}

export function CustomizationInput({
  value,
  onChange,
  maxChars,
}: CustomizationInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxChars) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white uppercase tracking-wider">
          Custom Text
        </label>
        <span className="text-sm text-[var(--color-on-dark-muted)]">
          {value.length}/{maxChars}
        </span>
      </div>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Your text here (max 12 characters)"
        maxLength={maxChars}
        className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white placeholder:text-[var(--color-on-dark-faint)]"
      />
      <p className="text-xs text-[var(--color-on-dark-muted)]">
        This text will be 3D printed on your product
      </p>
    </div>
  );
}