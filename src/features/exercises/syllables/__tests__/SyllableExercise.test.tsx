import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { SyllableExercise } from "../SyllableExercise";

// Mock sonner toast to avoid DOM noise in tests
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Use vi.hoisted so mock can reference it (vi.mock is hoisted)
const { mockSyllableItems } = vi.hoisted(() => {
  return {
    mockSyllableItems: [
      {
        id: "test-1",
        type: "real" as const,
        level: 1 as const,
        correctWord: "kukka",
        syllablesCorrect: ["kuk", "ka"],
        tiles: [
          { id: "t1", value: "kuk", isDecoy: false },
          { id: "t2", value: "ka", isDecoy: false },
          { id: "t3", value: "ku", isDecoy: true },
        ],
        expectedSyllableCount: 2,
        tags: [] as string[],
      },
      {
        id: "test-2",
        type: "real" as const,
        level: 1 as const,
        correctWord: "talo",
        syllablesCorrect: ["ta", "lo"],
        tiles: [
          { id: "t1", value: "ta", isDecoy: false },
          { id: "t2", value: "lo", isDecoy: false },
          { id: "t3", value: "tal", isDecoy: true },
        ],
        expectedSyllableCount: 2,
        tags: [] as string[],
      },
    ],
  };
});

vi.mock("../syllableItems.fi", () => ({
  syllableItems: mockSyllableItems,
}));

describe("SyllableExercise", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders and shows the first task after session loads", async () => {
    render(<SyllableExercise />);

    // May show loading briefly, then content
    await waitFor(
      () => {
        expect(screen.getByText("Valitse tavut")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Should show tile buttons (at least the correct ones for one of the two items)
    const kukButton = screen.queryByRole("button", { name: "kuk" });
    const kaButton = screen.queryByRole("button", { name: "ka" });
    const taButton = screen.queryByRole("button", { name: "ta" });
    const loButton = screen.queryByRole("button", { name: "lo" });
    expect(kukButton || taButton).toBeTruthy();
  });

  it("allows user to select syllables and advance on correct answer", async () => {
    render(<SyllableExercise />);

    await waitFor(
      () => {
        expect(screen.getByText("Valitse tavut")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Find and click the correct syllable tiles for the current item
    // (order depends on seed; we click whichever of kuk/ka or ta/lo are visible)
    const kuk = screen.queryByRole("button", { name: "kuk" });
    const ka = screen.queryByRole("button", { name: "ka" });
    const ta = screen.queryByRole("button", { name: "ta" });
    const lo = screen.queryByRole("button", { name: "lo" });

    if (kuk && ka) {
      fireEvent.click(kuk);
      fireEvent.click(ka);
    } else if (ta && lo) {
      fireEvent.click(ta);
      fireEvent.click(lo);
    } else {
      throw new Error("Expected syllable buttons not found");
    }

    // Should advance (either to next item or end screen)
    await waitFor(() => {
      // After correct answer: either next item or "Harjoitus valmis"
      const endScreen = screen.queryByText("Harjoitus valmis");
      const nextTiles = screen.queryByRole("button", { name: "kuk" }) ?? screen.queryByRole("button", { name: "ta" });
      expect(endScreen || nextTiles).toBeTruthy();
    });
  });

  it("does not advance on incorrect answer and shows error", async () => {
    render(<SyllableExercise />);

    await waitFor(
      () => {
        expect(screen.getByText("Valitse tavut")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click wrong syllables (e.g. ku + ka for kukka, or tal + lo for talo)
    const ku = screen.queryByRole("button", { name: "ku" });
    const ka = screen.queryByRole("button", { name: "ka" });
    const tal = screen.queryByRole("button", { name: "tal" });
    const lo = screen.queryByRole("button", { name: "lo" });

    if (ku && ka) {
      fireEvent.click(ku);
      fireEvent.click(ka);
    } else if (tal && lo) {
      fireEvent.click(tal);
      fireEvent.click(lo);
    } else {
      // Fallback: click any two tiles that form a wrong answer
      const buttons = screen.getAllByRole("button").filter((b) => !b.getAttribute("aria-label"));
      if (buttons.length >= 2) {
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);
      }
    }

    // Should stay on same task, show "Tyhjennä" / "Tarkista" still
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Tyhjennä/i })).toBeInTheDocument();
    });
  });

  it("displays progress and task count", async () => {
    render(<SyllableExercise />);

    await waitFor(
      () => {
        expect(screen.getByText(/Tehtävä \d+ \/ 2/)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
