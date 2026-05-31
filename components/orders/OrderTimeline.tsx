"use client";

interface TimelineStage {
  key: string;
  label: string;
  icon: string;
}

interface TimelineOrder {
  status: string;
  created_at: string;
  fulfillments?: Array<{
    created_at: string;
    tracking_numbers?: string[];
  }>;
}

const TIMELINE_STAGES: TimelineStage[] = [
  { key: "placed", label: "Order Placed", icon: "📋" },
  { key: "confirmed", label: "Payment Confirmed", icon: "💳" },
  { key: "prepared", label: "Items Prepared", icon: "📦" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "🏠" },
];

function getActiveStageIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderTimeline({ order }: { order: TimelineOrder }) {
  const activeStageIndex = getActiveStageIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="w-full">
      {/* Mobile: Vertical timeline - shown on sm/md, hidden on lg+ */}
      <div className="flex md:hidden flex-col gap-3">
        {TIMELINE_STAGES.map((stage, index) => {
          const isCompleted = index < activeStageIndex;
          const isActive = index === activeStageIndex;
          const isPending = index > activeStageIndex;

          return (
            <div key={stage.key} className="flex items-center gap-3">
              {/* Circle indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  isActive
                    ? "bg-[var(--color-lime)] text-[var(--color-ink-deep)]"
                    : isCompleted
                    ? "bg-[var(--color-lime)]/30 text-[var(--color-lime)] border border-[var(--color-lime)]/30"
                    : "bg-[var(--color-ink-deep)] text-[var(--color-on-dark-muted)] border border-[var(--color-hairline-violet)]"
                }`}
              >
                {isActive ? stage.icon : isCompleted ? "✓" : ""}
              </div>
              {/* Label */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-[var(--color-lime)]" : isCompleted ? "text-white" : "text-[var(--color-on-dark-muted)]"
                  }`}
                >
                  {stage.label}
                </span>
                {isCompleted && index === 0 && (
                  <span className="text-xs text-[var(--color-on-dark-muted)]">
                    {formatTimestamp(order.created_at)}
                  </span>
                )}
                {isPending && <span className="text-xs text-[var(--color-on-dark-muted)]">Pending</span>}
              </div>
            </div>
          );
        })}
        {isCancelled && (
          <div className="mt-2 text-sm text-red-500">Order cancelled</div>
        )}
      </div>

      {/* Desktop: Horizontal timeline - hidden on sm/md, shown on lg+ */}
      <div className="hidden md:flex items-center justify-between relative">
        {TIMELINE_STAGES.map((stage, index) => {
          const isCompleted = index < activeStageIndex;
          const isActive = index === activeStageIndex;

          return (
            <div key={stage.key} className="flex items-start gap-3 relative">
              {/* Connector line */}
              {index < TIMELINE_STAGES.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-6 -z-10 ${
                    isCompleted ? "bg-[var(--color-lime)]" : "bg-[var(--color-hairline-violet)] border-dashed"
                  }`}
                />
              )}

              {/* Circle indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 flex-shrink-0 ${
                  isActive
                    ? "bg-[var(--color-lime)] border-[var(--color-lime)] text-[var(--color-ink-deep)]"
                    : isCompleted
                    ? "bg-[var(--color-lime)]/60 border-[var(--color-lime)]/60 text-white"
                    : "bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-[var(--color-on-dark-muted)]"
                } ${isCancelled && !isCompleted ? "opacity-50" : ""}`}
              >
                {isActive ? stage.icon : isCompleted ? "✓" : ""}
              </div>

              {/* Label and timestamp */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-[var(--color-lime)]" : isCompleted ? "text-white" : "text-[var(--color-on-dark-muted)]"
                  }`}
                >
                  {stage.label}
                </span>
                {isCompleted && index === 0 && (
                  <span className="text-xs text-[var(--color-on-dark-muted)]">
                    {formatTimestamp(order.created_at)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}