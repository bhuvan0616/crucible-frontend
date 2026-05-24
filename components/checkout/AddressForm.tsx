"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { sdk } from "@/lib/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}

interface AddressFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress | null;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, initialData, isLoading = false }: AddressFormProps) {
  const cartId = useCartStore((state) => state.cartId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ShippingAddress>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    address_1: initialData?.address_1 || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    country_code: initialData?.country_code || "IN",
    phone: initialData?.phone || "",
  });

  const handleChange = (field: keyof ShippingAddress) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;

    setIsSubmitting(true);
    try {
      await sdk.store.cart.update(cartId, {
        shipping_address: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          address_1: formData.address_1,
          city: formData.city,
          postal_code: formData.postal_code,
          country_code: formData.country_code,
          phone: formData.phone || undefined,
        },
      });
      onSubmit(formData);
    } catch (error: any) {
      alert(error.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            First Name *
          </label>
          <Input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange("first_name")}
            required
            disabled={isSubmitting || isLoading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            Last Name *
          </label>
          <Input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange("last_name")}
            required
            disabled={isSubmitting || isLoading}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address_1" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Street Address *
        </label>
        <Input
          id="address_1"
          type="text"
          value={formData.address_1}
          onChange={handleChange("address_1")}
          required
          disabled={isSubmitting || isLoading}
          className="w-full"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            City *
          </label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={handleChange("city")}
            required
            disabled={isSubmitting || isLoading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="postal_code" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            Postal Code *
          </label>
          <Input
            id="postal_code"
            type="text"
            value={formData.postal_code}
            onChange={handleChange("postal_code")}
            required
            disabled={isSubmitting || isLoading}
            className="w-full"
            placeholder="400001"
            pattern="[0-9]{6}"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country_code" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            Country *
          </label>
          <select
            id="country_code"
            value={formData.country_code}
            onChange={handleChange("country_code")}
            disabled={isSubmitting || isLoading}
            className="w-full px-3 py-2 bg-[var(--color-surface-dark)] border border-[var(--color-hairline-violet)] rounded-lg text-white"
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            Phone (optional)
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange("phone")}
            disabled={isSubmitting || isLoading}
            className="w-full"
            placeholder="+91 9876543210"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Continue to Shipping"}
      </Button>
    </form>
  );
}