"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { sdk } from "@/lib/sdk";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, parsePaise } from "@/lib/utils/formatPrice";
import { StatusBadge } from "./StatusBadge";
import { OrderTimeline } from "./OrderTimeline";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface OrderLineItem {
  id: string;
  title: string;
  variant?: {
    title?: string;
    options?: { title: string }[];
  };
  quantity: number;
  unit_price: number;
  metadata?: {
    customization?: string;
  };
}

interface ShippingAddress {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
}

interface PaymentMethod {
  provider_id: string;
  data?: {
    last4?: string;
    brand?: string;
  };
}

interface OrderDetail {
  id: string;
  display_id?: number;
  status: string;
  created_at: string;
  items: OrderLineItem[];
  shipping_address?: ShippingAddress;
  billing_address?: ShippingAddress;
  payment_methods?: PaymentMethod[];
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
      const response = await sdk.store.order.retrieve(orderId, { fields: "*" });
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
        <p className="text-muted-foreground mb-4">Please log in to view order details</p>
        <Link href="/login" className="text-teal-500 hover:text-teal-400">
          Go to Login
        </Link>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </CardHeader>
          </Card>
        </div>
        <div className="animate-pulse">
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/6" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
        <div className="animate-pulse">
          <Card className="bg-muted/50">
            <CardContent className="py-8">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
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
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
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
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Link href="/orders" className="text-teal-500 hover:text-teal-400">
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderNumber = (order.display_id?.toString() || order.id).slice(-8).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Order Header Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl">Order #{orderNumber}</CardTitle>
              <CardDescription className="mt-1">
                {formatDate(order.created_at)}
              </CardDescription>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardFooter>
          <Link
            href="/orders"
            className="text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center gap-1"
          >
            ← Back to Orders
          </Link>
        </CardFooter>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Fulfillment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline order={order} />
        </CardContent>
      </Card>

      {/* Line Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Variant</th>
                  <th className="text-left px-4 py-3 font-medium">Customization</th>
                  <th className="text-right px-4 py-3 font-medium">Qty</th>
                  <th className="text-right px-4 py-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const variantColor =
                    item.variant?.options?.[0]?.title ||
                    item.variant?.title?.replace("Color: ", "") ||
                    "Standard";
                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-4 py-3">{item.title}</td>
                      <td className="px-4 py-3">{variantColor}</td>
                      <td className="px-4 py-3">{item.metadata?.customization || "—"}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {formatPrice(parsePaise(item.unit_price) * item.quantity)}
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
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(parsePaise(order.subtotal || 0))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {(order.shipping_total || 0) === 0
                ? "Free"
                : formatPrice(parsePaise(order.shipping_total || 0))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatPrice(parsePaise(order.tax_total || 0))}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(parsePaise(order.total || 0))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout for Shipping Address and Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address Card */}
        {order.shipping_address && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">
                {[order.shipping_address.first_name, order.shipping_address.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              {order.shipping_address.address_1 && (
                <p>{order.shipping_address.address_1}</p>
              )}
              {order.shipping_address.address_2 && (
                <p>{order.shipping_address.address_2}</p>
              )}
              <p>
                {[
                  order.shipping_address.city,
                  order.shipping_address.province,
                  order.shipping_address.postal_code,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
              {order.shipping_address.phone && (
                <p className="text-muted-foreground">{order.shipping_address.phone}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Method Card */}
        {order.payment_methods && order.payment_methods.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium capitalize">
                {order.payment_methods[0].provider_id}
              </p>
              {order.payment_methods[0].data?.last4 && (
                <p className="text-muted-foreground">
                  •••• {order.payment_methods[0].data.last4}
                </p>
              )}
              {order.payment_methods[0].data?.brand && (
                <p className="text-muted-foreground capitalize">
                  {order.payment_methods[0].data.brand}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}