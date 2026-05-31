import { OrderListClient } from "@/components/orders/OrderListClient"
import { orderPageClassName } from "@/components/orders/orderStyles"

export const metadata = {
  title: "Order History | Crucible Creations",
  description: "View your past orders",
}

export default function OrdersPage() {
  return (
    <main className={orderPageClassName}>
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">Order History</h1>
        <OrderListClient />
      </div>
    </main>
  );
}