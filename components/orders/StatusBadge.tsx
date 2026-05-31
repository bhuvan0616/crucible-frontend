"use client";

interface StatusConfig {
  color: string;
  label: string;
  icon: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { color: "bg-[var(--color-lime)]/20 text-[var(--color-lime)] border border-[var(--color-lime)]/30", label: "Pending", icon: "⏳" },
  processing: { color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", label: "Processing", icon: "⚙️" },
  shipped: { color: "bg-purple-500/20 text-purple-400 border border-purple-500/30", label: "Shipped", icon: "📦" },
  delivered: { color: "bg-green-500/20 text-green-400 border border-green-500/30", label: "Delivered", icon: "✓" },
  cancelled: { color: "bg-red-500/20 text-red-400 border border-red-500/30", label: "Cancelled", icon: "✕" },
};

const DEFAULT_CONFIG: StatusConfig = { color: "bg-[var(--color-hairline-violet)] text-[var(--color-on-dark-muted)] border border-[var(--color-hairline-violet)]", label: "Unknown", icon: "•" };

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