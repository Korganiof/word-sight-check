import { describe, it, expect } from "vitest";
import { buildSummary, shouldFlagSupportNeed } from "../finalResultsCopy";
import { AREA_STATIC, type SkillArea } from "../finalResultsContent";
import type { Level } from "../levels";

// Build the five report rows with the given levels (keyed by area key).
function areas(levels: Partial<Record<string, Level>>): SkillArea[] {
  return AREA_STATIC.map(a => ({
    ...a,
    level: levels[a.key] ?? "missing",
    description: "",
  }));
}

describe("shouldFlagSupportNeed", () => {
  it("flags when two NMI-aligned areas show clear difficulty", () => {
    expect(shouldFlagSupportNeed(areas({ sanarajat: "selvia", kirjoitusvirheet: "selvia" }))).toBe(true);
    expect(shouldFlagSupportNeed(areas({ kirjoitusvirheet: "selvia", luetunYmmartaminen: "selvia" }))).toBe(true);
  });

  it("does not flag on one NMI area alone", () => {
    expect(shouldFlagSupportNeed(areas({ sanarajat: "selvia", kirjoitusvirheet: "jonkin", luetunYmmartaminen: "sujuu" }))).toBe(false);
  });

  it("ignores the non-NMI areas", () => {
    expect(shouldFlagSupportNeed(areas({ sanantunnistus: "selvia", lukunopeus: "selvia", sanarajat: "selvia" }))).toBe(false);
  });

  it("needs at least two NMI areas completed", () => {
    expect(shouldFlagSupportNeed(areas({ sanarajat: "selvia" }))).toBe(false);
  });
});

describe("buildSummary", () => {
  it("handles an empty report", () => {
    expect(buildSummary(areas({}))).toMatch(/Yhtään harjoitusta ei ole tehty/);
  });

  it("recognises a clean sweep", () => {
    const all = Object.fromEntries(AREA_STATIC.map(a => [a.key, "sujuu" as Level]));
    expect(buildSummary(areas(all))).toMatch(/kaikilla mitatuilla osa-alueilla/);
  });

  it("points to an expert when two or more areas show clear difficulty", () => {
    expect(buildSummary(areas({ sanarajat: "selvia", luetunYmmartaminen: "selvia", sanantunnistus: "sujuu" })))
      .toMatch(/useammalla osa-alueella/);
  });
});
