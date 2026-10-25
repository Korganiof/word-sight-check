# LukiSeula — UI refresh, implementation handoff

This document, the token files and the static screen renders in this folder are the complete spec for restyling the LukiSeula React + Tailwind app. It assumes the brief in `DESIGN_BRIEF.md` (the repo's own design brief) and never changes what the exercises measure, their timers, item counts or the Finnish copy, except where section 11 lists text to verify.

**v2 (October 2026).** Redraws Consent and all five ready screens, fixes three layout bugs (Osa 1 and Osa 3 centring, the Osa 2 target list) and specifies the screens v1 left out. `CHANGES.md` lists every changed file; §6.7 holds the layout rules behind the changes.

How the folder fits together:

| Path | What it is | Use it for |
|---|---|---|
| `tokens/tokens.css` | CSS custom properties + base rules | The single source of colour, type, radius, shadow and motion values |
| `tokens/tailwind.config.tokens.js` | Tailwind v3 `theme.extend` | Drop into `tailwind.config.js` |
| `tokens/tailwind.theme.css` | Tailwind v4 `@theme` block | Import after `tailwindcss` if the app is on v4 |
| `screens/static/*.html` | Each screen as plain HTML with every value inline | The reference markup to translate into components. Open in a browser to inspect |
| `screens/source/*.dc.html` | The same screens as interactive design-canvas components | Only for behaviour details (marking, auto-advance, warm-up gating) — the template syntax is not meant to be ported |
| `screenshots/*.png` | 1× renders of every screen | Compare the running app against these at 1440 and 390 px |
| `screenshots/1440x716/*.png` | Consent and the five ready screens at 1440 × 716 | The window they must fit without scrolling |
| `CHANGES.md` | What changed since v1 | The work list when the app already has v1 |

Screen files are named `<Screen>-<width>`: `Osa3-1440.html` is the Osa 3 exercise at 1440 × 900, `Osa3-390.html` the same at 390 × 844. `Main` is Home at 1440; `Home-390` is Home at 390. Routes are mapped in section 8.

## 1. The direction in one paragraph

Keep the warm, quiet "Elevated Curator" identity, but make the product read as an instrument rather than a page: one persistent app shell (white app bar with a battery rail for Osa 1–5 and a calm timer pill, a 4 px segmented time line, a docked action bar at the bottom), one white work sheet per exercise, and one mark language everywhere the user acts — a pale gold highlighter wash with a 3 px pen line under it. Gold is reserved for the primary call to action and for what the user has marked; inside an exercise nothing else is gold. The paper is a less pink off-white, 1 px hairlines are allowed where an edge helps, shadows stay below 8 %.

## 2. Non-negotiables carried from the brief

All Finnish copy stays as written (see section 11 for the lines I had to reconstruct). The "ei diagnoosi" disclaimer stays above the fold on Home, on Consent with the checkbox, and on Results as the "Huomio" block. The 15+ audience is visible on Home without scrolling. No numbers, percentages or missed items on Results. Timers and item counts follow the NMI norms exactly (Osa 1 = 3 s per word, Osa 2 = 3 min, Osa 3 = 1.5 min / 15 sentences, Osa 4 = 3.5 min / 100 words, Osa 5 = 4 min). Zero third-party requests: fonts are self-hosted (section 4), icons are Lucide. Every text colour pair below is ≥ 4.5:1. Everything works at 390 px wide with a 16 px gutter and no horizontal scroll. Tap targets are ≥ 44 px in every exercise.

## 3. Colour

Values live in `tokens/tokens.css`. Measured WCAG ratios are given so nothing needs re-checking as long as these pairs are used.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| paper | `#FAF6F0` | App canvas, iOS overscroll | ink 15.8 · ink-2 7.1 |
| surface | `#FFFFFF` | Work sheets, app bar, docked bar, cards | ink 17.1 · ink-2 7.6 |
| recessed | `#F5EEE4` | Soft keys, letter tape, inset panels, link-row hover | ink 14.8 · ink-2 6.6 |
| well | `#ECE2D4` | Soft-key hover, note blocks, disabled button fill | ink 13.3 · ink-2 5.9 |
| line | `#E5D9C9` | 1 px hairlines, empty segments — never text | decorative |
| line-strong | `#CDBBA4` | Keycap edge — never text | decorative |
| control | `#A08A72` | Unchecked checkbox border | 3.3 on white (non-text) |
| ink | `#241A11` | All body and heading text | — |
| ink-2 | `#64503F` | Captions, counters, hints | on paper 7.1 · on well 5.9 |
| brown | `#4A3728` | Secondary button, dark band, low-time pill | white on it 11.2 |
| brown-deep | `#2F241B` | Brown hover, focus ring, last time segment | — |
| time | `#8C7660` | Remaining-time segments only | decorative |
| gold | `#C69A2B` | Primary CTA fill (dark ink text), item progress, current rail step | ink on it 6.5 — white on it is 2.6 and must not be used |
| gold-hover / gold-press | `#B68B1F` / `#AC841B` | Primary hover / pressed | ink on them 5.4 / 4.9 |
| gold-ink | `#785A00` | Section labels, tertiary buttons, the mark underline | on paper 6.0 · on gold-wash 4.7 |
| gold-ink-deep | `#5C4500` | Tertiary hover text, counter icon | — |
| gold-wash | `#F2DA93` | Highlighter fill behind marked words and letters | ink on it 12.4 |
| gold-tint | `#FAF0D2` | Hover before marking, badges, icon tiles | gold-ink on it 5.7 |
| good / good-bg | `#35612A` / `#E3EDD8` | Sujuu hyvin | 6.0 |
| some / some-bg | `#6E5200` / `#F8EBC4` | Jonkin verran haasteita | 6.2 |
| clear / clear-bg | `#8A3B22` / `#F6E2D9` | Selviä haasteita | 6.2 |
| none / none-bg | `#64503F` / `#EFE8DD` | Harjoitusta ei tehty | 6.2 |

Replaced from the current app: `#d2c5b0` is gone entirely, the timer red `#ef4444` is gone (section 6.4), and the four old level chips (which measured 4.1, 2.1, 4.4 and 5.1) are replaced by the pairs above.

## 4. Type and fonts

Three families. Manrope stays the brand voice for headings, labels, buttons and numbers. Everything the user has to read or judge letter by letter is set in Atkinson Hyperlegible Next, whose I / l / 1 and a / o / e are distinct shapes. The letter tape in Osa 3 uses Atkinson Hyperlegible Mono so every cell has the same advance width. Numbers stay in Manrope with `font-variant-numeric: tabular-nums` (Atkinson's zero is slashed, which looks odd in a timer).

Self-host all three with Fontsource (SIL Open Font License, no network requests):

```bash
npm install @fontsource/manrope @fontsource/atkinson-hyperlegible-next @fontsource/atkinson-hyperlegible-mono
```

```js
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/atkinson-hyperlegible-next/400.css';
import '@fontsource/atkinson-hyperlegible-next/500.css';
import '@fontsource/atkinson-hyperlegible-next/600.css';
import '@fontsource/atkinson-hyperlegible-next/700.css';
import '@fontsource/atkinson-hyperlegible-mono/600.css';
import '@fontsource/atkinson-hyperlegible-mono/700.css';
```

The `latin` subset covers ä and ö. The static HTML files link Google Fonts purely so they can be viewed from disk; the app never does.

| Style | Face | 1440 | 390 | Notes |
|---|---|---|---|---|
| display | Manrope 800 | 84 / 84, −0.04em | 50 / 52 | Home H1 only; "seulonta" sits on a gold-wash box |
| title | Manrope 800 | 64 / 68, −0.035em | 40 / 44 | Results title only |
| h1 | Manrope 800 | 48 / 54, −0.03em | 32 / 38 | Consent, ready screens, exercises list, 404; exercise titles use 32 / 38 (1440) and 24 / 30 (390) |
| h2 | Manrope 800 | 32 / 38, −0.025em | 24 / 30 | Section titles (Results sections use 24 / 30 on desktop) |
| h3 | Manrope 800 | 22 / 28, −0.02em | 19 / 25 | Row titles, card titles (Results detail rows use 24 / 30) |
| lead | Atkinson Next 400 | 19 / 32 | 17 / 28 | Hero lede, Consent lede |
| body | Atkinson Next 400 | 17 / 28 | 17 / 28 | Never below 16 px anywhere |
| reading | Atkinson Next 400 | 20 / 40 | 19 / 40 | Tappable prose in Osa 2 and Osa 5 |
| caption | Atkinson Next 400 | 15 / 22 | 15 / 22 | Always ink-2, never lighter |
| label | Manrope 800 | 12 / 16, +0.12em, uppercase | same | Two words at most; colour gold-ink |
| button | Manrope 700 | 17 | 16–18 | Hero CTA 18–19 |
| numeric | Manrope 800, tabular | 26 counter · 18 timer | 24 · 17 | |
| tape | Atkinson Mono 600 | 48 in a 34 px cell | 36 in a 25 px cell | Cell width is the only tunable |

Body text is left-aligned, never justified, measure ≤ 70 characters (paragraph `max-width` 520–680 px). Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs. No italics and no all-caps longer than a two-word label.

## 5. Shape, depth, motion

Radii: 6 (ink behind a word) · 8–9 (chips) · 10 (keycap) · 12 (grid cells, small buttons) · 14 (buttons) · 16–18 (icon tiles, hero CTA, answer keys, tape ends) · 20–22 (sheets on 390) · 24–28 (sheets on 1440) · 32 (dark banner) · pill.

Shadows are always `#2F241B` and never above 8 %: `shadow-sheet` on sheets and cards, `shadow-float` on the two hero previews, `shadow-up` on the docked bar. Hairlines are `1px solid line`. Depth otherwise comes from background shifts: paper → surface → recessed → well.

Motion: 120 ms for hover, press and a mark appearing (colour and box-shadow only, never size); 180 ms fade-in with an 8 px rise when a screen enters; 120 ms fade-out, no movement, when it leaves; easing `cubic-bezier(0.2, 0, 0, 1)`. Under `prefers-reduced-motion: reduce` everything is 0 ms. Nothing animates inside a work sheet while the user reads; the time line changes once per 30 seconds rather than draining continuously.

## 6. App shell

Every exercise and ready screen sits in the same frame. See `Osa4-1440.html` and `Osa4-390.html` for the cleanest example.

### 6.1 App bar

64 px tall on desktop (padding 0 32), 56 px on phones (padding 0 16). White, `border-bottom: 1px solid line`. Desktop is a `grid-template-columns: 1fr auto 1fr`: logo left, battery rail centred, right slot. On phones the rail sits next to the logo mark (wordmark hidden) and the right slot shrinks.

Logo: 32 px rounded-square mark (gold-tint field, white lens with a gold ring and handle, three brown text "pills" inside the lens — the favicon motif) + "LukiSeula" in Manrope 800 19 px, −0.02em. 30 / 18 on phones. Outside the battery (Consent, the Osa 1 ready screen, Results) the logo links to `/`; inside the battery it is not a link (there is no back navigation).

### 6.2 Battery rail

`OSA 3 / 5` in Manrope 800 13 px (+0.1em, uppercase, gold-ink, tabular) followed by five segments 34 × 6, gap 4, radius 3: completed steps brown, the current step gold, upcoming steps line. On phones the label is 12 px above segments of 18 × 4. Ready screens show the rail for the part that is about to start.

### 6.3 Right slot

Timed exercises show the timer pill (6.4). Osa 1 shows the item pill: "Tehtävä" in Manrope 600 13 + `12 / 30` in Manrope 800 16, recessed background, 40 px tall, radius pill. Ready screens outside the battery (Osa 1) and Consent show a tertiary "← Etusivulle" link, 40 px tall. During Osa 1 practice the badge `HARJOITTELU` (28 px pill, gold-tint, label style) goes here.

### 6.4 Timer pill and time line

Pill: 40 px tall (36 on phones), padding 0 16 0 14, radius pill, recessed background, ink text; Lucide `timer` icon 18 px, "Aikaa jäljellä" in Manrope 600 13 (hidden on phones), then `m:ss` in Manrope 800 18 (17), tabular. `role="timer"`, `aria-label="Aikaa jäljellä"`.

Time line: a 4 px strip directly under the app bar, full width, segments with 4 px gaps, one segment per 30 seconds (Osa 2 = 6, Osa 3 = 3, Osa 4 = 7, Osa 5 = 8). Remaining segments are `time`, spent segments are `line`; a segment flips when its 30 seconds are gone. For Osa 1 the strip has 30 segments, one per item: done items gold, the current one brown, the rest line.

Low-time state (last 30 s, replaces the old red): the pill turns brown with white text and the single remaining segment turns brown-deep. No colour red, no blink, no pulse, no size change. Both states are in `Components.html` and can be toggled on any exercise board in the source files with the `lowTime` tweak.

### 6.5 Work area and docked bar

Between the bars sits one scrollable `main`. Desktop content columns: 960 px (Osa 3, Osa 4), 840 px (Osa 2: one column, the sticky target panel above the sheet), 1080 px (Osa 5, as a 340 px aside + the sheet, gap 48), 760 px (Osa 1). Consent and the ready screens use 1040 px. The docked bar's inner row always takes the width of the screen's content column, so its button lines up with the content's right edge. The exercise title (Manrope 800 32 / 38) and the one-paragraph instruction (17 / 28, max-width 540) sit above or beside the sheet, never inside it. Phones use a single column with 16 px gutters, title 24 / 30, instruction 16 / 26.

Docked bar: 84 px tall on desktop, min 76 px on phones; white, `border-top: 1px solid line`, `shadow-up`. Left: the live counter (6.6). Right: the finish-early button — always the brown secondary ("Olen valmis" / "Valmis", 56 × 220 on desktop, 52 px on phones) so that gold inside an exercise only ever means "marked by you". Osa 3 shows the tertiary "Seuraava →" and the Enter keycap hint instead; Osa 1 puts the two answer keys here on phones. On Consent and the ready screens the bar carries the step's primary action instead: the part's facts or a gate hint on the left, the gold primary on the right (§6.7).

### 6.6 Counter

A 40 px circle in gold-wash with the pen line (`inset 0 -3px 0 gold-ink`) and the Lucide `highlighter` icon in gold-ink-deep, then the number in Manrope 800 26 (24 on phones, tabular) and the unit in Atkinson 16 ink-2: `12 merkittyä`, `3 valittua`, `2 / 4 sanarajaa merkitty`. Wrap it in `aria-live="polite"`.

### 6.7 Layout rules (v2)

These rules come out of the v1 ready screens, where the start button ended up alone at the top of an empty column and the instructions fell below the fold on a 1440 × 716 window. Check every new or changed screen against them.

1. **One main action, in the docked bar.** A step's primary button (Aloita harjoitus, Jatka tehtävään, Olen valmis, Valmis) lives in the docked bar, right-aligned to the content column. It is never placed alone in a column beside or above the content.
2. **Terminal screens put the button under the content.** Screens with no bar (404, the supplementary end screen) place their one button directly below the last line of content.
3. **Ready screens and Consent fit 1440 × 716.** That window leaves 568 px between the 64 px app bar and the 84 px docked bar. Every ready screen fits without scrolling. On Consent the checkbox sits above the fold, and only the advisory notes need a scroll. If longer app copy makes a screen taller, tighten the spacing (main padding, step gap) first. Never move the button out of the bar.
4. **Centre inside a scroller with `margin: auto 0`.** To centre a block vertically in a scrolling `main`, give the block `margin-block: auto` and leave the parent at `flex-direction: column`. Never put `justify-content: center` on the scrolling parent: once the content is taller than the parent, its top is cut off and cannot be scrolled to. v1 had this bug on Osa 1 and Osa 3.
5. **No orphaned columns.** Use two columns only when both have content at the top; otherwise use one column. A title that belongs to the whole screen spans both columns, and both columns start on the same line under it.
6. **No label that repeats the title.** The app bar already shows `OSA n / 5`, so screens don't repeat it as a label above the title.
7. **Gate hints sit with the gated button.** While a primary button is disabled, the reason sits in the same bar: on the left on desktop, above the button row on phones. It disappears when the gate opens.
8. **Don't let a title squeeze.** A title that shares a row with other text gets `flex-shrink: 0` when it has to stay on one line. Font builds differ by a few pixels, and v1's Osa 3 title sat 4 px from wrapping.

## 7. Components and states

`Components.html` draws every state side by side; the class names below are the ones used in the static HTML, so a search for `ls-word` finds every word toggle, and so on.

### 7.1 Buttons (`ls-gold`, `ls-brown`, `ls-ghost`, `ls-key`)

| Kind | Idle | Hover | Pressed | Disabled | Focus |
|---|---|---|---|---|---|
| Primary | gold fill, **ink** text | gold-hover | gold-press | well fill, ink-2 text, `cursor: not-allowed` | 3 px brown-deep ring, 2 px offset |
| Secondary | brown fill, white text | brown-deep | `#1F1711` | well / ink-2 | same |
| Answer key (Osa 1) | white, 2 px brown border, ink text | recessed fill | brown fill, white text | — | same |
| Tertiary | no fill, gold-ink text | gold-tint fill | gold-wash fill | well / ink-2 | same |

Geometry: 56 px tall, padding 0 28, radius 14, Manrope 700 17, icon 20 px with a 10 px gap; hero CTA 60 px / radius 16 / 18 px type; small nav button 44 px / radius 12 / 15 px type; full-width 52–56 px on phones. The answer keys are 92 px tall on desktop (Manrope 800 22, radius 18) and 64 px on phones (18 px type, keycaps hidden). Both answers use the same neutral style so neither reads as the recommended one. On dark surfaces (the brown banner) the focus ring is gold-wash.

### 7.2 Keycap

`<kbd>`: min-width 40, height 40, padding 0 10, white, `1px solid line-strong` with a 3 px bottom edge, radius 10, Atkinson Mono 700 17. Smaller variant 34 / 13 for the Enter hint. Shown on desktop only.

### 7.3 Word toggle in running text (`ls-word` + `ls-ink`) — Osa 2, Osa 5, warm-up

Each word is a real `<button aria-pressed>` so Tab reaches it; trailing punctuation stays outside the button in a `white-space: nowrap` wrapper with `margin-right: 0.34em` as the word gap. The button is the hit area (padding 3 px 0 → 36 px on desktop; 7 px 0 → 44 px on phones, where buttons carry `margin: -2px 0` so 44 px rows fit a 40 px line pitch). Inside it a `<span class="ls-ink">` with `margin: 0 -3px; padding: 0 3px; border-radius: 6px` carries the mark. States: idle transparent; hover gold-tint on the ink span; marked gold-wash + `inset 0 -3px 0 gold-ink`; focus ring on the ink span. The mark never changes font weight or size, so text never reflows.

### 7.4 Grid word (`ls-soft`) — Osa 4

`<button aria-pressed>` 52 px tall, radius 12, recessed fill, Atkinson 500 19 (17 on phones), `letter-spacing: 0.01em`. Hover well; pressed line; marked gold-wash + the pen line. Four columns in groups of 20 with 24 px between groups on desktop; two columns in groups of 10 with 18 px between groups on phones. Cell gap 8.

### 7.5 Letter tape (`ls-cell` + `ls-bar`) — Osa 3

The sentence is one row of fixed-width `<button aria-pressed>` cells: width 34 px (tunable 28–44) × 104 px tall on desktop, 25 px (22–32) × 88 px on phones; Atkinson Mono 600 at 48 / 36 px; recessed fill; first and last cell rounded 16 px on the outer side. A boundary is a 4 px × (height − 2 × 14 px) bar in gold-ink, `position: absolute; right: -2px; border-radius: 2px`, drawn over the seam to the next cell (`z-index: 2` on a marked cell). Marked cell: gold-wash fill + bar at opacity 1. Hover: well fill + bar at 35 % opacity as a preview. The last letter of the sentence is not tappable. Tapping a marked letter removes the boundary. When the number of marked boundaries equals the sentence's word count minus one, advance after 500 ms; "Seuraava →" (tertiary) and Enter skip. Above the tape: `Lause 3 / 15` (Manrope 700 15 ink-2) and a 15-segment rail (22 × 6 on desktop, 10 × 6 on phones): done gold, current brown, upcoming line.

On phones a sentence longer than 13 letters wraps into ⌈n / 13⌉ rows of equal length; the first row ends with a 17 px `corner-down-left` glyph in ink-2; rows are left-aligned inside a centred block so the letters never look spaced out. Cells never move when a mark is placed.

### 7.6 Level chip and level bar — Results, Home preview, supplementary end screen

Chip: 32 px tall (30 / 28 in dense places), padding 0 12 0 9, radius pill, `level-bg` fill, `level` text in Manrope 700 14, with a 16 px glyph that carries the level without colour: check in a circle (Sujuu hyvin), half-filled circle (Jonkin verran haasteita), filled dot (Selviä haasteita), dashed circle (Harjoitusta ei tehty).

Bar: three segments 34 × 8, gap 4, radius 4, filled 3 / 2 / 1 / 0 in the level colour, empty segments `line`. Three steps replace the old twelve on purpose: a 12-segment bar filled to 4 reads as a score. In print both are outlined in `#111` (section 9).

### 7.7 Pills, badges, tiles, cards

Fact pill (ready-screen docked bar): 36 px, padding 0 14 0 12, radius pill, recessed, Manrope 700 15 tabular ink with a 16 px icon (`timer`, `list`); render the pills as a `<ul aria-label="Tehtävän tiedot">`. Target chip (Osa 2): 32 px (28 on phones), padding 0 11, radius 9, recessed, Manrope 800 13 / 12 uppercase +0.05em ink. Badge (`SEULONTATYÖKALU · YLI 15-VUOTIAILLE`, `HARJOITTELU`): 28 px pill, gold-tint, label style. Icon tile: 48 px (44 / 40 / 36 variants), radius 14–16, gold-tint with a 22 px gold-ink Lucide icon; the muted variant is well with a brown icon. Sheet: white, 1 px line, radius 24–28 (20–22 on phones), `shadow-sheet`. Note block (Huomio): well fill, radius 28, padding 32, label in brown with the `info` icon. Support-need block: white, `2px solid brown`, radius 28, a 44 px brown tile with the `signpost` icon. Resource link row: full-row `<a target="_blank" rel="noopener">`, padding 20 28, title Manrope 800 18 / 26, description 16 / 26 ink-2, `arrow-up-right` 22 px in gold-ink at the right; hover recessed; rows separated by hairlines inside one sheet. Numbered step: 40 px circle (gold-tint with a gold-ink Manrope 800 17 number on Results; white with a 1 px line border on Ready screens) and text starting 5 px below its top. Checkbox: 26 × 26, `accent-color: brown`, 2 px control border when unchecked, 14 px gap to its label.

### 7.8 Icons

Lucide, stroke 2 (2.2 for 18–20 px icons), `aria-hidden="true"` unless the icon is the only content of a control, in which case the control gets an `aria-label`. Used: arrow-right, arrow-left, arrow-up-right, check, timer, clock, info, circle-check, lock, eye-off, user-check, gift, bot, stethoscope, whole-word, text-search, separator-vertical, spell-check, book-open, highlighter, download, signpost, corner-down-left; v2 adds list, chevron-right, corner-down-right, puzzle and ruler. Never emoji.

## 8. Screens

| Route | Static reference | Notes |
|---|---|---|
| `/` | `Main.html`, `Home-390.html` | §8.1 |
| `/consent` | `Consent-1440.html`, `Consent-390.html` | §8.2 |
| `/start` (ready screen for Osa 1) | `Ready-Osa1-1440.html`, `Ready-Osa1-390.html` | §8.3 |
| `/task/pseudowords` | `Osa1-*.html` | §8.4 |
| `/task/word-search`, ready state | `Ready-Osa2-*.html` | §8.3 |
| `/task/word-search` | `Osa2-*.html` | §8.5 |
| `/exercise/word-chains`, ready state | `Ready-Osa3-*.html` | §8.3 |
| `/exercise/word-chains` | `Osa3-*.html` | §8.6 |
| `/exercise/spelling-errors`, ready state | `Ready-Osa4-*.html` | §8.3 |
| `/exercise/spelling-errors` | `Osa4-*.html` | §8.7 |
| `/exercise/reading-comp` ready screen | `Ready-Osa5-*.html` | §8.3 (with the warm-up) |
| `/exercise/reading-comp` | `Osa5-*.html` | §8.8 |
| `/results` | `Results-1440.html`, `Results-390.html` | §8.9 |
| `/results` print stylesheet | `Report-A4-1..3.html` | §9 |
| `/exercises` | `Exercises-1440.html`, `Exercises-390.html` | §8.10 |
| `/exercise/syllables` | `Extra-Syllables-*.html` | §8.11 |
| `/exercise/minimal-pairs` | `Extra-Pairs-*.html` | §8.12 |
| supplementary end screen | `Extra-End-*.html` | §8.13 |
| 404 (any unknown route) | `NotFound-1440.html`, `NotFound-390.html` | §8.14 |

All five ready screens are drawn and share one layout (§8.3). `screenshots/1440x716/` shows them and Consent at the window size they must fit.

### 8.1 Home

Desktop content column 1200 px. A plain 76 px nav (not frosted): logo, three text links (the current one underlined with a 2 px gold line), and a 44 px primary "Aloita seulonta". Hero: badge, the display H1 with "seulonta" on a gold-wash box (`inset 0 -6px 0 gold-ink`, radius 17), lede 19 / 32 at max 520 px, a 60 px primary CTA with arrow + tertiary "Lue lisää", then the one-line disclaimer (15 / 24 with an `info` icon in gold-ink). The right 580 × 356 area holds two overlapping product previews — a window of Osa 3 (520 px wide) and a snippet of Osa 5 (340 px) — both built from the real components with non-test sentences, `role="img"` with an `aria-label`. Below the hero a full-width white facts strip: four cells divided by hairlines, each a 48 px gold-tint tile + Manrope 800 20 (10–15 min · Yli 15-vuotiaille · Anonyymi · Ilmainen). Sections are 128 px apart: "Mitä on lukihäiriö?" (5 / 7 grid, two paragraphs 19 / 32), "Mitä seulonta mittaa?" as five rows in one sheet (56 px tile, `Osa n` caption, Manrope 800 22 title, 17 / 28 description), the brown banner (radius 32, padding 72, 44 / 50 heading in white, text `#F3E9DC`, gold CTA, a 400 px white mini report card with three level chips), then Tietosuoja (5 cols) beside "Lisätietoa ja tukea" (7 cols, four link rows), the credit block (well, radius 28: Huomio disclaimer left, Panula credit and the hobby-project line right in ink-2), and a footer with a hairline, logo, "Tietosuoja" link and "© 2026 LukiSeula · Harrasteprojekti".

Phone: nav 64 px with a 44 px CTA; hero in one column with the CTA full width, the disclaimer, a 2 × 2 grid of fact cards (44 px rows, white, hairline border), "Lue lisää" centred; the two previews stacked; sections 72 px apart with the five parts as a single sheet; banner padding 32 22 with the mini report inside; privacy and links stacked; credit; footer.

### 8.2 Consent

Desktop: one 1040 px column, centred in `main` with `margin: auto 0`. Title 48 / 54, lede 19 / 32 at max 720. Then the hierarchy the brief asked for. First, "Ehdot, jotka hyväksyt" (small gold-ink heading, Manrope 800 15) over the three terms that the checkbox asserts: EI diagnoosi, harrasteprojekti, anonyymi. They sit as three cards in a row (gap 16; padding 20 22 22, radius 20), each with a 40 px gold-tint tile beside a Manrope 800 18 / 24 title and 17 / 28 text. 16 px under the cards comes the checkbox sheet (padding 20 24): the 26 px checkbox and the full statement, with the bold words as in the brief. Then, 36 px lower, "Hyvä tietää" in ink-2, with the two advisory notes side by side (40 px well tiles with brown icons, 17 px title, 16 / 26 ink-2 text). The docked bar carries the action. On the right: the tertiary "Peruuta" and the primary "Jatka tehtävään →", which stays disabled until the box is checked. On the left, while the box is unchecked: the `info` hint "Hyväksy ensin ehdot, niin voit jatkaa." At 1440 × 716 the three terms and the checkbox are above the fold; only the notes need a scroll. Phone: the same order in one column. The terms are one sheet with hairline rows, then the checkbox sheet, then the notes. The hint sits above Peruuta and the gated CTA in the docked bar.

### 8.3 Ready screens

One layout for all five parts. Desktop column 1040 px, centred vertically in `main` with `margin: auto 0` (main still scrolls if it ever has to).

- **Title block.** Title (Manrope 800 48 / 54, one line) and subtitle (19 / 30 ink-2, 8 px below) span the full width. There is no `OSA n / 5` label; the app bar already shows it.
- **Steps.** 24 px under the title block sits a grid: 580 px of steps and a 420 px example card, gap 40, both top-aligned. There are 2–4 numbered steps. Each has a 30 px gold-tint circle with a gold-ink Manrope 800 15 number; a 2 px `line`-coloured connector joins the circles. Headings are Manrope 800 19 / 26, with the 17 / 28 text 4 px below and 20 px between steps.
- **Example card.** White, padding 24, radius 24, label `ESIMERKKI`. It is a `role="img"` picture with a Finnish `aria-label`, not a control. What it shows per part:
  - **Osa 1:** a recessed stage with "Onko tämä oikea sana?", "talo" at 44 / 52 and a draining hairline, then the two answer keys with A / L keycaps. Step 2 shows the two keycaps inline (A = Oikea sana, L = Ei sana).
  - **Osa 2:** two target chips (SATAMAAN, LOKIT), a hairline, and a 19 / 36 sentence with "satamaan" marked.
  - **Osa 3:** the letter tape "kissaistuumatolla" (21 × 60 cells, Mono 600 30) with boundaries after "kissa" and "istuu", then `corner-down-right` + "kissa istuu matolla".
  - **Osa 4:** a 2 × 2 grid of word cells (kukka, lusika, hiiri, lintu) with "lusika" marked.
  - **Osa 5:** the interactive warm-up in place of the picture, labelled `KOKEILE ENSIN`: the instruction line and the two practice sentences in recessed boxes (radius 16), built from the word toggle. Tapping a fitting word shows the `info` hint in ink-2; tapping the misfit marks it and shows the green `circle-check` line "Juuri näin. …".
- **Docked bar** (84 px, inner row 1040). Left: the part's facts as pills (§7.7), for example `1,5 min` and `15 lausetta`. Right: the primary "Aloita harjoitus →" (56 px). On Osa 5, until both warm-up sentences are solved, the left side shows "Ratkaise ensin molemmat harjoituslauseet, niin voit aloittaa." instead of the pills, and the button is disabled. When a sentence is solved, scroll its feedback line into view with `scrollIntoView({ block: 'nearest' })`; on a 716 px window the second line can land under the bar.
- **Fit.** Every ready screen fits 1440 × 716 without scrolling. Osa 3 and Osa 5 are the tallest, with about 25 px to spare. Keep the app's own step copy, and if it runs longer, tighten the gaps rather than letting the screen scroll.
- **Phone.** One column: title 32 / 38, subtitle 17 / 26, the steps (28 px circles, 18 / 24 headings), then the example card (padding 20; the Osa 3 tape at 18 × 52). The docked bar has a full-width 56 px "Aloita harjoitus →"; on Osa 5 the gate hint sits above the disabled button. Osa 1 keeps "← Etusivulle" in the app bar.

### 8.4 Osa 1 — Sanantunnistus

Shell with the item pill and the 30-segment item strip. Centre: title, a 760 × 340 white stage (radius 28) with "Onko tämä oikea sana?" in Manrope 700 17 ink-2, the word at Atkinson 700 84 / 92, and the 3-second bar (360 × 6, well track, `time` fill draining right to left — it is the only continuously moving element in the product, and it is a thin hairline, not a countdown number). Under the stage the two answer keys side by side, 92 px tall, with keycaps. Phone: the stage fills the main area (word 46 / 54, bar 220 px), the two 64 px answer keys sit in the docked bar without keycaps. v2: `main` is the scroll container, and the 760 px block is centred in it with `margin: auto 0` (padding 16 0 40 keeps the optical lift) rather than `justify-content: center`.

### 8.5 Osa 2 — Sanojen etsiminen tekstistä

Desktop (v2): one 840 px column. At the top, the title (32 / 38) and the instruction (17 / 28). Below them, the target panel is a sticky strip: `position: sticky; top: 0; z-index: 3` inside the scrolling `main`. It is a white card (radius 20, padding 16 20 18) with "TAVOITESANAT" and "Klikkaa ne tekstistä." on one line and the 12 uppercase chips in two rows. The card sits on a paper-coloured band (12 px above, 16 px below, 24 px wider than the column on each side) that hides the text as it scrolls under. The text sheet follows (padding 36 48 40, reading style 20 / 40, paragraphs 18 px apart). The whole column scrolls inside `main` and the targets stay in view, as the ready screen says: "Näet lyhyen tekstin ja sen yläpuolella listan sanoista". The docked bar's inner row is 840: counter `n valittua`, brown "Olen valmis". Phone (unchanged): title and instruction, then the target panel as a sticky white strip at the top of the scroll area (full-bleed, hairlines above and below, chips 28 px). The sheet uses 19 / 40 with 44 px tap rows.

### 8.6 Osa 3 — Sanaketjujen erottaminen

Desktop: title left, instruction right (max 520 px), then a 960 px sheet (radius 28, padding 28 32 8) holding the sentence header and the tape. The whole block is centred vertically in `main` with `margin: auto 0`; `main` scrolls. v2 also gives the title `flex-shrink: 0` so it never wraps beside the instruction. Docked bar: `2 / 4 sanarajaa merkitty`, the Enter keycap with "siirtää seuraavaan lauseeseen.", and "Seuraava →". Two progress indicators: sentences (the 15-segment rail in the sheet) and time (the line under the app bar). Phone: tape cells 25 × 88 wrapped into rows (7.5); the counter shortens to number + unit; "Seuraava →" stays in the docked bar.

### 8.7 Osa 4 — Etsi kirjoitusvirheet

Desktop: title left, instruction right (the word "Valmis" bold because it names the button), then one sheet (radius 28, padding 24) with the 100 words as 4-column groups of 20. Counter `12 merkittyä`; brown "Valmis" 220 px wide. Phone: 2-column groups of 10 in a sheet with 10 px padding; "Valmis" 148 px wide in the docked bar.

### 8.8 Osa 5 — Luetun ymmärtäminen

Same frame as Osa 2 without the target panel; the sheet opens with the label "TEKSTI" and the story title in Manrope 800 28 / 34 (22 / 28 on phones). Counter `n merkittyä`; brown "Olen valmis". The instruction keeps "12 sanaa" bold.

### 8.9 Results

Desktop 1160 px as a 296 px sticky rail (top 24; "RAPORTTI" label, date in Manrope 800 26, a definition list for Osa-alueita tehty / Kesto / Raportin tyyppi between hairlines, the primary "Tallenna PDF" with the `download` icon and the outlined "Takaisin etusivulle") and an 800 px column: label "SEULONNAN TULOKSET" + "Lukutaidon koonti." at 64 / 68 −0.035em; the summary sheet (padding 40; one of the four fixed summary sentences at Manrope 700 28 / 38; the interpretation paragraph 18 / 30 at max 640; a hairline; then "Missä sujui hyvin" as a 200 px column of green-check rows and "Missä oli haasteita" as rows of title + level chip, divided by a vertical hairline); the support-need block (only when ≥ 2 NMI areas are "selviä"); "Tarkemmat tulokset" with "5 kohtaa" at the right and the five rows in one sheet (grid 48 | 1fr | auto, padding 28 32, hairlines between: `01` in ink-2, caption `Osa 1 · Todellisten ja epäsanojen erottaminen`, title 24 / 30, chip + bar right-aligned, the fixed sentence at 17 / 28 spanning under both); the Huomio block; "Mitä voit tehdä seuraavaksi" as three numbered steps at 18 / 30; "Tukisivuja ja lisätietoa" as five link rows; "Menetelmä — mitä osa-alueet mittaavat" as three short definitions (16 / 26 ink-2). Vertical rhythm between blocks: 40 · 24 · 64 · 32 · 64 · 64 · 64. A footer with the hobby-project line and the Panula credit. The level rows in both split columns carry text labels, so colour never carries meaning alone.

Phone: label with the date, title 40 / 44, the meta list as a three-up row, then the same blocks in one column (summary at padding 24; the two split columns stacked; detail rows stacked with chip and bar on one line; steps; links; method) and the two buttons at the end, before the footer.

### 8.10 Exercises list (`/exercises`)

Desktop: a 760 px column, top-aligned (padding 56 0 72), with "← Etusivulle" in the app bar.

- **Head.** "Harjoitukset" at 48 / 54, then the lede "Valitse harjoitus, jonka haluat tehdä." at 19 / 30 ink-2.
- **Groups.** Two groups, 36 and 28 px apart. Each is a small heading (gold-ink "Seulonnan osat", ink-2 "Lisäharjoitukset") over one sheet of link rows with hairlines between.
- **Rows.** Grid `auto 1fr auto`, padding 18 24:
  - a 48 px tile: gold-tint for the five parts, well with a brown icon for the two extras;
  - the caption `Osa n` (14 / 20 ink-2, parts only);
  - the title in Manrope 800 19 / 26;
  - one line of description (16 / 24 ink-2);
  - `chevron-right` in gold-ink.

  Each row is one `<a>` (hover: recessed row background) and opens that part's ready screen or the supplementary exercise.
- **Action.** Under the groups, the primary "Aloita koko seulonta →" goes to Consent.
- **Phone.** The same with 16 px gutters: title 32 / 38, 44 px tiles, rows padding 16 18, the button full width.

### 8.11 Supplementary exercise: syllables (`/exercise/syllables`)

The exercise shell, with three changes:

- "LISÄHARJOITUS" (label style) sits in the centre of the app bar instead of the battery rail.
- The item pill `Tehtävä 4 / 12` sits on the right.
- A 12-segment item strip runs under the bar: done items gold, the current one brown, as in Osa 1.

The logo is not a link. On desktop a 760 px block is centred in `main`: the title at 32 / 38, then a 340 px white stage (radius 28) with three states.

1. **Syllable.** The caption `Tavu 2 / 3` (Manrope 700 16 ink-2), the syllable in Atkinson 700 112 / 120, and a 3-segment rail (done brown, current gold). Syllables advance on their own at the app's existing pace; wrap them in `aria-live="polite"`.
2. **Answer.** A `<label for>` "Kirjoita koko sana", then a 72 px text input: Atkinson 600 34, centred, 2 px brown border, radius 16, `autocomplete="off" autocapitalize="none" spellcheck="false"`. Focus it on entry. It has no placeholder, because the label already says it. Beside it sits the brown "Vastaa" button (72 px); Enter submits too.
3. **Feedback.** The input becomes read-only with a `line-strong` border. Under it appears either `circle-check` + "Oikein." in good-green Manrope 800 18, or `info` + "Sana oli ”aurinko”." in ink. The button beside the input becomes "Seuraava →". If the app moves on by itself after feedback, keep its timing and drop that button.

Phone: the stage fills the main area (syllable 84 / 92, input 64 px / 30). "Vastaa" and "Seuraava →" sit full width in the docked bar.

### 8.12 Supplementary exercise: minimal pairs (`/exercise/minimal-pairs`)

Same shell, with the pill `Tehtävä 5 / 15` and a 15-segment strip. On desktop, the title sits above a 320 px stage. The stage holds:

- the question "Kumpi sana sopii lauseeseen?" (Manrope 700 17 ink-2);
- the sentence in Atkinson 600 40 / 56, with the gap drawn as a 150 px `line-strong` underline (a word space on each side, none before punctuation);
- the 6-second hairline (360 × 6, `time` on `well`), as in Osa 1.

Under the stage, the two answer keys sit side by side: 92 px tall, white, 2 px brown border, radius 18, Atkinson 700 28. Picking a word moves to the next item at once; there is no feedback per item. Phone: the stage fills `main` (sentence 26 / 40, gap 110 px, hairline 220), and the two 64 px keys sit in the docked bar.

### 8.13 Supplementary end screen

No docked bar. A 720 px block is centred in `main`:

- the label "HARJOITUS VALMIS";
- the exercise title at 44 / 50 on one line;
- a sheet (padding 28 32) with the label "OIKEIN" over `11 / 15` in Manrope 800 64 tabular, and the level chip on the right;
- the line "Lisäharjoitukset eivät vaikuta seulonnan raporttiin." (17 / 28 ink-2);
- the primary "← Takaisin harjoituksiin" directly under that line, which goes to `/exercises`.

The logo links home. Phone: one column, title 30 / 36, the number at 52 with the chip under it, the button full width.

### 8.14 404

No docked bar. A 560 px block is centred in `main`:

- the 112 px empty-lens illustration (the logo motif with blank text lines, on a gold-tint field);
- the label "VIRHE 404";
- "Sivua ei löytynyt" at 48 / 54;
- the line "Osoite on ehkä kirjoitettu väärin, tai sivu on siirretty." (19 / 32 ink-2);
- the primary "Etusivulle" right under it.

Phone: a 96 px illustration, title 32 / 38, the button full width.

## 9. Print stylesheet for Results

The three `Report-A4-*.html` files show the target: A4 (794 × 1123 CSS px at 96 dpi), 72 px margins, white paper, all ink `#111111`, Manrope and Atkinson as on screen. A header row (wordmark 18 px + "Raportti · date") over a 2 px rule, a footer with "Suuntaa antava seulonta — ei diagnoosi." and `n / 3` over a 1 px rule. Page 1: title, the meta list as a bordered row, summary, the support block (2 px border, radius 12) and the two split columns. Page 2: the five detail rows separated by 1 px rules, then Huomio in a 1 px bordered box. Page 3: steps, the links in two columns with their URLs printed, and the method notes. Level chips become 1.5 px outlined pills with the glyph; level bars become three outlined segments filled with `#111` for the level count. Hide the app bar, the rail buttons and all shadows; nothing depends on colour. Body text 16 px / 25, captions no smaller than 12 px.

## 10. Accessibility and behaviour checklist

Every control is a real `<button>`, `<a href>` or `<input>` + `<label>`; toggles carry `aria-pressed`; counters are `aria-live="polite"`; the timer is `role="timer"`; icon-only controls have `aria-label`; the two hero previews are `role="img"` with Finnish labels; `<html lang="fi">`. Focus is always visible: 3 px brown-deep outline with 2 px offset (gold-wash on brown). Keyboard: A / L answer in Osa 1, Enter advances in Osa 3, Tab reaches every word and letter. Tap targets ≥ 44 px on phones (word rows 44, grid cells 52, tape cells 88 tall, keys 52–64). Transitions follow section 5 and are disabled under reduced motion. No feedback during battery exercises: right and wrong are never shown in Osa 1–5. Only the warm-up and the two supplementary exercises give feedback. The syllable answer field is a labelled `<input>` (Enter submits), and its feedback line is `aria-live="polite"`. Transitions between exercises are a 180 ms fade; the hand-off itself stays automatic with no pause and no back navigation, as in the brief.

## 11. Copy to verify before shipping

Everything in the brief was carried over verbatim. These lines were not in the brief and were written by the designer, so read them once:

Reconstructed from the brief's summaries: the three Consent card texts and the two advisory-note texts; the Ready-screen step texts for Osa 1 and Osa 5; the two "Mitä on lukihäiriö?" paragraphs; on Results the "jonkin verran" sentences for Osa 2 and Osa 5, the Osa 3 "selviä" sentence and the end of the third Menetelmä definition ("…vastaavat Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan osatehtäviä.").

New labels: "Ehdot, jotka hyväksyt" and "Hyvä tietää" (Consent), "Esimerkki" (Ready Osa 1), "Teksti" (Osa 5 sheet), "Klikkaa ne tekstistä." (Osa 2 target card), the warm-up hint "Tämä sana sopii lauseeseen. Etsi sana, joka tekee lauseesta järjettömän.", the gate line "Ratkaise ensin molemmat harjoituslauseet, niin voit aloittaa.", the Enter hint "siirtää seuraavaan lauseeseen.", the print footer "Suuntaa antava seulonta — ei diagnoosi."

Sample content that is not real test material: the Osa 2 passage opening and its target list, the Osa 1 sample words, and the Home previews ("Kissanukkuusohvalla", "Aamulla Liisa söi aamiaiseksi lautasellisen kenkiä").

Reordered: on Results, "Mitä voit tehdä seuraavaksi" now comes before "Menetelmä". Restore the original order if the methodology should come first.

Added in v2, written by the designer. Wherever the app already has its own string for one of these, keep the app's:

- **Ready screens:** the subtitles for Osa 2 ("Lukunopeus ja hahmottaminen") and Osa 4 ("Virheellisten sanojen löytäminen sanalistasta"); Osa 4 step 1 ("Näet listan sanoja. Osassa sanoista on kirjoitusvirhe."); the facts pills (3 s per sana · 30 sanaa, 3 min · 12 sanaa, 1,5 min · 15 lausetta, 3,5 min · 100 sanaa, 4 min · 12 vaihdettua sanaa); the example contents for Osa 2 and Osa 4.
- **Consent:** the gate hint "Hyväksy ensin ehdot, niin voit jatkaa."
- **Exercises list:** the lede, the two group headings and the seven row descriptions.
- **Supplementary exercises:** "Tavu n / 3", "Kirjoita koko sana", "Vastaa", "Seuraava", "Oikein.", "Sana oli ”…”.", "Kumpi sana sopii lauseeseen?", "Harjoitus valmis", "Oikein" and "Takaisin harjoituksiin".
- **End screen:** the line "Lisäharjoitukset eivät vaikuta seulonnan raporttiin." Check that it is true.
- **404:** the label "Virhe 404".
- **Sample content, not real test material:** the minimal-pair sentences and pairs other than katto / kato, and the syllable item "au-rin-ko".

## 12. Suggested build order

If the app already has v1, skip this order and follow `CHANGES.md` with the prompt in `README.md`.

Tokens and fonts first (section 3–5), then the shell and the components in `Components.html` (sections 6–7), then the five exercise screens using the static files as reference and keeping all existing exercise logic, then Results with its print stylesheet, then Home, then Consent and the ready screens, then the undesigned screens from section 8.10. After each screen, run the app at 390 and 1440 px and compare against `screenshots/`. Finish with an automated contrast and focus check (every text colour must be one of the pairs in section 3) and a keyboard run through the whole battery.
