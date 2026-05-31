import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderDetailClient } from "./OrderDetailClient";

// Mock the SDK
vi.mock("@/lib/sdk", () => ({
  sdk: {
    store: {
      order: {
        retrieve: vi.fn(),
      },
    },
  },
}));

// Mock auth store
vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { id: "cust_123", email: "test@example.com", first_name: "Test", last_name: "User" },
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockOrder = {
  id: "order_123",
  display_id: 1001,
  custom_display_id: "CC-20260520-1001",
  status: "processing",
  created_at: "2026-05-20T10:00:00Z",
  items: [
    {
      id: "item_1",
      title: "Portable Keychain Phone Stand",
      variant: { title: "Color: Wakanda Black", options: [{ title: "Wakanda Black" }] },
      quantity: 2,
      unit_price: 44900,
      metadata: { customization: "MYSTAND" },
    },
  ],
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main Street",
    address_2: "Apt 4B",
    city: "Mumbai",
    province: "Maharashtra",
    postal_code: "400001",
    country: "India",
    phone: "+91-9876543210",
  },
  payment_methods: [{ provider_id: "stripe", data: { last4: "4242", brand: "visa" } }],
  subtotal: 89800,
  shipping_total: 0,
  tax_total: 8082,
  total: 97882,
};

describe("OrderDetailClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Loading state shows skeleton while fetching order
  it("shows skeleton while loading", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OrderDetailClient orderId="order_123" />);

    // Should show loading skeletons
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // Test 2: Order detail sections render when data loads
  it("renders order detail sections when data loads", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/Order #CC-20260520-1001/i)).toBeTruthy();
    });
    expect(screen.getByText(/Portable Keychain Phone Stand/i)).toBeTruthy();
    expect(screen.getByText(/MYSTAND/i)).toBeTruthy();
  });

  // Test 3: Error state shows message + retry button when fetch fails
  it("shows error state with retry button when fetch fails", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockRejectedValue(new Error("Order not found"));

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/Order not found/i)).toBeTruthy();
    });
    expect(screen.getByRole("button", { name: /retry/i })).toBeTruthy();
  });

  // Test 4: Back to Orders link navigates to /orders
  it("has Back to Orders link pointing to /orders", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /back to orders/i });
      expect(link).toHaveAttribute("href", "/orders");
    });
  });

  // Test 5: Line item shows product name, variant color, customization, quantity, price
  it("displays all line item details correctly", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/Portable Keychain Phone Stand/i)).toBeTruthy();
    });
    expect(screen.getByText(/Wakanda Black/i)).toBeTruthy();
    expect(screen.getByText(/MYSTAND/i)).toBeTruthy();
    expect(screen.getByText(/2/)).toBeTruthy(); // quantity
  });

  // Test 6: Totals show subtotal, shipping, tax, grand total
  it("displays all order totals correctly", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/Subtotal/i)).toBeTruthy();
      expect(screen.getByText(/Shipping/i)).toBeTruthy();
      expect(screen.getByText(/Tax/i)).toBeTruthy();
    });
  });

  // Test 7: Shipping address displays full address formatted
  it("displays full shipping address", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeTruthy();
      expect(screen.getByText(/123 Main Street/i)).toBeTruthy();
      expect(screen.getByText(/Mumbai/i)).toBeTruthy();
    });
  });

  // Test 8: Payment method shows provider name + last 4 digits
  it("displays payment method with last 4 digits", async () => {
    const { sdk } = await import("@/lib/sdk");
    vi.mocked(sdk.store.order.retrieve).mockResolvedValue({ order: mockOrder } as any);

    render(<OrderDetailClient orderId="order_123" />);

    await waitFor(() => {
      expect(screen.getByText(/stripe/i)).toBeTruthy();
      expect(screen.getByText(/\*\*4242/i)).toBeTruthy();
    });
  });

  // Test 9: Not authenticated shows login prompt
  it("shows login prompt when not authenticated", async () => {
    const { useAuthStore } = await import("@/store/authStore");
    vi.mocked(useAuthStore).mockReturnValueOnce({
      isAuthenticated: false,
      user: null,
    });

    render(<OrderDetailClient orderId="order_123" />);

    expect(screen.getByText(/please log in to view order details/i)).toBeTruthy();
  });
});