import { describe, it, expect } from "vitest";
import { getOrderDisplayStatus } from "./orderDisplayStatus";

describe("getOrderDisplayStatus", () => {
  it("maps fulfillment_status to storefront labels", () => {
    expect(
      getOrderDisplayStatus({ status: "pending", fulfillment_status: "not_fulfilled" })
    ).toBe("pending");
    expect(
      getOrderDisplayStatus({ status: "completed", fulfillment_status: "not_fulfilled" })
    ).toBe("processing");
    expect(
      getOrderDisplayStatus({ status: "completed", fulfillment_status: "fulfilled" })
    ).toBe("processing");
    expect(
      getOrderDisplayStatus({ status: "completed", fulfillment_status: "shipped" })
    ).toBe("shipped");
    expect(
      getOrderDisplayStatus({ status: "completed", fulfillment_status: "delivered" })
    ).toBe("delivered");
  });

  it("maps canceled orders to cancelled", () => {
    expect(getOrderDisplayStatus({ status: "canceled", fulfillment_status: "not_fulfilled" })).toBe(
      "cancelled"
    );
    expect(getOrderDisplayStatus({ status: "completed", fulfillment_status: "canceled" })).toBe(
      "cancelled"
    );
  });
});
