import type { ReadingCompPassage } from "./types";

// Quick-screen variant of NMI Luetun ymmärtäminen (Holopainen et al. 2004).
// One short passage (~165 words) with 12 wrong-word substitutions embedded in
// real text — a mix of semantic contradictions, wrong inflection/case, and
// wrong-real-word swaps. Every substitution must be decidable from the text
// itself: a word that merely *could* be different (a young café owner, time
// passing slowly) is not an error, and a fluent reader who lets it pass
// would be scored down. Markup: [[wrongWord|correctWord]].

export const readingCompPassages: ReadingCompPassage[] = [
  {
    id: "rc-passage-1",
    title: "Aamukahvi pienessä kahvilassa",
    paragraphs: [
      "Ulla istui ikkunan vieressä ja [[kuunteli|katseli]] ohi kulkevia ihmisiä. Lokakuun aamu oli harmaa ja kostea, ja kadulla kiirehtivät työmatkalaiset näyttivät väsyneiltä. Hän käänsi katseensa pöytään ja kohotti [[kupissa|kupin]] huulilleen. Kahvi oli juuri sopivan [[kylmää|lämmintä]].",
      "Kahvilan omistaja, vanha [[nainen|mies]] nimeltä Tapio, pyyhki tiskiä rauhallisin liikkein. Hän oli tuntenut [[Ullasta|Ullan]] jo vuosia ja muisti hänen tilauksensa [[ulkona:|ulkoa:]] tumma kahvi ja yksi kanelipulla.",
      "Pöydän alle painautuneena makasi kahvilan kissa. Se oli vanha ja [[ahkera|laiska]] eläin, joka oli oppinut pysymään poissa kaikkien jaloista. Ulla kurottautui ja raapi sitä kevyesti [[korvasta|korvan]] takaa. Kissa ei avannut silmiään mutta kehräsi tyytyväisenä.",
      "Ovi avautui, ja sisään astui nuori nainen, jolla oli kaksi paksua kirjaa kainalossa. Hän tilasi teetä ja istui Ullan [[viereisen|viereiseen]] pöytään. Tapio toi teen nopeasti, ja nainen alkoi heti selailla [[muistutuksiaan|muistiinpanojaan]]. Ulla katsoi häntä sivusilmällä — opiskelija varmaankin, kenties lukemassa koetta varten.",
      "Ulla oli itse opiskellut [[samaan|samassa]] yliopistossa kolmekymmentä vuotta sitten. Aika oli kulunut nopeasti, mutta tämä kahvila oli [[muuttunut|pysynyt]] aivan samanlaisena. Samat puiset tuolit, samat valokuvat seinillä ja sama tuoksu uunista.",
    ],
  },
];
