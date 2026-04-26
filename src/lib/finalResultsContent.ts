import type { Level } from "./levels";

export interface SkillArea {
  key: string;
  part: string;
  label: string;
  sub: string;
  level: Level;
  description: string;
}

export const DESCRIPTIONS: Record<string, Record<Level, string>> = {
  sanantunnistus: {
    sujuu: "Todellisten sanojen ja epäsanojen erottaminen onnistui sujuvasti.",
    jonkin: "Todellisten sanojen ja epäsanojen erottamisessa esiintyi jonkin verran epävarmuutta.",
    selvia: "Todellisten sanojen ja epäsanojen erottamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  lukunopeus: {
    sujuu: "Sanojen löytäminen tekstistä onnistui sujuvasti.",
    jonkin: "Sanojen löytämisessä tekstistä esiintyi jonkin verran hitautta tai epätarkkuutta.",
    selvia: "Sanojen löytämisessä tekstistä oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  sanarajat: {
    sujuu: "Sanarajojen tunnistaminen yhteenkirjoitetussa tekstissä onnistui hyvin.",
    jonkin: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä esiintyi jonkin verran vaikeuksia.",
    selvia: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä oli selviä haasteita.",
    missing: "Harjoitusta ei tehty.",
  },
  kirjoitusvirheet: {
    sujuu: "Kirjoitusvirheiden tunnistaminen sanalistasta onnistui hyvin.",
    jonkin: "Kirjoitusvirheiden tunnistamisessa esiintyi jonkin verran epätarkkuutta.",
    selvia: "Kirjoitusvirheiden tunnistamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  luetunYmmartaminen: {
    sujuu: "Luetun ymmärtäminen onnistui hyvin — tekstin sisältö jäsentyi selkeästi.",
    jonkin: "Luetun ymmärtämisessä esiintyi jonkin verran epävarmuutta yksityiskohdissa.",
    selvia: "Luetun ymmärtämisessä oli selviä haasteita.",
    missing: "Harjoitusta ei tehty.",
  },
};

export const AREA_STATIC: Array<Pick<SkillArea, "key" | "part" | "label" | "sub">> = [
  { key: "sanantunnistus",     part: "Osa 1", label: "Sanantunnistus",              sub: "Todellisten ja epäsanojen erottaminen" },
  { key: "lukunopeus",         part: "Osa 2", label: "Lukunopeus ja hahmottaminen", sub: "Sanojen löytäminen tekstistä" },
  { key: "sanarajat",          part: "Osa 3", label: "Sanarajojen hahmottaminen",   sub: "Sanojen erottaminen yhteenkirjoitetussa tekstissä" },
  { key: "kirjoitusvirheet",   part: "Osa 4", label: "Kirjoitusvirheiden tunnistus", sub: "Virheellisten sanojen löytäminen sanalistasta" },
  { key: "luetunYmmartaminen", part: "Osa 5", label: "Luetun ymmärtäminen",         sub: "Tekstin sisällön jäsentäminen ja tulkinta" },
];

export const RESOURCES = [
  { href: "https://www.lukimat.fi", label: "Lukimat.fi",
    desc: "Niilo Mäki Instituutin lukemisen ja laskemisen tukimateriaali" },
  { href: "https://www.eoliitto.fi/oppimisvaikeudet/luku-ja-kirjoitusvaikeudet/", label: "Erilaisten oppijain liitto",
    desc: "neuvontaa ja vertaistukea oppimisvaikeuksiin" },
  { href: "https://www.nmi.fi", label: "Niilo Mäki Instituutti",
    desc: "tutkimustietoa oppimisvaikeuksista" },
  { href: "https://www.kuntoutussaatio.fi/henkiloasiakkaat/oppimisen-tuki", label: "Kuntoutussäätiö — oppimisen tuki",
    desc: "tietoa ja tukea oppimisen vaikeuksiin" },
  { href: "https://helda.helsinki.fi/items/1a192f9a-1368-4b3d-a826-7f07c37181d1", label: "Panula, A.-M. (2013)",
    desc: "Lukemisvaikeudet ja osa-aikainen erityisopetus — seurantatutkimus (Helsingin yliopisto, väitöskirja)" },
];
