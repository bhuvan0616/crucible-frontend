"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { sdk } from "@/lib/sdk";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface Order {
  id: string;
  display_id?: number;
  created_at: string;
  status: string;
  total?: number;
}

const STATUS_TABS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeStatus === "all" || order.status === activeStatus;
    const matchesSearch = !searchQuery || 
      ((order.display_id?.toString() || order.id).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

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
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b pb-2">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeStatus === status
                ? "bg-teal-500/20 text-teal-400 border-b-2 border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className="bg-muted/50">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-5 bg-muted rounded w-1/6" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders(currentPage, activeStatus)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
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
              <Card key={order.id} className="hover:ring-1 hover:ring-teal-500/20 transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        Order #{(order.display_id?.toString() || order.id).slice(-8).toUpperCase()}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {formatPrice(order.total || 0)}
                  </p>
                </CardContent>
                <CardFooter className="justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm text-teal-500 hover:text-teal-400 font-medium"
                  >
                    View Details →
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
                className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Loading */}
          {isPaginating && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
            </div>
          )}
        </>
      )}
    </div>
  );
}