import type { ReadingCompPassage } from "./types";

export const readingCompPassages: ReadingCompPassage[] = [
  {
    id: "rc-passage-1",
    title: "Aamun löytö",
    paragraphs: [
      "Aarne heräsi tavallista aikaisemmin marraskuun perjantaina. Ikkunan takana oli valkoinen huuru, ja lämpömittari näytti kymmentä astetta pakkasta. Hän puki paksun takin ja meni ulos hakemaan postia, vaikka kello oli vasta seitsemän. Postilaatikossa oli yksi kirje ja ilmaislehti.",
      "Kirje oli kirjoitettu käsin, ja lähettäjäksi oli merkitty Ella — naapurin tytär, joka oli muuttanut Tampereelle kaksi vuotta sitten. Ella pyysi Aarnea kastelemaan perheen huonekasveja jouluun asti, koska koko perhe matkustaisi Portugaliin. Kirjeen välissä oli pieni avain ja lappu, jossa luki: \"Kiitos jo etukäteen. Ruusukkaalle kannattaa antaa vähemmän vettä kuin muille.\"",
      "Aarne hymyili ja laittoi avaimen taskuunsa. Hän oli tuntenut Ellan tämän lapsuudesta saakka ja muisti, kuinka tytön isoisä oli aikoinaan opettanut kasvien hoitamista koko kortteliin. Nyt vuoro oli Aarnella.",
    ],
    questions: [
      {
        id: "rc1-q1",
        question: "Mihin vuodenaikaan tarina sijoittuu?",
        options: ["Kevääseen", "Syksyyn, marraskuuhun", "Keskikesään"],
        correctAnswer: "Syksyyn, marraskuuhun",
      },
      {
        id: "rc1-q2",
        question: "Kuka oli kirjoittanut kirjeen?",
        options: ["Aarnen tytär", "Naapurin tytär Ella", "Postinjakaja"],
        correctAnswer: "Naapurin tytär Ella",
      },
      {
        id: "rc1-q3",
        question: "Mitä Aarnea pyydettiin tekemään?",
        options: [
          "Kastelemaan huonekasveja",
          "Siivoamaan pihaa",
          "Hakemaan postia joka päivä",
        ],
        correctAnswer: "Kastelemaan huonekasveja",
      },
      {
        id: "rc1-q4",
        question: "Mihin maahan Ellan perhe oli matkustamassa?",
        options: ["Espanjaan", "Italiaan", "Portugaliin"],
        correctAnswer: "Portugaliin",
      },
      {
        id: "rc1-q5",
        question: "Mitä kirjekuoreen oli pakattu kirjeen lisäksi?",
        options: ["Rahaa", "Avain ja lappu", "Valokuva"],
        correctAnswer: "Avain ja lappu",
      },
    ],
  },
  {
    id: "rc-passage-2",
    title: "Pihakirppis",
    paragraphs: [
      "Maalis-huhtikuun vaihteessa Veera päätti järjestää pihakirpputorin. Hän oli asunut samassa rivitalossa kuusi vuotta ja kerännyt kaappeihinsa paljon tavaraa, jota ei enää tarvinnut. Taloyhtiön hallitus oli antanut luvan myydä tavaraa parkkipaikalla lauantaiaamuna, mutta ainoastaan ennen kello kahtatoista.",
      "Veera laittoi myyntiin vanhoja kirjoja, astioita ja yhden polkupyörän. Ensimmäinen ostaja saapui jo kahdeksalta. Hän oli kouluikäinen poika, joka etsi lahjaa äidilleen. Poika valitsi sinisen kahvimukin ja maksoi kolikoilla.",
      "Iltapäivällä Veera laski rahat keittiönpöydällä. Tavaraa oli mennyt yhteensä viidelläkymmenellä eurolla. Polkupyörää ei kukaan ollut ostanut, joten hän päätti laittaa siitä ilmoituksen paikalliseen kirpputoriryhmään.",
    ],
    questions: [
      {
        id: "rc2-q1",
        question: "Mihin aikaan vuodesta kirpputori pidettiin?",
        options: [
          "Syksyn alussa",
          "Maaliskuun ja huhtikuun vaihteessa",
          "Keskikesällä",
        ],
        correctAnswer: "Maaliskuun ja huhtikuun vaihteessa",
      },
      {
        id: "rc2-q2",
        question: "Kauanko Veera oli asunut samassa rivitalossa?",
        options: ["Kaksi vuotta", "Kuusi vuotta", "Kymmenen vuotta"],
        correctAnswer: "Kuusi vuotta",
      },
      {
        id: "rc2-q3",
        question: "Mihin kellonaikaan mennessä myynnin oli loputtava?",
        options: ["Kymmeneen", "Kahteentoista", "Kahteen"],
        correctAnswer: "Kahteentoista",
      },
      {
        id: "rc2-q4",
        question: "Kuka oli ensimmäinen ostaja?",
        options: [
          "Veeran naapuri",
          "Kouluikäinen poika",
          "Taloyhtiön puheenjohtaja",
        ],
        correctAnswer: "Kouluikäinen poika",
      },
      {
        id: "rc2-q5",
        question: "Mitä Veeralle jäi myymättä?",
        options: ["Kirjoja", "Astioita", "Polkupyörä"],
        correctAnswer: "Polkupyörä",
      },
    ],
  },
];
