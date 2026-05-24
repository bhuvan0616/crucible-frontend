declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  quantity: number
) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "add_to_cart", {
    currency: "INR",
    value: (price * quantity) / 100,
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: "3d-printed",
        quantity: quantity,
      },
    ],
  });
}

export function trackBeginCheckout(
  total: number,
  items: { item_id: string; item_name: string; quantity: number }[]
) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "begin_checkout", {
    currency: "INR",
    value: total / 100,
    items,
  });
}

export function trackPurchase(
  transactionId: string,
  total: number,
  items: { item_id: string; item_name: string; quantity: number }[]
) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "purchase", {
    transaction_id: transactionId,
    currency: "INR",
    value: total / 100,
    items,
  });
}