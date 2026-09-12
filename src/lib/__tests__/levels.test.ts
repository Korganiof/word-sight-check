import { describe, it, expect } from "vitest";
import { scoreToLevel, scoreMarking, TWO_AFC_THRESHOLDS } from "../levels";

describe("scoreToLevel", () => {
  it("returns missing when nothing was attempted", () => {
    expect(scoreToLevel(0, 0)).toBe("missing");
  });

  it("uses 75 % / 50 % cut-offs by default", () => {
    expect(scoreToLevel(9, 12)).toBe("sujuu");
    expect(scoreToLevel(8, 12)).toBe("jonkin");
    expect(scoreToLevel(6, 12)).toBe("jonkin");
    expect(scoreToLevel(5, 12)).toBe("selvia");
    expect(scoreToLevel(0, 12)).toBe("selvia");
  });

  it("uses stricter cut-offs for two-alternative tasks, where chance is 50 %", () => {
    expect(scoreToLevel(27, 30, TWO_AFC_THRESHOLDS)).toBe("sujuu");
    expect(scoreToLevel(26, 30, TWO_AFC_THRESHOLDS)).toBe("jonkin");
    expect(scoreToLevel(23, 30, TWO_AFC_THRESHOLDS)).toBe("jonkin");
    expect(scoreToLevel(22, 30, TWO_AFC_THRESHOLDS)).toBe("selvia");
    // Chance-level performance must not read as "some difficulty".
    expect(scoreToLevel(15, 30, TWO_AFC_THRESHOLDS)).toBe("selvia");
  });
});

describe("scoreMarking", () => {
  it("scores hits out of the number of targets", () => {
    expect(scoreMarking(30, 0, 50)).toEqual({ correct: 30, total: 50 });
  });

  it("cancels one hit per false alarm", () => {
    expect(scoreMarking(30, 4, 50)).toEqual({ correct: 26, total: 50 });
  });

  it("gives marking nothing a zero, not half marks", () => {
    expect(scoreMarking(0, 0, 50)).toEqual({ correct: 0, total: 50 });
    expect(scoreToLevel(0, 50)).toBe("selvia");
  });

  it("gives marking everything a zero as well", () => {
    // 100 items, 50 of them errors: all 50 hits, but 50 false alarms.
    expect(scoreMarking(50, 50, 50)).toEqual({ correct: 0, total: 50 });
  });

  it("never goes below zero", () => {
    expect(scoreMarking(2, 10, 50).correct).toBe(0);
  });
});
