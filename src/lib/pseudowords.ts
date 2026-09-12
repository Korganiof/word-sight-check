export interface WordItem {
  text: string;
  isWord: boolean;
}

// Shown first as unscored practice trials.
export const warmupList: WordItem[] = [
  { text: "talo", isWord: true },
  { text: "mipu", isWord: false },
  { text: "kirja", isWord: true },
];

// Both pools share the same length distribution (4 × 4, 16 × 5, 16 × 6,
// 4 × 7 letters) so word length gives nothing away. TaskPage samples an equal
// number from each pool per session. Pseudowords follow Finnish phonotactics
// and vowel harmony but are not inflected forms of real words — check before
// adding one (e.g. "lopu" is the imperative of loppua).
export const realWords: WordItem[] = [
  "nenä", "käsi", "kesä", "lumi",
  "koulu", "pöytä", "tuoli", "kello", "omena", "silta", "järvi", "kahvi",
  "leipä", "pallo", "sänky", "ruoka", "kukka", "lintu", "koira", "metsä",
  "kauppa", "lammas", "helppo", "vaikea", "kirkas", "lämmin", "kaunis", "kenttä",
  "ikkuna", "peruna", "raskas", "pehmeä", "terävä", "kallis", "sokeri", "niitty",
  "aurinko", "puhelin", "keittiö", "banaani",
].map(text => ({ text, isWord: true }));

export const pseudoWords: WordItem[] = [
  "sate", "vupo", "nomu", "tesi",
  "tinen", "lampe", "terla", "tilpa", "pelmu", "kilma", "runta", "vesto",
  "hulka", "kirvo", "nelku", "sokra", "talpe", "mutri", "pokea", "torva",
  "puvila", "nupila", "kepora", "tiluna", "mopeli", "kenilu", "penako", "silamu",
  "vatola", "kurela", "potina", "taselo", "ropeva", "kanuro", "vilopa", "semiku",
  "mutilas", "torames", "rampola", "torpila",
].map(text => ({ text, isWord: false }));

export const mainList: WordItem[] = [...realWords, ...pseudoWords];
