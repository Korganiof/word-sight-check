export interface SyllableItem {
  id: string;
  syllables: string[];
  correctWord: string;
}

export interface SyllableResult {
  item: SyllableItem;
  userInput: string;
  correct: boolean;
}
