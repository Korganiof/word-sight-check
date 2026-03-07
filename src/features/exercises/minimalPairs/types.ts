export type MinimalPairType = "vowel length" | "consonant length";

export interface MinimalPairItem {
  id: string;
  sentence: string;
  optionA: string;
  optionB: string;
  correctAnswer: string;
  type: MinimalPairType;
}
