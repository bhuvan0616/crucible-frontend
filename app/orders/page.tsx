import { OrderListClient } from "@/components/orders/OrderListClient"

export const metadata = {
  title: "Order History | Crucible Creations",
  description: "View your past orders",
}

export default function OrdersPage() {
  return <OrderListClient />
}