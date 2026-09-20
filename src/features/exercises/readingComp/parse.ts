import type { ReadingCompToken } from "./types";

// [[wrongWord|intendedWord]] markers, plain words, and runs of whitespace.
const TOKEN_RE = /\[\[([^|\]]+)\|([^\]]+)\]\]|\S+|\s+/g;

export function parseParagraph(text: string, paragraphIndex: number): ReadingCompToken[] {
  const tokens: ReadingCompToken[] = [];
  let wordCounter = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    const [whole, wrong, correct] = match;
    if (wrong !== undefined && correct !== undefined) {
      tokens.push({
        kind: "word",
        id: `p${paragraphIndex}-w${wordCounter++}`,
        text: wrong,
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
