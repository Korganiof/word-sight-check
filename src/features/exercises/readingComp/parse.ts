import type { ReadingCompToken } from "./types";

// [[wrongWord|intendedWord]] markers (with any punctuation glued to their
// end, so "[[kuuma|viileä]]," stays one token like "aikaisin." does), plain
// words, and runs of whitespace.
const TOKEN_RE = /\[\[([^|\]]+)\|([^\]]+)\]\]([^\s[]*)|\S+|\s+/g;

export function parseParagraph(text: string, paragraphIndex: number): ReadingCompToken[] {
  const tokens: ReadingCompToken[] = [];
  let wordCounter = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    const [whole, wrong, correct, trail = ""] = match;
    if (wrong !== undefined && correct !== undefined) {
      tokens.push({
        kind: "word",
        id: `p${paragraphIndex}-w${wordCounter++}`,
        text: wrong + trail,
        isError: true,
        correctForm: correct,
      });
    } else if (/^\s+$/.test(whole)) {
      tokens.push({ kind: "whitespace", text: whole });
    } else {
      tokens.push({
        kind: "word",
        id: `p${paragraphIndex}-w${wordCounter++}`,
        text: whole,
        isError: false,
      });
    }
  }
  return tokens;
}
