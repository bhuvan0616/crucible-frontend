"use client";

import { Input } from "@/components/ui/input";

interface ShippingForm {
  name: string;
  address: string;
  phone: string;
}

interface CheckoutFormProps {
  form: ShippingForm;
  onChange: (field: string, value: string) => void;
  errors: Partial<Record<keyof ShippingForm, string>>;
}

export function CheckoutForm({ form, onChange, errors }: CheckoutFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
        <Input
          type="text"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter your full name"
          className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Address</label>
        <Input
          type="text"
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Enter your shipping address"
          className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
        <Input
          type="tel"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Enter 10-digit phone number"
          className="bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white"
          maxLength={10}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
}