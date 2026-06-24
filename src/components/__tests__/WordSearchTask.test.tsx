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

  it("renders target word in passage and allows clicking to highlight it", () => {
    const { getAllByText } = render(
      <BrowserRouter>
        <WordSearchTask text={text} targets={targets} durationMs={60000} />
      </BrowserRouter>
    );

    const [, word] = getAllByText("KUULIJAT");
    expect(word).toBeInTheDocument();

    // Initially not highlighted as found (no inline background)
    expect(word.style.backgroundColor).toBe("");

    fireEvent.click(word);

    // After click, should be highlighted as found (#C69A2B)
    expect(word.style.backgroundColor).toBe("rgb(198, 154, 43)");
  });
});

