import { describe, it, expect } from "vitest";
import { getActiveStageIndex, getStageTimestamps } from "./OrderTimeline";

describe("getActiveStageIndex", () => {
  it("highlights Items Prepared when fulfillment_status is fulfilled", () => {
    expect(getActiveStageIndex("fulfilled")).toBe(1);
    expect(getActiveStageIndex("partially_fulfilled")).toBe(1);
  });

  it("highlights Shipped when fulfillment_status is shipped", () => {
    expect(getActiveStageIndex("shipped")).toBe(2);
    expect(getActiveStageIndex("partially_shipped")).toBe(2);
  });

  it("highlights Delivered when fulfillment_status is delivered", () => {
    expect(getActiveStageIndex("delivered")).toBe(3);
    expect(getActiveStageIndex("partially_delivered")).toBe(3);
  });

  it("highlights Order Placed when not yet fulfilled", () => {
    expect(getActiveStageIndex("not_fulfilled")).toBe(0);
    expect(getActiveStageIndex(undefined)).toBe(0);
  });

  it("returns -1 for cancelled orders", () => {
    expect(getActiveStageIndex("fulfilled", "cancelled")).toBe(-1);
    expect(getActiveStageIndex("canceled")).toBe(-1);
  });
});

describe("getStageTimestamps", () => {
  it("maps fulfillment dates to timeline stages", () => {
    const timestamps = getStageTimestamps({
      status: "processing",
      fulfillment_status: "delivered",
      created_at: "2026-05-01T10:00:00Z",
      fulfillments: [
        {
          created_at: "2026-05-02T10:00:00Z",
          packed_at: "2026-05-02T12:00:00Z",
          shipped_at: "2026-05-03T10:00:00Z",
          delivered_at: "2026-05-05T10:00:00Z",
        },
      ],
    });

    expect(timestamps[0]).toBe("2026-05-01T10:00:00Z");
    expect(timestamps[1]).toBe("2026-05-02T12:00:00Z");
    expect(timestamps[2]).toBe("2026-05-03T10:00:00Z");
    expect(timestamps[3]).toBe("2026-05-05T10:00:00Z");
  });

  it("falls back to fulfillment created_at for prepared when packed_at is missing", () => {
    const timestamps = getStageTimestamps({
      status: "processing",
      fulfillment_status: "fulfilled",
      created_at: "2026-05-01T10:00:00Z",
      fulfillments: [{ created_at: "2026-05-02T10:00:00Z" }],
    });

    expect(timestamps[1]).toBe("2026-05-02T10:00:00Z");
  });
});
