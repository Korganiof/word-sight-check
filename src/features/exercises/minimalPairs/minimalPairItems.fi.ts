import type { MinimalPairItem } from "./types";

// Each sentence must be grammatical with the correct option in place, and the
// options must differ only in one vowel or consonant length. The wrong option
// may be a real word (mato/matto) or a non-word (pipo/pippo). Watch consonant
// gradation when the slot needs an inflected form: laukku → laukun.
export const minimalPairItems: MinimalPairItem[] = [
  // consonant length
  { id: "mp-1",  sentence: "Puutarhasta löytyi iso ____.",             optionA: "mato",    optionB: "matto",    correctAnswer: "mato",    type: "consonant length" },
  { id: "mp-2",  sentence: "Talon ____ vuotaa pahasti.",               optionA: "katto",   optionB: "kato",     correctAnswer: "katto",   type: "consonant length" },
  { id: "mp-4",  sentence: "Hän heitti ____ maahan.",                  optionA: "palon",   optionB: "pallon",   correctAnswer: "pallon",  type: "consonant length" },
  { id: "mp-5",  sentence: "Minun on ____ lähteä nyt.",                optionA: "pako",    optionB: "pakko",    correctAnswer: "pakko",   type: "consonant length" },
  { id: "mp-6",  sentence: "Naapurilla on söpö musta ____.",           optionA: "kissa",   optionB: "kisa",     correctAnswer: "kissa",   type: "consonant length" },
  { id: "mp-7",  sentence: "Hänellä on päässä punainen ____.",         optionA: "laki",    optionB: "lakki",    correctAnswer: "lakki",   type: "consonant length" },
  { id: "mp-8",  sentence: "Meillä on vanha ____ kokoontua jouluna.",  optionA: "tapa",    optionB: "tappa",    correctAnswer: "tapa",    type: "consonant length" },
  { id: "mp-14", sentence: "Heillä on suuri ____.",                    optionA: "suku",    optionB: "sukku",    correctAnswer: "suku",    type: "consonant length" },
  { id: "mp-16", sentence: "Hän osti uuden ____.",                     optionA: "laukun",  optionB: "laukkun",  correctAnswer: "laukun",  type: "consonant length" },
  { id: "mp-17", sentence: "Koira nukkui ____ päällä.",                optionA: "maton",   optionB: "matton",   correctAnswer: "maton",   type: "consonant length" },
  { id: "mp-18", sentence: "He pelasivat pihalla ____.",               optionA: "paloa",   optionB: "palloa",   correctAnswer: "palloa",  type: "consonant length" },
  { id: "mp-19", sentence: "Hän leikkasi ____ veitsellä.",             optionA: "kakua",   optionB: "kakkua",   correctAnswer: "kakkua",  type: "consonant length" },
  { id: "mp-20", sentence: "Lapsi löysi maasta pienen ____.",          optionA: "kiven",   optionB: "kivven",   correctAnswer: "kiven",   type: "consonant length" },
  { id: "mp-21", sentence: "Pihalla seisoi korkea ____.",              optionA: "kuusi",   optionB: "kuussi",   correctAnswer: "kuusi",   type: "consonant length" },
  { id: "mp-22", sentence: "Ovella oli vanha, ____ matto.",            optionA: "kulunut", optionB: "kullunut", correctAnswer: "kulunut", type: "consonant length" },
  { id: "mp-23", sentence: "Pojalla on uusi ____.",                    optionA: "pipo",    optionB: "pippo",    correctAnswer: "pipo",    type: "consonant length" },
  { id: "mp-24", sentence: "Hän joi lasin kylmää ____.",               optionA: "vetä",    optionB: "vettä",    correctAnswer: "vettä",   type: "consonant length" },
  { id: "mp-26", sentence: "Hän meni ____ nukkumaan.",                 optionA: "illalla", optionB: "ilalla",   correctAnswer: "illalla", type: "consonant length" },

  // vowel length
  { id: "mp-3",  sentence: "Nuotiossa paloi kirkas ____.",             optionA: "tuli",    optionB: "tuuli",    correctAnswer: "tuli",    type: "vowel length" },
  { id: "mp-9",  sentence: "Ulkona alkoi ____.",                       optionA: "sata",    optionB: "sataa",    correctAnswer: "sataa",   type: "vowel length" },
  { id: "mp-10", sentence: "Hän ____ auttaa minua huomenna.",          optionA: "lupa",    optionB: "lupaa",    correctAnswer: "lupaa",   type: "vowel length" },
  { id: "mp-11", sentence: "Kynttilä ____ hiljaa pöydällä.",           optionA: "pala",    optionB: "palaa",    correctAnswer: "palaa",   type: "vowel length" },
  { id: "mp-12", sentence: "Talvella lämmin ____ maistuu hyvältä.",    optionA: "puro",    optionB: "puuro",    correctAnswer: "puuro",   type: "vowel length" },
  { id: "mp-13", sentence: "Tämän tuotteen ____ on erinomainen.",      optionA: "latu",    optionB: "laatu",    correctAnswer: "laatu",   type: "vowel length" },
  { id: "mp-15", sentence: "Pöydällä oli kypsä ____.",                 optionA: "kivi",    optionB: "kiivi",    correctAnswer: "kiivi",   type: "vowel length" },
  { id: "mp-25", sentence: "Ulkona puhalsi kova ____.",                optionA: "tuli",    optionB: "tuuli",    correctAnswer: "tuuli",   type: "vowel length" },
  { id: "mp-27", sentence: "Auto ajoi tietä ____.",                    optionA: "pitkin",  optionB: "pitkiin",  correctAnswer: "pitkin",  type: "vowel length" },
  { id: "mp-28", sentence: "Kissa juoksi ____ perässä.",               optionA: "hiren",   optionB: "hiiren",   correctAnswer: "hiiren",  type: "vowel length" },
  { id: "mp-29", sentence: "Hän söi aamupalaksi ____.",                optionA: "puroa",   optionB: "puuroa",   correctAnswer: "puuroa",  type: "vowel length" },
  { id: "mp-30", sentence: "Lapsi piirsi paperille ____.",             optionA: "talon",   optionB: "taalon",   correctAnswer: "talon",   type: "vowel length" },
];
