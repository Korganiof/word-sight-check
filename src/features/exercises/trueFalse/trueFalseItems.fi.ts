import type { TrueFalsePassage } from "./types";

export const trueFalsePassages: TrueFalsePassage[] = [
  {
    id: "tf-klassismi",
    title: "Klassismin musiikki",
    paragraphs: [
      "Musiikin klassista tyylikautta (1750–1800) edelsi barokin tyylikausi ja sitä seurasi romantiikan tyylikausi. Klassismin kaudella Euroopassa korostettiin järjen ja tiedon merkitystä. Ensimmäistä kertaa vuosisatoihin nostettiin esille ihmisoikeudet ja uskonnonvapaus.",
      "Suvaitsevampi ilmapiiri mahdollisti sen, että musiikkia voitiin soittaa julkisissa konserteissa. Konserttisaleihin pääsi suuria ihmismääriä, ja musiikin tuntemus levisi kaiken kansan piiriin. Klassismin loppupuolella musiikkielämän keskus siirtyi Wieniin. Siellä asuivat kaikki kolme klassisen kauden merkittävintä säveltäjää: Joseph Haydn, Wolfgang Amadeus Mozart ja Ludwig van Beethoven.",
    ],
    statements: [
      {
        id: "tf-k-1",
        statement: "Musiikin klassista tyylikautta seurasi barokin tyylikausi.",
        isTrue: false,
      },
      {
        id: "tf-k-2",
        statement: "Musiikin tuntemus lisääntyi klassismin ajalla.",
        isTrue: true,
      },
      {
        id: "tf-k-3",
        statement: "Valistusaatteet korostivat järjen ja tiedon merkitystä.",
        isTrue: true,
      },
      {
        id: "tf-k-4",
        statement: "Tällä kaudella vaiettiin ihmisoikeuksista ja uskonnonvapaudesta.",
        isTrue: false,
      },
      {
        id: "tf-k-5",
        statement:
          "Klassismin aikakaudella musiikkitapahtumat toimivat myös sosiaalisina tapahtumina.",
        isTrue: true,
      },
      {
        id: "tf-k-6",
        statement: "Wienissä asuivat kaikki kolme klassisen musiikin suurinta säveltäjää.",
        isTrue: true,
      },
      {
        id: "tf-k-7",
        statement: "Kolme suurinta wieniläisklassikkoa olivat Haydn, Mozart ja Bach.",
        isTrue: false,
      },
    ],
  },
];
