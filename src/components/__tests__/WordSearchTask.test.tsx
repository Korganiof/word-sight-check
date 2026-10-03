import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { WordSearchTask } from "../WordSearchTask";
import type { WordSearchTarget } from "@/lib/wordsearch";

const text = "KUULIJAT ovat paikalla.";
const targets: WordSearchTarget[] = [{ word: "KUULIJAT" }];

describe("WordSearchTask", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // @ts-expect-error jsdom window.performance is defined
    vi.spyOn(window, "performance", "get").mockReturnValue({
      now: () => 0,
    });
  });

  it("renders target word in passage and allows clicking to mark it", () => {
    const { getByRole } = render(
      <BrowserRouter>
        <WordSearchTask text={text} targets={targets} durationMs={60000} />
      </BrowserRouter>
    );

    // Every word in the passage is a toggle button; the chip list is plain text.
    const word = getByRole("button", { name: "KUULIJAT" });
    expect(word).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(word);
    expect(word).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(word);
    expect(word).toHaveAttribute("aria-pressed", "false");
  });
});

