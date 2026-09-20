import type { ReadingCompPassage } from "./types";

// Quick-screen variant of NMI Luetun ymmärtäminen (Holopainen et al. 2004).
// NMI: a literary text with 52 words swapped for semantically wrong ones,
// no strict time limit; 9th-grade norm mean ≈ 33–37/52, support-need
// cut-off 25/52 (Panula 2013, tables 12 & 29). Here: one ~250-word story,
// 12 substitutions (≈ 1 per 20 words, close to NMI density), 4 min.
//
// Rules for substitutions — every one must be a real word in the correct
// inflection that contradicts the sentence or the sentence before it
// ("puki takin, sillä aamu oli kuuma"). Never a case/inflection error (that
// makes the text read as broken Finnish rather than as a comprehension
// probe) and never a word that merely *could* be different (a young café
// owner is not an error). The reader does not need to know the intended
// word, only to notice that the one on the page does not fit.
// Markup: [[wrongWord|intendedWord]]. The intended word is never shown.

export const readingCompPassages: ReadingCompPassage[] = [
  {
    id: "rc-passage-2",
    title: "Lauantai torilla",
    paragraphs: [
      "Lauantaiaamuna Mikko heräsi aikaisin. Aurinko paistoi jo ikkunasta, ja hän päätti lähteä torille ostamaan tuoreita marjoja. Hän puki takin päälleen, sillä aamu oli vielä [[kuuma|viileä]], vaikka kesä oli parhaimmillaan. Polkupyörä odotti pihalla, ja matka torille kesti vain kymmenen minuuttia. Tie kulki puiston läpi, ja koivujen lehdet välkkyivät aamuauringossa.",
      "Torilla oli jo paljon väkeä. Myyjät huutelivat tarjouksiaan, ja ilmassa leijui vastapaistetun leivän [[ääni|tuoksu]]. Mikko käveli mansikkakojulle, jonka edessä oli pitkä jono. Hän odotti [[nopeasti|kärsivällisesti]] vuoroaan ja katseli sillä aikaa ympärilleen. Vieressä vanha mies myi kukkia suurista ämpäreistä, ja lapset [[nukkuivat|juoksivat]] nauraen kojujen välissä.",
      "Kojun edessä seisova pariskunta kyseli myyjältä, mistä marjat olivat kotoisin. Kun Mikon vuoro tuli, hän osti kaksi litraa mansikoita ja litran mustikoita. Myyjä [[itki|hymyili]] ja toivotti hyvää viikonloppua. Mikko laski marjat pyörän koriin [[huolimattomasti|varovasti]], etteivät ne litistyisi matkalla. Sitten hän kiersi vielä kalakojun kautta ja osti savustettua lohta illalliseksi.",
      "Kotimatkalla Mikko poikkesi naapurinsa Liisan luona. Liisa istui kuistilla ja luki [[kahvia|lehteä]]. Mikko antoi hänelle puolet mansikoista, koska Liisa oli edellisellä viikolla auttanut häntä [[pilaamaan|korjaamaan]] pyörän. Liisa kiitti ja lupasi leipoa niistä [[keittoa|piirakan]].",
      "Kotona Mikko huuhteli marjat ja laittoi osan pakastimeen talvea varten. Pakastimessa oli hyvin tilaa, sillä edellisen kesän marjat oli syöty talven aikana. Loput hän söi saman tien, sillä tuoreet mansikat olivat hänen mielestään kesän [[pahin|paras]] herkku. Illalla hän kattoi pöydän parvekkeelle. Lohi maistui [[pahalta|hyvältä]], ja hän söi sen viimeistä palaa myöten. Päivä oli ollut [[ikävä|mukava]], ja Mikko päätti tehdä saman retken ensi viikonloppunakin.",
    ],
  },
];

// Practice sentences for the ready screen: one obvious category error and one
// logical contradiction, so the user has done the task once before the timed
// part starts. Same markup; the intended word IS shown here, once.
export const readingCompPractice: string[] = [
  "Aamulla Liisa söi aamiaiseksi lautasellisen [[kenkiä|puuroa]].",
  "Kello soi seitsemältä, ja Pekka nousi sängystä ja meni [[nukkumaan|suihkuun]].",
];
