export interface ReadingCompPassage {
  id: string;
  title: string;
  // Each paragraph is plain Finnish prose with inline error markers of the
  // form [[wrongWord|correctWord]]. The wrongWord is what the user sees;
  // correctWord is shown in the result page as "what you missed".
  paragraphs: string[];
}

export type ReadingCompToken =
  | { kind: "word"; id: string; text: string; isError: false }
  | { kind: "word"; id: string; text: string; isError: true; correctForm: string }
  | { kind: "whitespace"; text: string };
