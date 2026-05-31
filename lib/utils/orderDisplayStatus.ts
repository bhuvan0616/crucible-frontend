export type OrderDisplayStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderStatusSource {
  status: string;
  fulfillment_status?: string | null;
}

export function getOrderDisplayStatus(order: OrderStatusSource): OrderDisplayStatus {
  if (order.status === "canceled" || order.fulfillment_status === "canceled") {
    return "cancelled";
  }

  switch (order.fulfillment_status) {
    case "delivered":
    case "partially_delivered":
      return "delivered";
    case "shipped":
    case "partially_shipped":
      return "shipped";
    case "fulfilled":
    case "partially_fulfilled":
      return "processing";
    case "not_fulfilled":
      return order.status === "completed" ? "processing" : "pending";
    default:
      return order.status === "completed" ? "processing" : "pending";
  }
}

export const ORDER_DISPLAY_STATUS_TABS: Array<OrderDisplayStatus | "all"> = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
