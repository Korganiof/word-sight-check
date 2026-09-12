import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { WordChainExercise } from "../WordChainExercise";
import { loadWordChainsResult } from "@/lib/exerciseResults";

const { mockItems } = vi.hoisted(() => ({
  mockItems: [
    { id: "t1", originalSentence: "kissa istuu", chainedSentence: "kissaistuu" },
    { id: "t2", originalSentence: "talo on iso", chainedSentence: "talooniso" },
  ],
}));

vi.mock("../wordChainItems.fi", () => ({ wordChainItems: mockItems }));
// Keep item order deterministic.
vi.mock("@/lib/utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/utils")>()),
  shuffleArray: <T,>(arr: readonly T[]) => [...arr],
}));

const FEEDBACK_MS = 600;
const TOTAL_TIME_MS = 90_000;

function renderExercise() {
  return render(
    <MemoryRouter initialEntries={["/exercise/word-chains"]}>
      <Routes>
        <Route path="/exercise/word-chains" element={<WordChainExercise />} />
        <Route path="*" element={<div>next step</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

// Letter buttons in order; the last letter of a chain has no boundary button.
const letterButtons = () => screen.getAllByRole("button", { name: /sanaraja/ });

describe("WordChainExercise", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers({
      toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date", "performance"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("scores unreached sentences as wrong when time runs out", () => {
    renderExercise();
    expect(screen.getByText(/Lause 1 \/ 2/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(TOTAL_TIME_MS + 200);
    });

    expect(loadWordChainsResult()).toEqual({ correct: 0, total: 2 });
    expect(screen.getByText("next step")).toBeInTheDocument();
  });

  it("accepts a correctly split sentence and advances", () => {
    renderExercise();

    // "kissaistuu" → boundary after the 5th letter.
    fireEvent.click(letterButtons()[4]);
    fireEvent.click(screen.getByRole("button", { name: "Tarkista" }));
    act(() => {
      vi.advanceTimersByTime(FEEDBACK_MS);
    });

    expect(screen.getByText(/Lause 2 \/ 2/)).toBeInTheDocument();
  });

  it("credits a correct, unchecked split at the buzzer but still scores the full set", () => {
    renderExercise();

    fireEvent.click(letterButtons()[4]);
    fireEvent.click(screen.getByRole("button", { name: "Tarkista" }));
    act(() => {
      vi.advanceTimersByTime(FEEDBACK_MS);
    });

    // "talooniso" → boundaries after letters 4 and 6; leave it unchecked.
    fireEvent.click(letterButtons()[3]);
    fireEvent.click(letterButtons()[5]);
    act(() => {
      vi.advanceTimersByTime(TOTAL_TIME_MS);
    });

    expect(loadWordChainsResult()).toEqual({ correct: 2, total: 2 });
  });
});
