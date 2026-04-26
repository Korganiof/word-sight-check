import type { ReadingCompPassage } from "./types";

// Quick-screen variant of NMI Luetun ymmärtäminen (Holopainen et al. 2004).
// One short passage with 12 wrong-word substitutions embedded in real text.
// Three substitution categories — semantic swap, inflection/case error, and
// wrong-real-word — chosen so a careful reader can catch them while a reader
// with weak text-monitoring slips past. Markup: [[wrongWord|correctWord]].
//
// Density: ~290 words / 12 errors ≈ 1 per 24 words. NMI is denser (~1 per 19);
// quick-screen targets the discrimination band where fluent readers catch
// 8–11 of 12 and slow readers catch 1–3.

export const readingCompPassages: ReadingCompPassage[] = [
  {
    id: "rc-passage-1",
    title: "Aamukahvi pienessä kahvilassa",
    paragraphs: [
      "Ulla istui ikkunan vieressä ja [[kuunteli|katseli]] ohi kulkevia ihmisiä. Lokakuun aamu oli harmaa ja kostea, ja kadulla kiirehtivät työmatkalaiset näyttivät väsyneiltä. Hän käänsi katseensa [[pöydästä|pöytään]] ja kohotti kupin huulilleen. Kahvi oli juuri sopivan [[kylmää|lämmintä]].",
      "Kahvilan omistaja, [[nuori|vanha]] mies nimeltä Tapio, pyyhki tiskiä rauhallisin liikkein. Hän oli tuntenut [[Ullasta|Ullan]] jo vuosia ja muisti hänen tilauksensa [[ulkona:|ulkoa:]] tumma kahvi ja yksi kanelipulla.",
      "Pöydän alle painautuneena makasi kahvilan kissa. Se oli vanha ja [[ahkera|laiska]] eläin, joka oli oppinut pysymään poissa kaikkien jaloista. Ulla kurottautui ja raapi sitä kevyesti [[korvasta|korvan]] takaa. Kissa ei avannut silmiään mutta kehräsi tyytyväisenä.",
      "Ovi avautui, ja sisään astui nuori nainen, jolla oli kaksi paksua kirjaa kainalossa. Hän tilasi teetä ja istui Ullan [[viereisen|viereiseen]] pöytään. Tapio toi teen nopeasti, ja nainen alkoi heti selailla [[muistutuksiaan|muistiinpanojaan]]. Ulla katsoi häntä sivusilmällä — opiskelija varmaankin, kenties lukemassa koetta varten.",
      "Ulla oli itse opiskellut [[samaan|samassa]] yliopistossa kolmekymmentä vuotta sitten. Aika oli kulunut [[hitaasti,|nopeasti,]] mutta tämä kahvila oli pysynyt aivan samanlaisena. Samat puiset tuolit, samat valokuvat seinillä ja sama tuoksu uunista.",
    ],
  },
];
