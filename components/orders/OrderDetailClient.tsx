"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { sdk } from "@/lib/sdk";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatOrderLabel } from "@/lib/utils/orderDisplayId";
import { StatusBadge } from "./StatusBadge";
import { OrderTimeline } from "./OrderTimeline";
import { orderCardClassName, orderCardFooterClassName } from "./orderStyles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface OrderLineItem {
  id: string;
  title: string;
  variant_id?: string;
  variant_title?: string;
  variant_option_values?: Record<string, string>;
  quantity: number;
  unit_price: number;
  metadata?: Record<string, unknown>;
}

interface ShippingAddress {
  id?: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
  country?: string | { display_name?: string; iso_2?: string; name?: string };
  phone?: string;
}

interface PaymentCollection {
  id: string;
  status: string;
  currency_code: string;
  amount?: number;
}

interface OrderDetail {
  id: string;
  display_id?: number;
  custom_display_id?: string;
  status: string;
  created_at: string;
  items: OrderLineItem[];
  shipping_address?: ShippingAddress | null;
  billing_address?: ShippingAddress | null;
  payment_collections?: PaymentCollection[];
  subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
}

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await sdk.store.order.retrieve(orderId, {
        fields: "+custom_display_id,*shipping_address,*items",
      });
      setOrder(response.order as unknown as OrderDetail);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, isAuthenticated]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[var(--color-on-dark-muted)] mb-4">Please log in to view order details</p>
        <Link href="/login" className="text-[var(--color-lime)] hover:text-[var(--color-lime-dark)]">
          Go to Login
        </Link>
      </div>
    );
  }

  // Loading skeleton - shimmer placeholders mirroring actual page layout
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Order header skeleton */}
        <div className="animate-pulse">
          <Card className={orderCardClassName}>
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <div className="h-6 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/4 mb-2" />
                  <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/3" />
                </div>
                <div className="h-7 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded-full w-24" />
              </div>
            </CardHeader>
          </Card>
        </div>
        {/* Timeline skeleton */}
        <div className="animate-pulse">
          <Card className={orderCardClassName}>
            <CardHeader>
              <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/3 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded-full" />
                    <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Line items table skeleton */}
        <div className="animate-pulse">
          <Card className={orderCardClassName}>
            <CardHeader>
              <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/6 mb-2" />
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-hairline-violet)]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <th key={i} className="text-left px-4 py-3 font-medium text-white">
                          <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-16" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row} className="border-b border-[var(--color-hairline-violet)]">
                        {[1, 2, 3, 4, 5].map((col) => (
                          <td key={col} className="px-4 py-3">
                            <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Order totals skeleton */}
        <div className="animate-pulse">
          <Card className={orderCardClassName}>
            <CardHeader>
              <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/4 mb-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/4" />
                  <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Address/payment skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse">
            <Card className={orderCardClassName}>
              <CardHeader>
                <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/3 mb-2" />
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-2/3" />
                <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-full" />
                <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div className="animate-pulse">
            <Card className={orderCardClassName}>
              <CardHeader>
                <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/3 mb-2" />
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/2" />
                <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchOrder}
          className="px-4 py-2 rounded-lg bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-medium hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[var(--color-on-dark-muted)] mb-4">Order not found</p>
        <Link href="/orders" className="text-[var(--color-lime)] hover:text-[var(--color-lime-dark)]">
          Back to Orders
        </Link>
      </div>
    );
  }

  const shippingAddress = order.shipping_address;
  const hasShippingAddress = Boolean(
    shippingAddress &&
      (shippingAddress.address_1 ||
        shippingAddress.first_name ||
        shippingAddress.city ||
        shippingAddress.postal_code)
  );
  const countryLabel =
    typeof shippingAddress?.country === "string"
      ? shippingAddress.country
      : shippingAddress?.country?.display_name ||
        shippingAddress?.country?.name ||
        shippingAddress?.country_code?.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Order Header Card */}
      <Card className={orderCardClassName}>
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl text-white">{formatOrderLabel(order)}</CardTitle>
              <CardDescription className="mt-1 text-[var(--color-on-dark-muted)]">
                {formatDate(order.created_at)}
              </CardDescription>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardFooter className={orderCardFooterClassName}>
          <Link
            href="/orders"
            className="text-sm text-[var(--color-lime)] hover:text-[var(--color-lime-dark)] font-medium flex items-center gap-1"
          >
            ← Back to Orders
          </Link>
        </CardFooter>
      </Card>

      {/* Order Timeline */}
      <Card className={orderCardClassName}>
        <CardHeader>
          <CardTitle className="text-white">Fulfillment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline order={order} />
        </CardContent>
      </Card>

      {/* Line Items Table */}
      <Card className={orderCardClassName}>
        <CardHeader>
          <CardTitle className="text-white">Items</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-hairline-violet)]">
                  <th className="text-left px-4 py-3 font-medium text-white">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-white">Variant</th>
                  <th className="text-left px-4 py-3 font-medium text-white">Customization</th>
                  <th className="text-right px-4 py-3 font-medium text-white">Qty</th>
                  <th className="text-right px-4 py-3 font-medium text-white">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  return (
                    <tr key={item.id} className="border-b border-[var(--color-hairline-violet)] last:border-0">
                      <td className="px-4 py-3 text-white line-clamp-2">{item.title}</td>
                      <td className="px-4 py-3 text-[var(--color-on-dark-muted)]">{item.variant_title || "Standard"}</td>
                      <td className="px-4 py-3 text-[var(--color-on-dark-muted)]">—</td>
                      <td className="px-4 py-3 text-right text-white">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-white">
                        {formatPrice(item.unit_price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Totals Card */}
      <Card className={orderCardClassName}>
        <CardHeader>
          <CardTitle className="text-white">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-dark-muted)]">Subtotal</span>
            <span className="text-white">{formatPrice(order.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-dark-muted)]">Shipping</span>
            <span className="text-white">
              {(order.shipping_total || 0) === 0
                ? "Free"
                : formatPrice(order.shipping_total || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-dark-muted)]">Tax</span>
            <span className="text-white">{formatPrice(order.tax_total || 0)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--color-hairline-violet)]">
            <span className="text-white">Total</span>
            <span className="text-white">{formatPrice(order.total || 0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout for Shipping Address and Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address Card */}
        {hasShippingAddress && shippingAddress && (
          <Card className={orderCardClassName}>
            <CardHeader>
              <CardTitle className="text-white">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {(shippingAddress.first_name || shippingAddress.last_name) && (
                <p className="font-medium text-white">
                  {[shippingAddress.first_name, shippingAddress.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              )}
              {shippingAddress.address_1 && (
                <p className="text-[var(--color-on-dark-muted)]">{shippingAddress.address_1}</p>
              )}
              {shippingAddress.address_2 && (
                <p className="text-[var(--color-on-dark-muted)]">{shippingAddress.address_2}</p>
              )}
              <p className="text-[var(--color-on-dark-muted)]">
                {[shippingAddress.city, shippingAddress.province, shippingAddress.postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {countryLabel && (
                <p className="text-[var(--color-on-dark-muted)]">{countryLabel}</p>
              )}
              {shippingAddress.phone && (
                <p className="text-[var(--color-on-dark-muted)]">{shippingAddress.phone}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Method Card */}
        {order.payment_collections && order.payment_collections.length > 0 && (
          <Card className={orderCardClassName}>
            <CardHeader>
              <CardTitle className="text-white">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-white capitalize">
                {order.payment_collections[0].status}
              </p>
              <p className="text-[var(--color-on-dark-muted)]">
                {order.payment_collections[0].currency_code?.toUpperCase()} {order.payment_collections[0].amount}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}