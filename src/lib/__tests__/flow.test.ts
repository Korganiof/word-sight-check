import { describe, it, expect } from "vitest";
import { SCREENING_FLOW, nextRoute } from "../flow";

describe("nextRoute", () => {
  it("walks the battery in order and ends at the report", () => {
    for (let i = 0; i < SCREENING_FLOW.length - 1; i++) {
      expect(nextRoute(SCREENING_FLOW[i])).toBe(SCREENING_FLOW[i + 1]);
    }
    expect(nextRoute(SCREENING_FLOW[SCREENING_FLOW.length - 1])).toBe("/results");
  });

  it("never strands an unknown route", () => {
    expect(nextRoute("/exercise/syllables")).toBe("/results");
  });
});
