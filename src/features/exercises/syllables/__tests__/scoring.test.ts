import { describe, it, expect } from "vitest";
import { scoreSubmission, detectErrorTags } from "../scoring";
import type { SyllableItem } from "../types";

function makeItem(overrides: Partial<SyllableItem> = {}): SyllableItem {
  return {
    id: "test-1",
    type: "real",
    level: 1,
    correctWord: "kukka",
    syllablesCorrect: ["kuk", "ka"],
    tiles: [],
    expectedSyllableCount: 2,
    tags: [],
    ...overrides,
  };
}

describe("scoring", () => {
  describe("scoreSubmission", () => {
    it("returns correct when syllables match exactly", () => {
      const item = makeItem({ correctWord: "kukka", syllablesCorrect: ["kuk", "ka"] });
      const result = scoreSubmission(["kuk", "ka"], item);
      expect(result.isCorrect).toBe(true);
      expect(result.errorTags).toEqual([]);
    });

    it("returns incorrect when syllables differ", () => {
      const item = makeItem({ correctWord: "kukka", syllablesCorrect: ["kuk", "ka"] });
      const result = scoreSubmission(["ku", "ka"], item);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe("detectErrorTags - double consonant", () => {
    it("detects double consonant error when user uses kk instead of k in syllable", () => {
      const item = makeItem({ correctWord: "katto", syllablesCorrect: ["kat", "to"] });
      const tags = detectErrorTags(["katt", "to"], "kattto", item);
      expect(tags).toContain("double_consonant");
    });

    it("detects double consonant error when user uses tt instead of t", () => {
      const item = makeItem({ correctWord: "katta", syllablesCorrect: ["kat", "ta"] });
      const tags = detectErrorTags(["katt", "ta"], "kattta", item);
      expect(tags).toContain("double_consonant");
    });

    it("detects double consonant for p/pp", () => {
      const item = makeItem({ correctWord: "pappa", syllablesCorrect: ["pap", "pa"] });
      const tags = detectErrorTags(["papp", "pa"], "papppa", item);
      expect(tags).toContain("double_consonant");
    });
  });

  describe("detectErrorTags - vowel length", () => {
    it("detects vowel length error when user uses short instead of long", () => {
      const item = makeItem({ correctWord: "tuuli", syllablesCorrect: ["tuu", "li"] });
      const tags = detectErrorTags(["tu", "li"], "tuli", item);
      expect(tags).toContain("vowel_length");
    });

    it("detects vowel length error when user uses long instead of short", () => {
      const item = makeItem({ correctWord: "talo", syllablesCorrect: ["ta", "lo"] });
      const tags = detectErrorTags(["taa", "lo"], "taalo", item);
      expect(tags).toContain("vowel_length");
    });

    it("detects vowel length for a/aa", () => {
      const item = makeItem({ correctWord: "vaaka", syllablesCorrect: ["vaa", "ka"] });
      const tags = detectErrorTags(["va", "ka"], "vaka", item);
      expect(tags).toContain("vowel_length");
    });
  });

  describe("detectErrorTags - syllable order", () => {
    it("detects syllable order error when syllables are swapped", () => {
      const item = makeItem({ correctWord: "kukka", syllablesCorrect: ["kuk", "ka"] });
      const tags = detectErrorTags(["ka", "kuk"], "kakuk", item);
      expect(tags).toContain("syllable_order");
    });

    it("detects syllable order when count differs", () => {
      const item = makeItem({ correctWord: "kukka", syllablesCorrect: ["kuk", "ka"] });
      const tags = detectErrorTags(["kuk"], "kuk", item);
      expect(tags).toContain("syllable_order");
    });
  });
});
