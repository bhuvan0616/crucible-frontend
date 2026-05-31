interface OrderDisplayIdSource {
  id: string;
  display_id?: number | null;
  custom_display_id?: string | null;
}

export function getOrderDisplayId(order: OrderDisplayIdSource): string {
  const customId = order.custom_display_id?.trim();
  if (customId) {
    return customId;
  }

  if (order.display_id != null) {
    return order.display_id.toString();
  }

  return order.id.slice(-8).toUpperCase();
}

export function formatOrderLabel(order: OrderDisplayIdSource): string {
  return `Order #${getOrderDisplayId(order)}`;
}

export function orderMatchesSearchQuery(
  order: OrderDisplayIdSource,
  query: string
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    order.custom_display_id,
    order.display_id?.toString(),
    order.id,
    getOrderDisplayId(order),
  ];

  return searchableValues.some((value) =>
    value?.toLowerCase().includes(normalizedQuery)
  );
}
