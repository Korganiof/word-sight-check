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

const COMMIT_DELAY_MS = 500;
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
const advanceTimers = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

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

    advanceTimers(TOTAL_TIME_MS + 200);

    expect(loadWordChainsResult()).toEqual({ correct: 0, total: 2 });
    expect(screen.getByText("next step")).toBeInTheDocument();
  });

  it("moves on by itself once every boundary is marked", () => {
    renderExercise();

    // "kissaistuu" → one boundary, after the 5th letter.
    fireEvent.click(letterButtons()[4]);
    expect(screen.getByText(/Lause 1 \/ 2/)).toBeInTheDocument();

    advanceTimers(COMMIT_DELAY_MS);
    expect(screen.getByText(/Lause 2 \/ 2/)).toBeInTheDocument();
  });

  it("lets a wrong tap be undone during the grace period", () => {
    renderExercise();

    fireEvent.click(letterButtons()[2]); // wrong spot
    advanceTimers(COMMIT_DELAY_MS - 100);
    fireEvent.click(letterButtons()[2]); // undo — cancels the pending advance
    advanceTimers(COMMIT_DELAY_MS);
    expect(screen.getByText(/Lause 1 \/ 2/)).toBeInTheDocument();

    fireEvent.click(letterButtons()[4]);
    advanceTimers(COMMIT_DELAY_MS);
    expect(screen.getByText(/Lause 2 \/ 2/)).toBeInTheDocument();
  });

  it("skips an incomplete sentence with Seuraava and scores it wrong", () => {
    renderExercise();

    fireEvent.click(screen.getByRole("button", { name: /Seuraava/ }));
    expect(screen.getByText(/Lause 2 \/ 2/)).toBeInTheDocument();

    advanceTimers(TOTAL_TIME_MS);
    expect(loadWordChainsResult()).toEqual({ correct: 0, total: 2 });
  });

  it("credits a correct sentence still in its grace period at the buzzer", () => {
    renderExercise();
    advanceTimers(TOTAL_TIME_MS - 800);

    fireEvent.click(letterButtons()[4]);
    advanceTimers(COMMIT_DELAY_MS); // → sentence 2 at T-300 ms

    // "talooniso" → boundaries after letters 4 and 6; the buzzer beats the grace period.
    fireEvent.click(letterButtons()[3]);
    fireEvent.click(letterButtons()[5]);
    advanceTimers(400);

    expect(loadWordChainsResult()).toEqual({ correct: 2, total: 2 });
  });
});
