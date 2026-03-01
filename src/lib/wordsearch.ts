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
// Text adapted from a description of Mozart's "Taikahuilu" (The Magic Flute).
export const wordSearchPassage = `Taikahuilu on satu, jossa loistelias musiikki vie katsojat sadunomaisiin tapahtumapaikkoihin. Se on eräs Mozartin tunnetuimmista ja suosituimmista oopperoista, jossa toinen toistaan kauniimmat aariat tavoittavat oopperan kuulijat. Taikahuilua on sanottu kaikkien aikojen parhaaksi oopperaksi. Se on loistelias näyttämötaidemuoto, jossa yhdistyvät musiikki ja näytelmä. Kuten monet Mozart–tutkijat sanovat sen olevan pienempiäkin yksityiskohtia myöten täydellistä! Mozart sävelsi sen Wienissä viimeisenä elinvuotenaan. Taikahuilu valmistui syyskuun 28. päivänä 1791. Oopperan kantaesitys oli kaksi päivää myöhemmin, ja Mozart johti oopperaesityksen. Taikahuilun menestyksestä Mozart sai nauttia vain kaksi kuukautta, hän kuoli 5. joulukuuta 1791. Teos oli alusta saakka menestys. Ennen kaikkea Taikahuilun ansiosta Mozartista tuli ensin nuorten romantikkojen ja myöhemmin kaikenikäisten kuulijoiden ihailtu ja arvostettu taiteilija. Vuoteen 1801 mennessä sitä oli esitetty Wienissä yli 200 kertaa.

Taikahuilun tarina kertoo hyvän ja pahan taistelusta, jossa päähenkilö prinssi Tamino rakastuu Yön kuningattaren tyttäreen Paminaan. Paha demoni on ryöstänyt Paminan. Yön kuningataräiti lupaa tyttärensä Taminolle, jos hän pystyy pelastamaan hänet. Tarina alkaa, kun Prinssi Tamino pakenee valtavaa lohikäärmettä ja huutaa paetessaan apua. Lopulta hän eksyneenä uupuu ja menettää tajuntansa. Tapahtumapaikalle tulee kolme salaperäistä ja kaunista naista, jotka pelastaa hänet tappamalla lohikäärmeen. Yön kuningattaren valtakuntaan eksyneelle Taminolle näytetään kuningattaren kauniin tytön valokuvaa, ja Tamino rakastuu välittömästi prinsessaan. Yön kuningatar ilmestyy ja kertoo pahan demoni Sarastron ryöstäneen Paminan. Hän lupaa Taminolle tyttärensä, jos hän pystyy pelastamaanhänet Sarastron vallasta Viisauden temppelistä.

Tamino lupautuu tehtävään, ja kolme Yön kuningattaren hovinaista lähettävät Taminon matkalle. Hovinaiset määräävät Taminon seuraan narrimaisen linnustaja Papagenon, joka on sattumalta tullut paikalle ja sotkee itsensä tapahtumiin. Naiset antavat matkalaisille taikahuilun ja taikakellopelin, joilla he voivat puolustautua vaaroilta. Tamino ja Papageno matkaavat Sarastron temppeliin. Sarastro kertoo Viisauden temppelissä palveleville papeille, että jumalat ovat tarkoittaneet Paminan ja Taminon toisilleen ja sen takia hän on ryöstänyt Paminan äidiltään.

Vaiheikkaiden tapahtumien jälkeen selviää, ettei Sarastro olekaan niin paha kuin Taminolle on yritetty valehdella. Päinvastoin Yön kuningattaren vallanhimo ja hänen pimeyden vallat taistelevat Sarastron aatteellisuutta vastaan. Yön kuningatarta auttaa orjien päällikkö Monostatos, joka yrittää pakottaa Paminan rakastamaan itseään. Monien tapahtumien jälkeen nuoret pelastuvat, kun auringonsäteet kukistavat hyökkääjät Viisauden temppelissä. Taikahuilu kertoo nuoren prinssin kasvusta hyveiden haltijaksi, viisaaksi ja jalomieliseksi, Sarastron temppelin tulevaksi hallitsijaksi. Myös Papageno saa oman Papagenansa.

Taikahuilun tapahtumat voi helposti sijoittaa mihin aikakauteen tahansa. Samantapaisia pelastus-, sankaritarinoita on löydettävissä vanhoista saduista kuin myös nykyaikaisista elokuvista ja televisio-ohjelmista. Taikahuilun tapahtumien ajattomuus ja musiikin elinvoimaisuus ovat kantaneet sen vuosisatojen ajan oopperan ystävien kuultavaksi ja nähtäväksi.

Suomessa Taikahuilu esitettiin ensimmäisen kerran 1840-luvulla ulkomaalaisena vierailuesityksenä. Ensimmäinen suomalaisin voimin toteutettu Taikahuilu oli Kaarlo Bergbomin suomalaisen oopperan tuotanto tammikuussa 1877. Bergbom oli suomalainen teatterinjohtaja, suomenkielisen teatterin perustaja ja näytelmäkirjailija. Paminan osan lauloi Emmy Achté. Bergbom perusti Suomalaisen teatterin, jonka nimi muuttui myöhemmin Suomen Kansallisteatteriksi, sekä Suomalaisen oopperan, joka on nykyisen Kansallisoopperan edeltäjä. Taikahuilu otettiin Savonlinnan oopperajuhlien ohjelmistoon vuonna 1973. Teos on juhlien eniten esitetty ooppera, sitä on esitetty yli sata kertaa.

Viime aikoina suomalaisilla on ollut mahdollisuus nähdä kyseinen ooppera Turun ruotsalaisessa teatterissa ja Suomen Kansallisoopperassa Helsingissä (keväällä 2016).`;

// Target words that participants must find in the passage.
// Written in uppercase for clarity; matching should be case-insensitive.
export const wordSearchTargets: WordSearchTarget[] = [
  { word: "KUULIJAT" },
  { word: "VIISAUDEN" },
  { word: "TAPAHTUMAPAIKALLE" },
  { word: "AATTEELLISUUTTA" },
  { word: "HYÖKKÄÄJÄT" },
  { word: "PAPAGENON" },
  { word: "AIKOJEN" },
  { word: "PIMEYDEN" },
  { word: "SANKARITARINOITA" },
  { word: "VIERAILUESITYKSENÄ" },
  { word: "KUNINGATTAREN" },
];

