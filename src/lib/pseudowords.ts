export interface WordItem {
  text: string;
  isWord: boolean;
}

// First 3 items are used as warm-up/practice trials (not scored)
export const warmupList: WordItem[] = [
  { text: "talo", isWord: true },
  { text: "mipu", isWord: false },
  { text: "kirja", isWord: true },
];

// Main scored list – 25 items total (Finnish real words + pseudowords)
export const mainList: WordItem[] = [
  // real Finnish words
  { text: "koulu", isWord: true },
  { text: "pöytä", isWord: true },
  { text: "tuoli", isWord: true },
  { text: "kello", isWord: true },
  { text: "omena", isWord: true },
  { text: "kirjasto", isWord: true },
  { text: "silta", isWord: true },
  { text: "järvi", isWord: true },
  { text: "kahvi", isWord: true },
  { text: "leipä", isWord: true },
  { text: "kauppa", isWord: true },
  { text: "pallo", isWord: true },
  { text: "sänky", isWord: true },

  // Finnish-looking pseudowords
  { text: "sate", isWord: false },
  { text: "lopu", isWord: false },
  { text: "tinen", isWord: false },
  { text: "vupo", isWord: false },
  { text: "lampe", isWord: false },
  { text: "kuppiö", isWord: false },
  { text: "terla", isWord: false },
  { text: "merta", isWord: false },
  { text: "puvila", isWord: false },
  { text: "rauko", isWord: false },
  { text: "tilpa", isWord: false },
  { text: "jarki", isWord: false },
];

// Combined list (3 warmups + 25 main = 28)
export const wordList: WordItem[] = [...warmupList, ...mainList];
