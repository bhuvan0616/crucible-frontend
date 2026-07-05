"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { sdk } from "@/lib/sdk";
import { validateIndianPhone } from "@/lib/checkout/paymentFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SavedAddress {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  address_name?: string;
  is_default_shipping?: boolean;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  address_name?: string;
}

interface AddressFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress | null;
  isLoading?: boolean;
}

function toFormData(address: SavedAddress | ShippingAddress): ShippingAddress {
  return {
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    address_1: address.address_1 || "",
    address_2: address.address_2 || "",
    city: address.city || "",
    postal_code: address.postal_code || "",
    country_code: address.country_code || "in",
    phone: address.phone || "",
    address_name: address.address_name || "",
  };
}

export function AddressForm({ onSubmit, initialData, isLoading = false }: AddressFormProps) {
  const cartId = useCartStore((state) => state.cartId);
  const { user, isAuthenticated, addAddress, setDefaultShippingAddress } = useAuthStore();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [makeNewAddressDefault, setMakeNewAddressDefault] = useState(false);
  const [makeSelectedAddressDefault, setMakeSelectedAddressDefault] = useState(false);

  const [formData, setFormData] = useState<ShippingAddress>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    address_1: initialData?.address_1 || "",
    address_2: initialData?.address_2 || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    country_code: initialData?.country_code || "in",
    phone: initialData?.phone || "",
    address_name: initialData?.address_name || "",
  });

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  const applyAddressToForm = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setFormData(toFormData(address));
    setMakeSelectedAddressDefault(false);
    setShowNewAddressForm(false);
    setPhoneError(null);
  };

  useEffect(() => {
    async function loadAddresses() {
      if (isAuthenticated) {
        try {
          const { addresses } = await sdk.store.customer.listAddress({
            fields: "+address_name,+is_default_shipping",
          });
          const list = (addresses || []) as SavedAddress[];
          setSavedAddresses(list);

          if (list.length > 0) {
            const defaultAddr = list.find((a) => a.is_default_shipping) ?? list[0];
            applyAddressToForm(defaultAddr);
          }
        } catch (error) {
          console.error("Failed to load addresses:", error);
        }
      }
    }
    loadAddresses();
  }, [isAuthenticated]);

  const handleChange = (field: keyof ShippingAddress) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (field === "phone") {
      setPhoneError(null);
    }
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddressSelect = (addressId: string) => {
    const address = savedAddresses.find((a) => a.id === addressId);
    if (address) {
      applyAddressToForm(address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;

    if (savedAddresses.length > 0 && !showNewAddressForm && !selectedAddressId) {
      alert("Please select a saved address or add a new one.");
      return;
    }

    const isUsingSavedAddress = Boolean(selectedAddressId) && !showNewAddressForm;
    const phone = (isUsingSavedAddress ? selectedAddress?.phone : formData.phone)?.trim() ?? "";
    if (!phone) {
      setPhoneError(
        isUsingSavedAddress
          ? "This saved address has no phone number. Add a new address with a phone number to continue."
          : "Phone number is required for payment."
      );
      return;
    }
    if (!validateIndianPhone(phone)) {
      setPhoneError("Enter a valid 10-digit Indian phone number.");
      return;
    }

    if (!user?.email) {
      alert("Your account email is required for checkout.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isNewAddressEntry = showNewAddressForm || savedAddresses.length === 0;
      const shouldSaveNewAddress =
        isAuthenticated &&
        isNewAddressEntry &&
        !isUsingSavedAddress &&
        formData.first_name &&
        formData.address_1 &&
        formData.address_name;

      if (shouldSaveNewAddress) {
        const isFirstAddress = savedAddresses.length === 0;
        await addAddress({
          first_name: formData.first_name,
          last_name: formData.last_name,
          address_1: formData.address_1,
          address_2: formData.address_2,
          city: formData.city,
          postal_code: formData.postal_code,
          country_code: "in",
          phone: formData.phone,
          address_name: formData.address_name,
          is_default_shipping: isFirstAddress ? true : makeNewAddressDefault,
        });
      } else if (isUsingSavedAddress && makeSelectedAddressDefault && selectedAddressId) {
        await setDefaultShippingAddress(selectedAddressId);
      }

      await sdk.store.cart.update(cartId, {
        email: user.email,
        shipping_address: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          address_1: formData.address_1,
          address_2: formData.address_2 || undefined,
          city: formData.city,
          postal_code: formData.postal_code,
          country_code: "in",
          phone,
          address_name: formData.address_name || undefined,
        } as any,
      });
      onSubmit({ ...formData, country_code: "in", phone });
    } catch (error: any) {
      alert(error.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isAuthenticated && savedAddresses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[var(--color-on-dark-muted)]">
              Saved Addresses
            </label>
            <button
              type="button"
              onClick={() => {
                if (showNewAddressForm) {
                  const defaultAddr =
                    savedAddresses.find((a) => a.is_default_shipping) ?? savedAddresses[0];
                  if (defaultAddr) {
                    applyAddressToForm(defaultAddr);
                  }
                } else {
                  setShowNewAddressForm(true);
                  setSelectedAddressId("");
                  setMakeNewAddressDefault(false);
                  setFormData({
                    first_name: "",
                    last_name: "",
                    address_1: "",
                    address_2: "",
                    city: "",
                    postal_code: "",
                    country_code: "in",
                    phone: "",
                    address_name: "",
                  });
                }
              }}
              className="text-sm text-[var(--color-lime)] hover:text-[var(--color-lime-dark)]"
            >
              {showNewAddressForm ? "Use Saved Address" : "+ Add New Address"}
            </button>
          </div>

          {!showNewAddressForm && (
            <div className="space-y-2">
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => handleAddressSelect(address.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAddressId === address.id
                      ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
                      : "border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] hover:border-[var(--color-lime)]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">
                        {address.first_name} {address.last_name}
                        {address.address_name && (
                          <span className="text-[var(--color-lime)] ml-2">({address.address_name})</span>
                        )}
                        {address.is_default_shipping && (
                          <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-[var(--color-lime)]/20 text-[var(--color-lime)]">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--color-on-dark-muted)] mt-1">
                        {address.address_1}
                        {address.address_2 && `, ${address.address_2}`}
                      </p>
                      <p className="text-sm text-[var(--color-on-dark-muted)]">
                        {address.city}, {address.postal_code}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-[var(--color-on-dark-muted)]">{address.phone}</p>
                      )}
                    </div>
                    {selectedAddressId === address.id && (
                      <span className="text-[var(--color-lime)]">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!showNewAddressForm && selectedAddressId && (
            <>
              {selectedAddress && !selectedAddress.is_default_shipping && (
                <label className="flex items-center gap-2 text-sm text-[var(--color-on-dark-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={makeSelectedAddressDefault}
                    onChange={(e) => setMakeSelectedAddressDefault(e.target.checked)}
                    disabled={isSubmitting || isLoading}
                    className="accent-[var(--color-lime)]"
                  />
                  Make this my default shipping address
                </label>
              )}

              {phoneError && (
                <p className="text-sm text-red-400">{phoneError}</p>
              )}
            </>
          )}
        </div>
      )}

      {(showNewAddressForm || savedAddresses.length === 0) && (
        <>
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

          <div>
            <label htmlFor="address_2" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <Input
              id="address_2"
              type="text"
              value={formData.address_2 || ""}
              onChange={handleChange("address_2")}
              disabled={isSubmitting || isLoading}
              className="w-full"
              placeholder="Apt 4B, Suite 100"
            />
          </div>

          <div>
            <label htmlFor="address_name" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
              Address Label *
            </label>
            <Input
              id="address_name"
              type="text"
              value={formData.address_name || ""}
              onChange={handleChange("address_name")}
              disabled={isSubmitting || isLoading}
              required
              className="w-full"
              placeholder="Home, Office, Work"
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
              <label htmlFor="country_display" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
                Country
              </label>
              <div className="w-full px-3 py-2 bg-[var(--color-surface-dark)]/50 border border-[var(--color-hairline-violet)]/30 rounded-lg text-white/70">
                India
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
                Phone *
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleChange("phone")}
                required
                disabled={isSubmitting || isLoading}
                className="w-full"
                placeholder="+91 9876543210"
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-400">{phoneError}</p>
              )}
            </div>
          </div>

          {savedAddresses.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-[var(--color-on-dark-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={makeNewAddressDefault}
                onChange={(e) => setMakeNewAddressDefault(e.target.checked)}
                disabled={isSubmitting || isLoading}
                className="accent-[var(--color-lime)]"
              />
              Set as default shipping address
            </label>
          )}
        </>
      )}

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
