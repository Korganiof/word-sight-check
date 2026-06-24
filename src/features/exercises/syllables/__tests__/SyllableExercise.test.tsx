import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SyllableExercise } from "../SyllableExercise";

// Keep MS in sync with the component's per-syllable reveal duration.
const MS_PER_SYLLABLE = 1500;
const FEEDBACK_MS = 800;

// Current SyllableItem shape: { id, syllables, correctWord }. The exercise
// flashes each syllable in turn, then hides them and asks the user to type the
// whole word.
const { mockSyllableItems } = vi.hoisted(() => ({
  mockSyllableItems: [
    { id: "test-1", syllables: ["kuk", "ka"], correctWord: "kukka" },
    { id: "test-2", syllables: ["ta", "lo"], correctWord: "talo" },
  ],
}));

vi.mock("../syllableItems.fi", () => ({ syllableItems: mockSyllableItems }));

const renderExercise = () =>
  render(
    <BrowserRouter>
      <SyllableExercise />
    </BrowserRouter>
  );

// Advance past the reveal animation for every syllable of the current word,
// landing the component in the "typing" phase.
function advanceToTyping(syllableCount: number) {
  for (let i = 0; i < syllableCount; i++) {
    act(() => {
      vi.advanceTimersByTime(MS_PER_SYLLABLE);
    });
  }
}

describe("SyllableExercise", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the first syllable and word progress", () => {
    renderExercise();

    expect(screen.getByText(/Sana 1 \/ 2/)).toBeInTheDocument();
    expect(screen.getByText(/Tavu 1 \/ 2/)).toBeInTheDocument();

    // Whichever word the shuffle placed first, its first syllable is on screen.
    const shown = screen.getByText(/^(kuk|ta)$/);
    expect(shown).toBeInTheDocument();
  });

  it("hides the syllables and reveals the input once they finish showing", () => {
    renderExercise();

    expect(screen.queryByText("Kirjoita sana:")).not.toBeInTheDocument();

    advanceToTyping(2);

    expect(screen.getByText("Kirjoita sana:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tarkista/i })).toBeInTheDocument();
  });

  it("accepts the correct word and advances to the next item", () => {
    renderExercise();

    // Identify the current word from its first syllable (order is shuffled).
    const firstSyllable = screen.getByText(/^(kuk|ta)$/).textContent;
    const current = mockSyllableItems.find(i => i.syllables[0] === firstSyllable)!;

    advanceToTyping(2);

    const input = screen.getByPlaceholderText(/Kirjoita tähän/i);
    fireEvent.change(input, { target: { value: current.correctWord } });
    fireEvent.click(screen.getByRole("button", { name: /Tarkista/i }));

    // Feedback shows briefly, then the second word loads.
    act(() => {
      vi.advanceTimersByTime(FEEDBACK_MS);
    });

    expect(screen.getByText(/Sana 2 \/ 2/)).toBeInTheDocument();
  });
});
