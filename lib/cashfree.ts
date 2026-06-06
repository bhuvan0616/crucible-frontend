import { load } from "@cashfreepayments/cashfree-js";

export const CASHFREE_PROVIDER_ID = "pp_cashfree_cashfree";
export const SYSTEM_PROVIDER_ID = "pp_system_default";

export const CASHFREE_CHECKOUT_CART_KEY = "cashfree_checkout_cart_id";

export interface CashfreeSessionData {
  order_id: string;
  payment_session_id: string;
  cf_order_id?: string;
  session_id?: string;
}

function getCashfreeMode(): "sandbox" | "production" {
  const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
  if (mode === "production") return "production";
  if (mode !== "sandbox" && process.env.NODE_ENV === "development") {
    console.warn(
      "NEXT_PUBLIC_CASHFREE_MODE is unset; defaulting to sandbox. Set it to match backend CASHFREE_ENV."
    );
  }
  return "sandbox";
}

export async function loadCashfree() {
  return load({ mode: getCashfreeMode() });
}

export async function openCashfreeCheckout(paymentSessionId: string) {
  const cashfree = await loadCashfree();
  await cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}
