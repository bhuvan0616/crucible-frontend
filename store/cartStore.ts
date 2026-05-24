"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sdk, initRegion } from "@/lib/sdk";
import type { CartItem } from "@/types";
import type { HttpTypes } from "@medusajs/types";

interface CartTotals {
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
}

interface CartStore {
  cartId: string | null;
  items: CartItem[];
  totals: CartTotals;
  isLoading: boolean;
  isInitialized: boolean;
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number, customization: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

function extractTotals(cart: HttpTypes.StoreCart): CartTotals {
  return {
    subtotal: typeof cart.subtotal === 'number' ? cart.subtotal : (cart.subtotal as any)?.numeric ?? 0,
    shipping_total: typeof cart.shipping_total === 'number' ? cart.shipping_total : (cart.shipping_total as any)?.numeric ?? 0,
    tax_total: typeof cart.tax_total === 'number' ? cart.tax_total : (cart.tax_total as any)?.numeric ?? 0,
    total: typeof cart.total === 'number' ? cart.total : (cart.total as any)?.numeric ?? 0,
  };
}

function transformLineItem(item: HttpTypes.StoreCartLineItem): CartItem {
  const raw = item as any;
  return {
    id: item.id,
    productId: item.product_id || "",
    product: raw.variant?.product?.title || "",
    variantTitle: raw.variant?.title || "Default",
    medusaVariantId: item.variant_id || "",
    customization: (item.metadata as Record<string, string>)?.customization || "",
    quantity: item.quantity,
    price: raw.variant?.calculated_price?.calculated_amount ?? item.unit_price ?? 0,
    imageUrl: raw.variant?.product?.thumbnail || raw.variant?.product?.images?.[0]?.url || "",
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      totals: { subtotal: 0, shipping_total: 0, tax_total: 0, total: 0 },
      isLoading: false,
      isInitialized: false,

      initCart: async () => {
        await initRegion();

        const existingCartId = localStorage.getItem("cart_id");
        if (existingCartId) {
          try {
            const { cart } = await sdk.store.cart.retrieve(existingCartId, {
              fields: "id,*items,*items.variant,*items.variant.product,subtotal,shipping_total,tax_total,total",
            });
            set({
              cartId: cart.id,
              items: cart.items?.map(transformLineItem) ?? [],
              totals: extractTotals(cart),
              isInitialized: true,
            });
            return;
          } catch {
            localStorage.removeItem("cart_id");
          }
        }
        try {
          const { cart } = await sdk.store.cart.create({});
          localStorage.setItem("cart_id", cart.id);
          set({
            cartId: cart.id,
            items: [],
            totals: extractTotals(cart),
            isInitialized: true,
          });
        } catch {
          set({ isInitialized: true });
        }
      },

      addItem: async (variantId: string, quantity: number, customization: string) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const { cart } = await sdk.store.cart.createLineItem(cartId, {
            variant_id: variantId,
            quantity,
            metadata: { customization: customization.slice(0, 12) },
          });
          set({
            items: cart.items?.map(transformLineItem) ?? [],
            totals: extractTotals(cart),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineItemId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity });
          set({
            items: cart.items?.map(transformLineItem) ?? [],
            totals: extractTotals(cart),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineItemId: string) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const { deleted, parent: cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId);
          if (deleted && cart) {
            set({
              items: cart.items?.map(transformLineItem) ?? [],
              totals: extractTotals(cart),
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        localStorage.removeItem("cart_id");
        try {
          const { cart } = await sdk.store.cart.create({});
          set({
            cartId: cart.id,
            items: [],
            totals: extractTotals(cart),
          });
          localStorage.setItem("cart_id", cart.id);
        } catch {
          set({
            cartId: null,
            items: [],
            totals: { subtotal: 0, shipping_total: 0, tax_total: 0, total: 0 },
          });
        }
      },
    }),
    {
      name: "crucible-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);

export const selectCartItemCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: CartStore) =>
  state.totals.total;

export const selectCartSubtotal = (state: CartStore) =>
  state.totals.subtotal;

export const selectShippingCost = (state: CartStore) =>
  state.totals.shipping_total;

export const selectCartTotalWithShipping = (state: CartStore) =>
  state.totals.total;