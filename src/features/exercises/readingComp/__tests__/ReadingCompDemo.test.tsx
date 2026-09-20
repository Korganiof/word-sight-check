import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReadingCompDemo } from "../ReadingCompDemo";

const sentences = [
  "Liisa söi lautasellisen [[kenkiä|puuroa]].",
  "Pekka nousi sängystä ja meni [[nukkumaan|suihkuun]].",
];

describe("ReadingCompDemo", () => {
  it("explains a wrong tap without solving the sentence", () => {
    const onSolvedChange = vi.fn();
    render(<ReadingCompDemo sentences={sentences} onSolvedChange={onSolvedChange} />);

    fireEvent.click(screen.getByText("Liisa"));

    expect(screen.getByText(/”Liisa” sopii lauseeseen/)).toBeInTheDocument();
    expect(onSolvedChange).not.toHaveBeenCalled();
  });

  it("marks the wrong word, shows the intended one, and reports progress", () => {
    const onSolvedChange = vi.fn();
    render(<ReadingCompDemo sentences={sentences} onSolvedChange={onSolvedChange} />);

    fireEvent.click(screen.getByText("kenkiä"));
    expect(screen.getByText(/vaikkapa ”puuroa”/)).toBeInTheDocument();
    expect(screen.getByText("kenkiä")).toHaveAttribute("aria-pressed", "true");
    expect(onSolvedChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByText("nukkumaan"));
    expect(onSolvedChange).toHaveBeenLastCalledWith(2);
  });
});
