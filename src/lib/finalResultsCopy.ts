import type { SkillArea } from "./finalResultsContent";

export function buildSummary(areas: SkillArea[]): string {
  const completed = areas.filter(a => a.level !== "missing");
  if (completed.length === 0) {
    return "Yhtään harjoitusta ei ole tehty. Tee harjoitukset nähdäksesi yhteenvedon.";
  }
  const severeCount = completed.filter(a => a.level === "selvia").length;
  const goodCount = completed.filter(a => a.level === "sujuu").length;

  if (goodCount === completed.length) {
    return "Tulokset viittaavat sujuvaan lukutaitoon kaikilla mitatuilla osa-alueilla.";
  }
  if (severeCount >= 2) {
    return "Tulokset viittaavat selkeisiin haasteisiin useammalla osa-alueella. Asiantuntijan arvio voi olla hyödyllinen.";
  }
  if (severeCount === 1) {
    return "Tuloksissa on vaihtelua. Yhdellä osa-alueella esiintyi selviä haasteita, muut sujuivat kohtuullisesti tai hyvin.";
  }
  return "Tulokset viittaavat pääosin sujuvaan lukutaitoon. Yhdellä tai kahdella osa-alueella esiintyi jonkin verran haasteita.";
}

export function buildInterpretation(areas: SkillArea[]): string {
  const completed = areas.filter(a => a.level !== "missing");
  if (completed.length === 0) return "";
  const severeCount = completed.filter(a => a.level === "selvia").length;
  const mildCount = completed.filter(a => a.level === "jonkin").length;
  const goodCount = completed.filter(a => a.level === "sujuu").length;

  if (goodCount === completed.length) {
    return "Tämä ei silti sulje pois lukivaikeuksia — seulonnan tarkkuus on rajallinen, ja arki on parempi mittari kuin lyhyt tehtäväsarja. Jos lukeminen tuntuu silti kuormittavalta, aiheesta kannattaa keskustella.";
  }
  if (severeCount >= 2) {
    return "Tämänkaltainen kuvio voi olla yhteydessä lukemisen vaikeuksiin, mutta seulonta ei todenna eikä poissulje mitään. Jos tulokset tuntuvat arjessa tutuilta, ammattilaisen arvio voi tuoda selkeyttä.";
  }
  if (severeCount === 1 || mildCount >= 2) {
    return "Haasteet voivat liittyä lukemisen sujuvuuteen tai tarkkuuteen, mutta yhdestä seulonnasta ei voi tehdä päätelmiä. Vireystila, keskittyminen ja päivän kulku vaikuttavat tuloksiin.";
  }
  return "Yksittäiset epävarmuudet ovat tavallisia eivätkä kerro vielä mistään. Jos lukeminen tuntuu arjessa raskaalta, kannattaa kysyä asiaa ammattilaiselta.";
}

const NMI_ALIGNED_KEYS = ["sanarajat", "kirjoitusvirheet", "luetunYmmartaminen"] as const;

export function shouldFlagSupportNeed(areas: SkillArea[]): boolean {
  const nmiAreas = areas.filter(a =>
    (NMI_ALIGNED_KEYS as readonly string[]).includes(a.key) && a.level !== "missing",
  );
  if (nmiAreas.length < 2) return false;
  const severe = nmiAreas.filter(a => a.level === "selvia").length;
  return severe >= 2;
}
