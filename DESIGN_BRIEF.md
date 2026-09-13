# LukiSeula — design brief for a UI/UX refresh

This is a self-contained handoff for redesigning the app's look and feel. It
describes what the app is, who uses it, every screen, the current design
system, and what must not change. Nothing here requires reading the code.

The ask: **make it feel more modern and polished without making it harder to
read.** The users are people who suspect they have a reading difficulty —
readability is the product, not a nice-to-have.

---

## 1. What the app is

**LukiSeula** ("reading screen") is a free, anonymous, Finnish-language
dyslexia *screening* tool for people aged 15+ (roughly 9th grade up through
adults). It runs a 10–15 minute battery of five timed reading exercises in the
browser and ends with a report that says, per skill area, whether things went
smoothly, showed some difficulty, or showed clear difficulty — and whether it
would be worth having a professional take a look.

It is a hobby project built with AI assistance, and it says so. It is **not** a
diagnosis and never claims to be. The exercises follow the Finnish NMI adult
screening battery (Holopainen et al. 2004) as validated in a Helsinki
University dissertation (Panula 2013), which the app credits.

- Language: **all UI and content in Finnish.** Copy below is final unless
  marked otherwise — design around the real text.
- Platform: responsive web app, used on phones and laptops in roughly equal
  measure. Exercises must work one-handed on a phone.
- Privacy: no accounts, no analytics, no cookies, no third-party requests
  (the font is self-hosted). Results live only in the browser tab.

### Tone

Calm, warm, trustworthy, plain-spoken. Think "a good special-needs teacher's
office", not a hospital and not a kids' app. The user may be anxious about
the result; the design should lower the temperature, never gamify or alarm.
Avoid: mascots, confetti, exclamation marks, red warning styling for ordinary
information, stock-photo people.

---

## 2. Who the users are (design implications)

Adults and teenagers who read slowly, misread, or avoid reading. Some have
never been assessed; some are checking on behalf of a child or a partner.
Many will do this on a phone in one sitting.

Hard requirements that follow from this audience:

- **Body text ≥ 16 px, line-height ≥ 1.5, measure ≤ ~70 characters**, left-
  aligned, never justified. Paragraphs short.
- **Contrast ≥ 4.5:1 for all text**, including "secondary" text, counters,
  hints and footers. No light-grey-on-cream. (The previous design used
  `#d2c5b0` for hints — 1.6:1 — and it has been removed; don't bring it back.)
- **No italics or all-caps for anything longer than a two-word label.**
  Small-caps tracking labels are fine.
- A clean humanist/geometric sans. Current font is **Manrope** (self-hosted).
  Any replacement must be self-hostable and have clearly distinct
  `I / l / 1` and `a / o / e` shapes.
- **Tap targets ≥ 44 px** in exercises; the letter-tapping exercise (Osa 3)
  is the hardest case.
- **Timers must not induce panic.** A numeric readout plus a thin progress
  line is enough. The current design turns the timer red in the last 30 s —
  consider something calmer (a shift to the dark accent, a subtle pulse).
- **Respect `prefers-reduced-motion`.** Transitions should be short and
  optional; nothing should move while the user is reading.
- Keyboard operable throughout; visible focus rings.
- Meaning is never carried by colour alone (the level chips always have a
  text label).

---

## 3. Current design system ("The Elevated Curator")

Keep the identity — warm, quiet, editorial — but you have licence to evolve it.
Current values:

### Colour

| Role | Hex | Use |
|---|---|---|
| Canvas | `#fff8f5` | page background (also the iOS overscroll colour) |
| Card | `#ffffff` | elevated/active cards |
| Recessed | `#f9ede4` | inset panels, alternating rows |
| Well | `#f9e4d6` | footer wells, progress track, soft chips |
| Hero tint | `#fff1e9` / `#ffeadc` | large section backgrounds on Home |
| Text | `#241a11` | body text — never pure black |
| Text, secondary | `#755e4d` | hints, counters, captions (5.8:1 on canvas) |
| Label | `#785a00` | small-caps section labels, tertiary buttons (6.1:1) |
| Gold | `#C69A2B` | **primary CTAs only**, progress fill, active marks — flat, no gradients |
| Gold, hover | `#785a00` | |
| Brown | `#4A3728` | secondary buttons, dark bands |
| Brown, deep | `#2F241B` | hover for brown; hairline rules |
| Bar/ghost | `#d2c5b0` | inactive bars and ghost borders **only, never text** |

Level colours (results): 
- Sujuu hyvin — `#4f7a3a` on `#e6ebd8`
- Jonkin verran haasteita — `#C69A2B` on `#f9e4d6`
- Selviä haasteita — `#a6442a` on `#f1d8ce`
- Harjoitusta ei tehty — `#755e4d` on `#f0ece3`

Timer "low" colour is currently `#ef4444` (off-palette). Replace.

### Type

- **Manrope** (variable, 200–800). Display: tight tracking (−2 %), line-
  height 1.05–1.1. Body: 1.6. Labels: 11–12 px, bold, uppercase, +0.12 em
  tracking, colour `#785a00`.
- Numbers in tabular figures (timers, scores).

### Shape & depth rules

- No 1 px borders — use background-colour shifts.
- No divider lines — whitespace or alternating bands.
- Shadows only as `#2F241B` at ≤ 5–8 % opacity, 24–64 px blur.
- Radii: cards 12–24 px, buttons 8–12 px, hero sections 32 px.
- Primary button: gold fill, white text, no shadow. Secondary: brown fill.
  Tertiary: no fill, `#785a00` text.

### Brand marks

- Favicon: a gold magnifying glass whose lens contains rows of short text
  "pills" (a page seen through a lens). Rounded square, canvas background.
- OG card: canvas background, one hero tint card, "LukiSeula" wordmark in
  `#28180b`, gold accent bar.

---

## 4. Flow and information architecture

```
Home (/)
  └─ Aloita seulonta ──► Consent (/consent)
                            └─ Jatka ──► Start (/start)  [instructions for Osa 1]
                                            └─► Osa 1  Sanantunnistus       (/task/pseudowords)
                                                Osa 2  Sanojen etsiminen     (/task/word-search)
                                                Osa 3  Sanaketjut            (/exercise/word-chains)
                                                Osa 4  Kirjoitusvirheet      (/exercise/spelling-errors)
                                                Osa 5  Luetun ymmärtäminen   (/exercise/reading-comp)
                                                └─► Results (/results)  ──► Tallenna PDF / Etusivulle

Exercises list (/exercises)   — every exercise individually + two supplementary
  ├─ Lisä: Tavut (/exercise/syllables)         ─► end screen ─► back to list
  └─ Lisä: Pituuserot (/exercise/minimal-pairs) ─► end screen ─► back to list

404 (any other URL)
```

Osa 2–5 each open with a **"ready" screen** (title, subtitle, 2–4 numbered
instruction cards, one start button) and then the exercise itself. Osa 1's
ready screen is the `/start` page. Each exercise hands off to the next
automatically when finished or when its timer runs out. There is no back
navigation inside the battery and no way to pause — that's intentional.

---

## 5. Screens

Screen sizes to design: 390 × 844 (phone) and 1440 × 900 (laptop). Everything
except Home is a single column, max width ≈ 42–48 rem, centred.

### 5.1 Home `/`

Currently: floating frosted nav → hero card → "Mitä on lukihäiriö?" panel →
"Mitä seulonta mittaa?" bento grid (5 cards) → dark brown banner with CTA →
research credit + disclaimer line → Tietosuoja card → "Lisätietoa ja tukea"
(4 link cards) → footer. It works but is long and the hero is disclaimer-heavy.

Must keep, above the fold: the H1, the one-line "not a diagnosis" disclaimer,
the primary CTA, and the four facts (10–15 min · Yli 15-vuotiaille · Anonyymi ·
Ilmainen). The 15+ audience must be obvious without scrolling.

Copy (final):

- Nav: **LukiSeula** · Etusivu · Mitä seulonta mittaa? · Lisätietoa ja tukea ·
  [Aloita seulonta]
- Badge: `SEULONTATYÖKALU · YLI 15-VUOTIAILLE`
- H1: **Lukihäiriön seulonta**
- Lede: *Lyhyt seulonta yli 15-vuotiaille nuorille ja aikuisille. Se antaa
  viitteitä siitä, liittyykö lukemiseesi haasteita — kartoitat omat vahvuutesi
  ja kehityskohteesi viidellä lyhyellä tehtävällä.*
- Disclaimer: **Tämä seulonta ei diagnosoi lukihäiriötä.** Tulokset ovat vain
  suuntaa antavia. Jos ne viittaavat haasteisiin, käänny erikoisopettajan,
  psykologin tai terveydenhuollon ammattilaisen puoleen.
- CTAs: [Aloita seulonta →] [Lue lisää]
- Facts: 10–15 min · Yli 15-vuotiaille · Anonyymi · Ilmainen
- Section **Mitä on lukihäiriö?** — two short paragraphs (5–10 % of Finns;
  neurobiological, often hereditary; not related to intelligence; support
  helps).
- Section **Mitä seulonta mittaa?** — five cards:
  1. **Sanantunnistus** — Erottelet todellisia suomen kielen sanoja keksityistä
     pseudosanoista pelkän kirjoitusasun perusteella…
  2. **Lukunopeus ja hahmottaminen** — Etsit annettuja sanoja pidemmästä
     tekstistä aikarajan puitteissa…
  3. **Sanarajojen hahmottaminen** — Lauseessa kaikki sanat on kirjoitettu
     yhteen ilman välejä — tunnistat, mistä yksi sana loppuu ja toinen alkaa…
  4. **Kirjoitusvirheiden tunnistus** — Käyt läpi sanalistan ja merkitset
     sanat, joissa on kirjoitusvirhe…
  5. **Luetun ymmärtäminen** — Luet lyhyen tarinan, johon on vaihdettu sanoja,
     jotka eivät sovi lauseen merkitykseen — ja merkitset ne…
- Banner: **Saat välittömän yhteenvedon** — Seulonnan lopuksi saat yhteenvedon
  tuloksistasi osa-alueittain sekä vinkkejä siitä, mistä hakea lisätietoa tai
  tukea. [ALOITA NYT]
- Credit: Perustuu suomalaiseen lukivaikeustutkimukseen — *Panula, 2013,
  Helsingin yliopisto.* / LukiSeula on yksityishenkilön harrasteprojekti,
  rakennettu tekoälyn avustuksella. Ei kliininen eikä ammatillinen työkalu.
- **Tietosuoja**: LukiSeula ei kerää henkilötietoja, ei käytä evästeitä eikä
  lähetä tuloksia minnekään. Sivusto ei lataa mitään kolmansien osapuolten
  palveluista. Vastauksesi ja tuloksesi säilyvät vain selaimesi
  istuntomuistissa ja katoavat, kun suljet välilehden.
- **Lisätietoa ja tukea**: Lukimat.fi · Erilaisten oppijain liitto · Niilo
  Mäki Instituutti · Kuntoutussäätiö — oppimisen tuki (each with a one-line
  description, opens in a new tab).
- Footer: LukiSeula · Tietosuoja · © {year} LukiSeula · Harrasteprojekti

### 5.2 Consent `/consent`

Title **Suostumus ja ymmärrys**. Lede: *Ennen kuin aloitamme luku- ja
kirjoitusvalmiuksien kartoituksen, pyydämme sinua lukemaan ja hyväksymään
seuraavat ehdot.* Five information cards (icon + heading + 2 lines):

1. **Suunniteltu vähintään 15-vuotiaille** — mitoitettu nuorille ja
   aikuisille, noin 9. luokasta ylöspäin…
2. **Tämä EI ole diagnoosi** — vain alustavaa, suuntaa antavaa tietoa…
3. **Harrasteprojekti, rakennettu tekoälyllä** — ei kliininen eikä
   tieteellisesti validoitu arviointiväline…
4. **Käyttö on anonyymia** — emme kerää henkilötietoja; tulokset säilyvät vain
   tämän istunnon ajan…
5. **Hakeudu tarvittaessa tutkimuksiin** — jos tulokset herättävät huolta…

Then one checkbox: *Ymmärrän, että tämä ei ole **diagnoosi**, että kyseessä on
**tekoälyavusteinen harrasteprojekti** ja että käyttökertani on **anonyymi**.
Hyväksyn nämä ehdot ja haluan jatkaa seulonnan tekemistä.* Buttons: [Jatka
tehtävään →] (disabled until checked) [Peruuta].

Pain point: five equal cards + a checkbox reads as a wall. Hierarchy welcome
(e.g. the three things the checkbox actually asserts vs. the two advisory
notes), as long as all five remain and the checkbox stays explicit.

### 5.3 Ready screens (Start `/start` and the four in-battery ones)

Shared pattern: small-caps step label (`OSA 1 / 5 — SANANTUNNISTUS`) with a
thin progress line, H1, one-line subtitle, 2–4 numbered instruction cards,
one full-width primary button (`Aloita harjoitus` / `Jatka tehtävään`).

Start-page cards (Osa 1): **Tehtävän kuvaus** (real word or made up; three
practice words first) · **Näin vastaat** (buttons or keys — `A` = Oikea sana,
`L` = Ei sana; show the two keycaps) · **Kolme sekuntia per sana** (each word
shows for at most three seconds; a timeout counts as wrong — answer on first
impression).

Instruction copy for the other four is in §5.4 with each exercise.

### 5.4 Exercise template

Every exercise shares one frame:

```
┌──────────────────────────────────────────────────────┐
│ LukiSeula                              AIKAA JÄLJELLÄ │   ← nav; timer right (m:ss, tabular)
│                                              2:41     │
├──────────────────────────────────────────────────────┤
│ OSA 4 — ETSI KIRJOITUSVIRHEET            12 merkittyä │   ← step label + live counter
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   ← progress line (time or items)
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ OHJE                                             │ │   ← short instruction card
│ │ Klikkaa kaikki sanat, joissa on kirjoitusvirhe…  │ │
│ └──────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                  │ │   ← the task itself (varies)
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│              [ Valmis / Olen valmis ]                │   ← finish early (where allowed)
└──────────────────────────────────────────────────────┘
```

No feedback is shown during any battery exercise (right/wrong is never
revealed) — like the paper test. Transitions between exercises are currently
abrupt route changes; a short, calm transition would help.

**Osa 1 — Sanantunnistus** (`/task/pseudowords`). One word at a time, very
large, centred in a card, question label above it: `ONKO TÄMÄ OIKEA SANA?`.
Under the word a thin 3-second timer bar drains. Two big buttons side by side:
[Oikea sana (A)] gold · [Ei sana (L)] brown. 3 practice words (badge
`HARJOITTELU` in the nav) then 30 scored. Progress: `Tehtävä 12 / 30` + bar.
No overall timer.

**Osa 2 — Sanojen etsiminen tekstistä** (`/task/word-search`), 3 min. Card 1:
`TAVOITESANAT — KLIKKAA NE TEKSTISTÄ` with 12 uppercase chips (e.g.
KASVILLISUUS, MUUTTOLINNUT, KANTTARELLI…). Card 2: a ~250-word prose passage
about Finnish nature and seasons; every word is tappable and toggles a gold
highlight. Counter `n valittua`. Button [Olen valmis]. Ready-screen copy: *Näet
lyhyen tekstin ja sen yläpuolella listan sanoista, joita sinun täytyy etsiä /
Kun löydät sanan tekstistä, klikkaa sitä — se korostuu / Sinulla on 3
minuuttia aikaa.*

**Osa 3 — Sanaketjujen erottaminen** (`/exercise/word-chains`), 1.5 min, 15
sentences. The hardest one to design well. A sentence is shown with its words
run together, e.g. `Lapsetleikkivätpuistossa`, as large letters; the user taps
the **last letter of each word** and a thin gold boundary mark appears after
it (tap again to remove). When as many boundaries are marked as the sentence
has, it advances by itself after 0.5 s; a small tertiary [Seuraava →] skips.
Counter `2 / 3 sanarajaa merkitty`. Two progress lines (sentences, time).
Needs: letter targets ≥ 44 px tall on phones without the chain looking like
spaced-out text; the mark must appear **without shifting the letters**; long
sentences may wrap. Ready-screen copy: *Näet lauseen, jossa kaikki sanat on
kirjoitettu yhteen… / Napauta jokaisen sanan viimeistä kirjainta — sen perään
ilmestyy sanaraja / Kun olet merkinnyt kaikki sanarajat, lause vaihtuu hetken
kuluttua itsestään… / Sinulla on 1,5 minuuttia aikaa 15 lauseeseen…*

**Osa 4 — Etsi kirjoitusvirheet** (`/exercise/spelling-errors`), 3.5 min. A
grid of 100 words (2 columns on phone, 4 on laptop), each a toggle button;
marked = gold fill, white text. Counter `n merkittyä`. Button [Valmis]
(brown). Half the words are misspelt (single-letter errors: *takkki,
appelsini, kilomeetri*).

**Osa 5 — Luetun ymmärtäminen** (`/exercise/reading-comp`), 4 min. Same
prose-with-tappable-words UI as Osa 2: a titled ~240-word story ("Lauantai
torilla") in which 12 words have been swapped for words that don't fit the
meaning; the user taps them. Instruction: *Lue tarina rauhassa. Siihen on
vaihdettu 12 sanaa, jotka eivät sovi lauseen merkitykseen — sana on oikeaa
suomea, mutta se tekee lauseesta järjettömän. Napauta jokaista sanaa, joka ei
sovi. Sinun ei tarvitse tietää, mikä sana siinä kuuluisi olla.* Button [Olen
valmis].

**Lisä — Sanojen muodostaminen tavuista** (`/exercise/syllables`). Syllables
of a word flash one at a time (1.5 s each, very large) then disappear; the
user types the whole word; brief right/wrong line; 12 words. Ends on the
supplementary end screen.

**Lisä — Sanojen pituuden erottaminen** (`/exercise/minimal-pairs`). A
sentence with a blank (`Talon ____ vuotaa pahasti.`), two large option
buttons (`katto` / `kato`), 6 s per item shown as a draining hairline, 15
items. Ends on the supplementary end screen.

**Supplementary end screen**: `HARJOITUS VALMIS`, title, a card with `OIKEIN
11 / 15` and a level chip, one line *Lisäharjoitukset eivät vaikuta seulonnan
raporttiin…*, button [Takaisin harjoituksiin].

### 5.5 Results `/results`

A printable, dossier-style report — the emotional centre of the product. It
must read calmly whether the news is good or not. Currently:

```
LukiSeula                                   RAPORTTI · 13.9.2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEULONNAN TULOKSET
Lukutaidon
koonti.

│ OSA-ALUEITA TEHTY │ KESTO   │ RAPORTIN TYYPPI │
│ 5 / 5             │ 14 min  │ Suuntaa antava  │

┌ YHTEENVETO ─────────────────────────────────────────────┐
│ Tulokset viittaavat pääosin sujuvaan lukutaitoon…       │   ← 1 of 4 summary sentences
│ (one softer interpretation paragraph)                   │
└─────────────────────────────────────────────────────────┘

┌ TUEN TARPEEN SELVITTELY ──────────────── (conditional) ─┐   ← shown only when ≥2 NMI areas = selvia
│ Tuen tarpeen selvittely on vähintään suositeltavaa…     │
└─────────────────────────────────────────────────────────┘

┌ MISSÄ SUJUI HYVIN ────┐ ┌ MISSÄ OLI HAASTEITA ──┐
│ • Sanantunnistus      │ │ • Sanarajojen hahm.   │
└───────────────────────┘ └───────────────────────┘

TARKEMMAT TULOKSET                                 5 KOHTAA
01  OSA 1 · TODELLISTEN JA EPÄSANOJEN EROTTAMINEN
    Sanantunnistus                    [● SUJUU HYVIN]
    ▮▮▮▮▮▮▮▮▮▮▮▮                                       ← 12-segment bar, filled by level
    Todellisten sanojen ja epäsanojen erottaminen onnistui sujuvasti.
02  …  (five rows, alternating background bands)

MENETELMÄ — MITÄ OSA-ALUEET MITTAAVAT   (3 short definitions)
HUOMIO   (disclaimer block)
MITÄ VOIT TEHDÄ SEURAAVAKSI   (3 numbered actions)
TUKISIVUJA JA LISÄTIETOA   (5 stacked link bands)
[ Tallenna PDF ]  [ Takaisin etusivulle ]
```

Levels per area: **Sujuu hyvin / Jonkin verran haasteita / Selviä haasteita /
Harjoitusta ei tehty**. The report deliberately does **not** show scores as
numbers or reveal which items were missed — keep it that way (retest
contamination). The summary sentences and interpretations are fixed copy. Must
print cleanly to A4 in black-and-white-ish (the chips carry text).

### 5.6 Exercises list `/exercises`

Badge `YKSITTÄISET HARJOITUKSET`, H1 **Harjoitukset**, a stacked list of 7
rows (icon, `OSA n` / `LISÄHARJOITUS` label, title, one-line description,
arrow), then [Aloita koko seulonta] [Katso tulokset]. Secondary page; low
priority.

### 5.7 404

`VIRHE 404` / **Sivua ei löytynyt** / *Osoite on ehkä kirjoitettu väärin, tai
sivu on siirretty.* / [Etusivulle].

---

## 6. Shared components to design

- Nav bar (marks + optional right slot: timer, `HARJOITTELU` badge, "Etusivulle")
- Step header: small-caps label · counter · progress line (single and double)
- Instruction card (numbered / icon variants)
- Buttons: primary (gold), secondary (brown), tertiary (text), keycap hint
- Toggle word/letter/chip (idle · hover · marked); grid word toggle
- Timer readout + "low time" state
- Level chip (4 variants) and 12-segment level bar
- Dossier row; summary block; conditional alert block (support-need)
- Resource link row/card (external)
- Footer

---

## 7. Non-negotiables

1. All Finnish copy above stays as written unless a change is proposed
   explicitly; button names quoted in instructions must match the buttons.
2. Disclaimers: on Home above the fold, on Consent (with the checkbox), on
   Results (the "Huomio" block). "Ei diagnoosi" is never softened away.
3. The 15+ audience is visible on Home without scrolling.
4. No numbers, percentages, or missed-item reveals on the results page.
5. Timers and item counts are fixed (they follow the NMI norms): Osa 2 = 3 min,
   Osa 3 = 1.5 min / 15 sentences, Osa 4 = 3.5 min / 100 words, Osa 5 = 4 min,
   Osa 1 = 3 s per word.
6. Zero third-party requests: fonts and icons must be self-hostable (Google
   Fonts is fine to download; icon set is Lucide).
7. WCAG AA contrast on every text element, including decorative-looking ones.
8. Works at 390 px wide with a 16 px side gutter; no horizontal scrolling.

---

## 8. What we would love to see improved

In priority order:

1. **Exercise template** — calmer timer, clearer hierarchy between
   instruction and task, room to breathe on phones; the Osa 3 letter-tapping
   interaction in particular.
2. **Results** — same dossier spirit, but more legible at a glance: the
   five-row detail section, the strengths/challenges split, and a print
   layout that survives black-and-white.
3. **Home** — shorter, more confident, less disclaimer-heavy hero while still
   meeting the non-negotiables; the bento can become five equal cards if that
   reads better.
4. **Ready screens and Consent** — hierarchy instead of equal-weight cards.
5. **Motion** — a light, consistent transition language between exercises
   (fade/slide ≤ 200 ms, disabled under reduced-motion).

Out of scope: changing what the exercises measure, adding accounts, dark mode
(nice-to-have later), illustrations of people.

---

## 9. Implementation notes for the handoff back

The app is React + Tailwind (no component library). Please deliver tokens as
a small table (colour, type scale, spacing, radii, shadow) and one artboard
per screen in §5 at 390 px and 1440 px. Component states (idle / hover /
focus / pressed / disabled / marked) matter more than page count.
