import { Metadata } from "next";
import { OrderDetailClient } from "@/components/orders/OrderDetailClient";
import { orderPageClassName } from "@/components/orders/orderStyles";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id.slice(-8).toUpperCase()} | Crucible Creations`,
    description: "View your order details",
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className={orderPageClassName}>
      <div className="container mx-auto max-w-4xl px-4">
        <OrderDetailClient orderId={id} />
      </div>
    </main>
  );
}