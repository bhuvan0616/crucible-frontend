"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PromoCodeInputProps {
  code: string;
  onChange: (code: string) => void;
  onApply: () => void;
  error: string;
  success: string;
}

export function PromoCodeInput({ code, onChange, onApply, error, success }: PromoCodeInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">Promo Code</label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white uppercase"
        />
        <Button
          onClick={onApply}
          variant="outline"
          className="border-[var(--color-lime)] text-[var(--color-lime)] hover:bg-[var(--color-lime)]/10"
        >
          Apply
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && <p className="text-[var(--color-lime)] text-xs">{success}</p>}
    </div>
  );
}