"use client";

interface TimelineStage {
  key: string;
  label: string;
  icon: string;
}

interface TimelineFulfillment {
  created_at?: string;
  packed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  tracking_numbers?: string[];
}

interface TimelineOrder {
  status: string;
  fulfillment_status?: string | null;
  created_at: string;
  fulfillments?: TimelineFulfillment[];
}

const TIMELINE_STAGES: TimelineStage[] = [
  { key: "placed", label: "Order Placed", icon: "📋" },
  { key: "prepared", label: "Items Prepared", icon: "📦" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "🏠" },
];

export function getActiveStageIndex(
  fulfillmentStatus?: string | null,
  orderStatus?: string
): number {
  if (orderStatus === "cancelled" || fulfillmentStatus === "canceled") {
    return -1;
  }

  switch (fulfillmentStatus) {
    case "delivered":
    case "partially_delivered":
      return 3;
    case "shipped":
    case "partially_shipped":
      return 2;
    case "fulfilled":
    case "partially_fulfilled":
      return 1;
    case "not_fulfilled":
      return 0;
    default:
      return 0;
  }
}

function pickEarliest(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter((date): date is string => Boolean(date));
  if (!valid.length) return null;

  return valid.reduce((earliest, date) =>
    new Date(date) <= new Date(earliest) ? date : earliest
  );
}

export function getStageTimestamps(order: TimelineOrder): (string | null)[] {
  const fulfillments = order.fulfillments ?? [];

  return [
    order.created_at ?? null,
    pickEarliest(fulfillments.flatMap((f) => [f.packed_at, f.created_at])),
    pickEarliest(fulfillments.map((f) => f.shipped_at)),
    pickEarliest(fulfillments.map((f) => f.delivered_at)),
  ];
}

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderTimeline({ order }: { order: TimelineOrder }) {
  const activeStageIndex = getActiveStageIndex(order.fulfillment_status, order.status);
  const stageTimestamps = getStageTimestamps(order);
  const isCancelled =
    order.status === "cancelled" || order.fulfillment_status === "canceled";

  const renderStageTimestamp = (
    index: number,
    isCompleted: boolean,
    isActive: boolean,
    isPending: boolean
  ) => {
    const timestamp = stageTimestamps[index];

    if ((isCompleted || isActive) && timestamp) {
      return (
        <span className="text-xs text-[var(--color-on-dark-muted)]">
          {formatTimestamp(timestamp)}
        </span>
      );
    }

    if (isPending) {
      return (
        <span className="text-xs text-[var(--color-on-dark-muted)] md:hidden">
          Pending
        </span>
      );
    }

    return null;
  };

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
                {renderStageTimestamp(index, isCompleted, isActive, isPending)}
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
                {renderStageTimestamp(index, isCompleted, isActive, index > activeStageIndex)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}