"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { sdk } from "@/lib/sdk";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatOrderLabel, orderMatchesSearchQuery } from "@/lib/utils/orderDisplayId";
import { StatusBadge } from "./StatusBadge";
import {
  orderCardClassName,
  orderCardFooterClassName,
  orderInteractiveCardClassName,
  orderPanelClassName,
} from "./orderStyles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface Order {
  id: string;
  display_id?: number;
  custom_display_id?: string;
  created_at: string;
  status: string;
  total?: number;
}

const STATUS_TABS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

const PAGE_SIZE = 10;

export function OrderListClient() {
  const { user: customer, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaginating, setIsPaginating] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (page: number, status: string) => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const offset = (page - 1) * PAGE_SIZE;
      const response = await sdk.store.order.list({
        limit: PAGE_SIZE,
        offset,
        order: "-created_at",
        fields: "+custom_display_id",
      });

      const orderList = (response.orders || []) as unknown as Order[];
      setOrders(orderList);
      setTotalPages(Math.ceil((response.count || 0) / PAGE_SIZE) || 1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
      setIsPaginating(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders(currentPage, activeStatus);
  }, [fetchOrders, currentPage, activeStatus]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setIsPaginating(true);
    setCurrentPage(newPage);
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus = activeStatus === "all" || order.status === activeStatus;
      const matchesSearch = orderMatchesSearchQuery(order, searchQuery);
      return matchesStatus && matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

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
        <p className="text-muted-foreground mb-4">Please log in to view your orders</p>
        <Link href="/login" className="text-teal-500 hover:text-teal-400">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${orderPanelClassName} space-y-4`}>
      {/* Search - matching FilterBar style */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-on-dark-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-primary)]/40 border border-[var(--color-hairline-violet)] text-white placeholder:text-[var(--color-on-dark-muted)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-[var(--color-lime)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-dark-muted)] hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status Filter Tabs - pill style matching filter buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[var(--color-on-dark-muted)] text-sm">Status:</span>
        <div className="flex gap-2">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeStatus === status
                  ? "bg-[var(--color-lime)] text-[var(--color-ink-deep)]"
                  : "bg-[var(--color-primary)]/40 text-[var(--color-on-dark-muted)] border border-[var(--color-hairline-violet)] hover:border-[var(--color-lime)]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* Loading State - 5 shimmer skeleton cards */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className={orderCardClassName}>
                <CardHeader>
                  <div className="h-4 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-5 bg-gradient-to-r from-[var(--color-hairline-violet)] via-[var(--color-hairline-violet)]/60 to-[var(--color-hairline-violet)] bg-[length:200%_100%] animate-shimmer-lime rounded w-1/6" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={`${orderPanelClassName} flex flex-col items-center justify-center py-12 text-center`}>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders(currentPage, activeStatus)}
            className="px-4 py-2 rounded-lg bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-medium hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredOrders.length === 0 && (
        <div className={`${orderPanelClassName} flex flex-col items-center justify-center py-16 text-center`}>
          <p className="text-[var(--color-on-dark-muted)] mb-4">No orders yet</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-lg bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-medium hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Order List */}
      {!isLoading && !error && filteredOrders.length > 0 && (
        <>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className={orderInteractiveCardClassName}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-medium text-white">
                        {formatOrderLabel(order)}
                      </CardTitle>
                      <CardDescription className="mt-1 text-[var(--color-on-dark-muted)]">
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-white">
                    {formatPrice(order.total || 0)}
                  </p>
                </CardContent>
                <CardFooter className={orderCardFooterClassName}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm text-[var(--color-lime)] hover:text-[var(--color-lime-dark)] font-medium flex items-center gap-1"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {!isPaginating && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-[var(--color-hairline-violet)] text-[var(--color-on-dark-muted)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-lime)] hover:text-white transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-on-dark-muted)] px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-[var(--color-hairline-violet)] text-[var(--color-on-dark-muted)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-lime)] hover:text-white transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Loading */}
          {isPaginating && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-lime)]" />
            </div>
          )}
        </>
      )}
    </div>
  );
}