"use client";

interface StatusConfig {
  color: string;
  label: string;
  icon: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { color: "bg-amber-100 text-amber-800", label: "Pending", icon: "⏳" },
  processing: { color: "bg-blue-100 text-blue-800", label: "Processing", icon: "⚙️" },
  shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped", icon: "📦" },
  delivered: { color: "bg-green-100 text-green-800", label: "Delivered", icon: "✓" },
  cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled", icon: "✕" },
};

const DEFAULT_CONFIG: StatusConfig = { color: "bg-gray-100 text-gray-800", label: "Unknown", icon: "•" };

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${config.color}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}