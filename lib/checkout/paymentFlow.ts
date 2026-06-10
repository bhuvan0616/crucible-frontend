import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import {
  CASHFREE_PROVIDER_ID,
  SYSTEM_PROVIDER_ID,
  type CashfreeSessionData,
} from "@/lib/cashfree";

const CART_PAYMENT_FIELDS =
  "id,email,*shipping_address,*shipping_methods,+payment_collection,*payment_collection.payment_sessions,currency_code,completed_at";

export interface ResolvedOrder {
  id: string;
  display_id?: number;
  status?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validatePhoneOnCart(cart: HttpTypes.StoreCart): void {
  const phone = cart.shipping_address?.phone?.trim();
  if (!phone) {
    throw new Error(
      "Phone number is required for checkout. Go back to the address step and add your phone number."
    );
  }
}

export function validateIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2).length === 10;
  }
  return digits.length === 10;
}

export async function ensureCartEmail(cartId: string, email: string) {
  if (!email.trim()) {
    throw new Error("Email is required for checkout.");
  }
  await sdk.store.cart.update(cartId, { email: email.trim() });
}

export async function retrieveCheckoutCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: CART_PAYMENT_FIELDS,
  });
  return cart;
}

function validateCheckoutReady(cart: HttpTypes.StoreCart): void {
  if (!cart.shipping_address?.address_1) {
    throw new Error(
      "Shipping address is required. Go back to the address step and try again."
    );
  }

  if (!cart.shipping_methods?.length) {
    throw new Error(
      "Shipping method is required. Go back to the shipping step and try again."
    );
  }
}

export async function initiateProviderSession(
  cartId: string,
  providerId: string
) {
  let cart = await retrieveCheckoutCart(cartId);
  validateCheckoutReady(cart);

  // SDK creates payment_collection automatically when missing.
  await sdk.store.payment.initiatePaymentSession(cart as HttpTypes.StoreCart, {
    provider_id: providerId,
  });

  cart = await retrieveCheckoutCart(cartId);
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id === providerId
  );

  if (!session) {
    throw new Error("Failed to create payment session. Please try again.");
  }

  return { cart, session };
}

export function getCashfreePaymentSessionId(
  cart: HttpTypes.StoreCart
): string | null {
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id === CASHFREE_PROVIDER_ID
  );
  const data = session?.data as CashfreeSessionData | undefined;
  return data?.payment_session_id ?? null;
}

export async function completeCodOrder(cartId: string) {
  await initiateProviderSession(cartId, SYSTEM_PROVIDER_ID);
  return sdk.store.cart.complete(cartId);
}

function extractOrderFromCompleteResponse(
  response: Awaited<ReturnType<typeof sdk.store.cart.complete>>
): ResolvedOrder | null {
  if ("order" in response && response.order) {
    return {
      id: response.order.id,
      display_id: response.order.display_id,
      status: response.order.status,
    };
  }
  return null;
}

async function findRecentOrderForCart(
  cartId: string
): Promise<ResolvedOrder | null> {
  const { orders } = await sdk.store.order.list({
    limit: 10,
    order: "-created_at",
    fields: "+cart_id",
  });

  const match = orders?.find(
    (order) => (order as { cart_id?: string }).cart_id === cartId
  );
  if (!match) return null;

  return {
    id: match.id,
    display_id: match.display_id,
    status: match.status,
  };
}

export async function resolveOrderAfterPayment(
  cartId: string,
  options?: { maxAttempts?: number; intervalMs?: number }
): Promise<ResolvedOrder | null> {
  const maxAttempts = options?.maxAttempts ?? 5;
  const intervalMs = options?.intervalMs ?? 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const cart = await retrieveCheckoutCart(cartId);

    if (cart.completed_at) {
      const recentOrder = await findRecentOrderForCart(cartId);
      if (recentOrder) return recentOrder;
    }

    const recentOrder = await findRecentOrderForCart(cartId);
    if (recentOrder) return recentOrder;

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  const completeResponse = await sdk.store.cart.complete(cartId);
  const order = extractOrderFromCompleteResponse(completeResponse);
  if (order) return order;

  return findRecentOrderForCart(cartId);
}

export { CASHFREE_PROVIDER_ID, SYSTEM_PROVIDER_ID };
