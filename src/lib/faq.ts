// Questions people actually search around "lukihäiriö testi" (Google
// autocomplete, 2026-10). Rendered on Home and emitted as FAQPage JSON-LD from
// the same data, so the two can never disagree. Keep the answers honest:
// this is a screening, never a diagnosis.

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "Onko minulla lukihäiriö?",
    answer:
      "Tämä testi ei voi kertoa sitä varmasti, sillä lukihäiriön toteaa aina ammattilainen, esimerkiksi erityisopettaja tai psykologi. Testi antaa kuitenkin suuntaa: se mittaa samoja taitoja kuin suomalaiset lukiseulat, kuten sanojen tunnistamista, oikeinkirjoitusta ja luetun ymmärtämistä. Jos tulos viittaa haasteisiin tai lukeminen tuntuu arjessa raskaalta, kannattaa hakeutua tarkempaan arvioon.",
  },
  {
    question: "Voiko lukihäiriön testata netissä?",
    answer:
      "Netissä voi tehdä suuntaa antavan seulonnan, kuten tämän. Virallinen lukitesti ja lukilausunto tehdään aina ammattilaisen kanssa, esimerkiksi koulussa, oppilaitoksessa tai yksityisellä palveluntarjoajalla.",
  },
  {
    question: "Saako tästä testistä diagnoosin tai lukilausunnon?",
    answer:
      "Ei. Lukutaju on suuntaa antava seulonta, eikä se korvaa ammattilaisen tutkimusta. Esimerkiksi ylioppilaskirjoitusten erityisjärjestelyihin tarvitaan ammattilaisen kirjoittama lausunto.",
  },
  {
    question: "Kenelle testi on tarkoitettu?",
    answer:
      "Yli 15-vuotiaille nuorille ja aikuisille, noin 9. luokasta ylöspäin. Nuoremman lapsen lukemisen arviointi kannattaa tehdä koulussa erityisopettajan kanssa, jolla on ikätasolle sopivat välineet.",
  },
  {
    question: "Mitä testi mittaa ja kauanko se kestää?",
    answer:
      "Testissä on viisi lyhyttä tehtävää: sanantunnistus, sanojen etsiminen tekstistä, sanarajojen hahmottaminen, kirjoitusvirheiden tunnistaminen ja luetun ymmärtäminen. Kolme niistä noudattaa Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan tehtävätyyppejä ja aikarajoja. Koko testi kestää noin 10–15 minuuttia.",
  },
  {
    question: "Tallennetaanko vastaukseni?",
    answer:
      "Ei. Lukutaju ei kerää henkilötietoja eikä lähetä tuloksia minnekään. Vastaukset säilyvät vain selaimesi istuntomuistissa ja katoavat, kun suljet välilehden.",
  },
];

/** schema.org FAQPage for the same questions (rendered as JSON-LD on Home). */
export function faqJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}
