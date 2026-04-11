export interface WordSearchTarget {
  word: string;
}

export interface WordSearchResult {
  foundCorrect: number;
  incorrectClicks: number;
  missedTargets: number;
  totalTargets: number;
  durationMs: number;
}

const STORAGE_KEY = "dyslexia-wordsearch-result";

export function saveWordSearchResult(result: WordSearchResult): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadWordSearchResult(): WordSearchResult | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WordSearchResult;
  } catch {
    return null;
  }
}

export function clearWordSearchResult(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

// Passage text and targets for the word search task.
// Original text written for LukiSeula.
export const wordSearchPassage = `Suomalaiset metsät kuuluvat maailman puhtaimpiin ja laajimpiin. Yli kaksi kolmasosaa Suomen pinta-alasta on metsää, ja metsissä elää rikas eläin- ja kasvillisuus. Keväällä luonto herää talviunestaan, kun muuttolinnut palaavat etelästä tuoden mukanaan kesän ensimerkit. Näyttävimmistä muuttolinnuista joutsenet lentävät kauniissa parvissa pohjoista kohti. Metsässä voi aistia kevään saapumisen jo ennen kuin lumi on kokonaan sulanut – ilma tuoksuu kostealta maalta ja kuusen pihkalta.

Kesällä suomalaiset viettävät aikaansa mökeillään järvien rannoilla. Mökkeily on syvälle juurtunut osa suomalaista elämäntapaa ja kesän odotusta. Mökin ympäristössä voi marjastaa, kalastaa ja nauttia luonnon rauhasta. Mustikkaa löytyy metsistä runsaasti, ja kokenut marjastaja voi kerätä usean kilon päivässä. Sienestäjät liikkuvat aamuvarhaisella metsässä, sillä sienet kasvavat parhaiten sateisen jakson jälkeen. Suomessa tunnetuimpia ruokasieniä ovat kantarelli, haaparouskut ja tatit.

Syksyllä metsä muuttuu upeaksi värimaisemaksi. Ruska-aika on yksi suomalaisista luonnonilmiöistä, jolloin lehtipuut muuttavat lehtensä keltaisiksi, oransseiksi ja punaisiksi ennen niiden putoamista. Kaamos saapuu Pohjois-Suomeen loka-marraskuussa, kun aurinko ei enää nouse lainkaan horisontin yläpuolelle. Tähtiharrastajille tämä on parasta aikaa, sillä revontulet voivat syttyä taivaalle milloin tahansa yöllä.

Talvella lumipeite peittää koko maiseman ja metsä hiljenee. Pohjoisessa porot kaivavat lumen alta jäkälää ravinnokseen. Hiihtäjät ja moottorikelkkailijat nauttivat pitkistä talvisista maastoista. Järvet jäätyvät, ja kalastajat harrastavat pilkintää lähtevillään kauas jäälle pitkine varustuksineen. Jäätyneen järven pinta on myös suosittua luistelumaastoa koko perheelle.

Suomalainen jokamiehenoikeus on ainutlaatuinen perinne, joka antaa kaikille ihmisille oikeuden liikkua luonnossa vapaasti riippumatta maan omistuksesta. Sen ansiosta kenellä tahansa on mahdollisuus poimia marjoja, sieniä ja kukkia myös yksityismailla. Luontoretket ovat suomalaisten suosituimpia vapaa-ajan aktiviteetteja. Kansallispuistot tarjoavat merkittyjä reittejä ja luontopalveluja kaikille retkeilijöille ympäri vuoden.`;

// Target words that participants must find in the passage.
// Written in uppercase for clarity; matching should be case-insensitive.
export const wordSearchTargets: WordSearchTarget[] = [
  { word: "KASVILLISUUS" },
  { word: "MUUTTOLINNUT" },
  { word: "SIENESTÄJÄT" },
  { word: "KANTARELLI" },
  { word: "VÄRIMAISEMAKSI" },
  { word: "LUONNONILMIÖISTÄ" },
  { word: "REVONTULET" },
  { word: "LUMIPEITE" },
  { word: "MOOTTORIKELKKAILIJAT" },
  { word: "JOKAMIEHENOIKEUS" },
  { word: "LUONTORETKET" },
  { word: "KANSALLISPUISTOT" },
];

