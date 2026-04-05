export interface WordChainItem {
  id: string;
  originalSentence: string;
  chainedSentence: string;
}

export interface WordChainResult {
  item: WordChainItem;
  userInput: string;
  correct: boolean;
  rtMs: number;
}
