export interface ReadingCompPassage {
  id: string;
  title: string;
  // Plain Finnish prose with inline markers of the form
  // [[wrongWord|intendedWord]]. The wrongWord is what the user sees; the
  // intendedWord documents the substitution and is never shown to the user.
  paragraphs: string[];
}

export type ReadingCompToken =
  | { kind: "word"; id: string; text: string; isError: false }
  | { kind: "word"; id: string; text: string; isError: true; correctForm: string }
  | { kind: "whitespace"; text: string };
