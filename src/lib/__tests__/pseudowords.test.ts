import { describe, it, expect } from "vitest";
import { realWords, pseudoWords, warmupList } from "../pseudowords";

const lengthHistogram = (words: { text: string }[]) =>
  words.reduce<Record<number, number>>((h, w) => {
    h[w.text.length] = (h[w.text.length] ?? 0) + 1;
    return h;
  }, {});

describe("pseudoword pools", () => {
  it("are the same size", () => {
    expect(realWords.length).toBe(pseudoWords.length);
  });

  it("share a length distribution, so length gives nothing away", () => {
    expect(lengthHistogram(pseudoWords)).toEqual(lengthHistogram(realWords));
  });

  it("contain no duplicates, including across the warm-up", () => {
    const all = [...warmupList, ...realWords, ...pseudoWords].map(w => w.text);
    expect(new Set(all).size).toBe(all.length);
  });
});
