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
                    ? "bg-teal-500 text-white"
                    : isCompleted
                    ? "bg-teal-500/30 text-teal-400 border border-teal-500/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {isActive ? stage.icon : isCompleted ? "✓" : ""}
              </div>
              {/* Label */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-teal-400" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
                {isCompleted && index === 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(order.created_at)}
                  </span>
                )}
                {isPending && <span className="text-xs text-muted-foreground">Pending</span>}
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
                    isCompleted ? "bg-teal-500" : "bg-gray-200 border-dashed"
                  }`}
                />
              )}

              {/* Circle indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 flex-shrink-0 ${
                  isActive
                    ? "bg-teal-500 border-teal-500 text-white"
                    : isCompleted
                    ? "bg-gray-400 border-gray-400 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                } ${isCancelled && !isCompleted ? "opacity-50" : ""}`}
              >
                {isActive ? stage.icon : isCompleted ? "✓" : ""}
              </div>

              {/* Label and timestamp */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-teal-400" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
                {isCompleted && index === 0 && (
                  <span className="text-xs text-muted-foreground">
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