export type SyllableItemType = "real" | "pseudo";

export type ErrorTag =
  | "double_consonant" // k/kk, t/tt, p/pp
  | "vowel_length" // u/uu, a/aa
  | "syllable_order"; // wrong order of syllables

export interface SyllableTile {
  id: string;
  value: string;
  isDecoy: boolean;
}

export interface SyllableItem {
  id: string;
  type: SyllableItemType;
  level: 1 | 2 | 3 | 4;
  correctWord: string;
  syllablesCorrect: string[];
  tiles: SyllableTile[];
  expectedSyllableCount: number;
  tags: ErrorTag[];
}

export type SyllableEventType =
  | "tile_click"
  | "reset"
  | "submit"
  | "timeout";

export interface SyllableEvent {
  ts: number;
  type: SyllableEventType;
  tileId?: string;
  value?: string;
}

export interface SyllableSubmission {
  ts: number;
  assembledSyllables: string[];
  assembledWord: string;
  isCorrect: boolean;
  errorTags?: ErrorTag[];
}

export interface SyllableAttemptLog {
  itemId: string;
  level: number;
  type: SyllableItemType;
  shownAt: number;
  firstActionAt: number | null;
  submissions: SyllableSubmission[];
  events: SyllableEvent[];
  completedAt: number | null;
  wasTimeout: boolean;
  isCorrect: boolean;
  errorTags: ErrorTag[];
}

export interface SyllableSessionLog {
  sessionId: string;
  seed: number;
  startedAt: number;
  attempts: SyllableAttemptLog[];
  completedAt: number | null;
}
