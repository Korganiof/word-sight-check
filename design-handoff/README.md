# LukiSeula design handoff, v2

This folder is everything Claude Code needs to restyle the app. Nothing in it changes what the exercises measure.

```
lukiseula-design-handoff/
  README.md                      this file
  CHANGES.md                     what changed since v1, file by file
  HANDOFF.md                     the spec: direction, tokens, shell, layout rules (§6.7), components with states, every screen, print, a11y, copy to verify
  tokens/
    tokens.css                   CSS custom properties + base rules (source of truth)
    tailwind.config.tokens.js    Tailwind v3  → theme.extend
    tailwind.theme.css           Tailwind v4  → @theme block
  screens/
    static/   41 × .html         each screen as plain HTML with every value inline (the reference markup)
    source/   41 × .dc.html      the interactive design-canvas sources (read only for behaviour details)
  screenshots/ 41 × .png         1× renders to compare the running app against
    1440x716/  6 × .png          Consent and the five ready screens at the window size they must fit
```

## The app already has v1: apply the update

1. Replace `design/handoff/` (or wherever you unzipped v1) with this folder, and commit it.
2. Start Claude Code in the repo and paste:

```
Read design/handoff/CHANGES.md, then HANDOFF.md §6.5, §6.7 (layout rules), §8.2–8.6, §8.10–8.14 and the v2 part of §11.

This updates the UI refresh you already built from v1. Apply only what CHANGES.md lists, one step at a time, and show me a diff summary after each:
1. Ready screens for Osa 1–5. Build one shared ReadyScreen layout: a full-width title block, steps beside an example card (the warm-up on Osa 5), and the docked bar with the facts pills and "Aloita harjoitus". Keep the app's existing ready-screen copy wherever it differs from the static files.
2. Consent: terms, then checkbox, then notes, with Peruuta and the gated "Jatka tehtävään" in the docked bar plus the gate hint.
3. Osa 2 desktop: a single 840 px column with the sticky target panel above the text.
4. Osa 1 and Osa 3 desktop: make main the scroll container and centre the block with margin-block: auto instead of justify-content: center.
5. The exercises list, the two supplementary exercises, their end screen and the 404 page, built from the existing components.

Rules: follow HANDOFF.md §6.7. Do not change exercise logic, timers, item counts, scoring or routing. Do not change Finnish copy except where §11 lists new lines. After each step, run the app at 1440 × 716 and 390 × 844 and compare against design/handoff/screenshots/ (and screenshots/1440x716/ for Consent and the ready screens). A ready screen must not scroll at 1440 × 716.
```

## Starting from scratch

1. Unzip into the repo, for example `design/handoff/`, and commit it.
2. Make sure `DESIGN_BRIEF.md` is in the repo too, because HANDOFF.md refers to it.
3. Start Claude Code in the repo and paste:

```
Read design/handoff/README.md, then design/handoff/HANDOFF.md in full, then DESIGN_BRIEF.md.

Implement the UI refresh in this React + Tailwind app in this order, one step at a time, showing me a diff summary after each:
1. Tokens and fonts: add the token file that matches our Tailwind version (tokens/tailwind.config.tokens.js for v3 or tokens/tailwind.theme.css for v4) plus tokens/tokens.css, and self-host Manrope, Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono with @fontsource exactly as HANDOFF.md §4 lists them. Remove the old colour values #d2c5b0 and #ef4444 and the old level colours.
2. Shell + components (HANDOFF.md §6–7, reference design/handoff/screens/static/Components.html): AppBar, BatteryRail, TimerPill + TimeLine (with the low-time state), DockedBar, Counter, Sheet, Button (primary / secondary / answer key / tertiary), Keycap, WordToggle, GridWordToggle, LetterTape, LevelChip, LevelBar, ResourceLink, NoteBlock, SupportBlock, NumberedStep, IconTile, Badge, FactPill.
3. The five exercise screens (§8.4–8.8) from screens/static/Osa*-1440.html and Osa*-390.html. Keep every existing exercise rule, timer, item count and scoring untouched; this is a restyle.
4. Results (§8.9) and its print stylesheet (§9, reference Report-A4-1..3.html).
5. Home (§8.1), Consent (§8.2) and the five ready screens (§8.3), including the Osa 5 warm-up gating.
6. The exercises list, the supplementary exercises, their end screen and the 404 page (§8.10–8.14).

Rules: follow the layout rules in HANDOFF.md §6.7. Do not change any Finnish copy except the lines HANDOFF.md §11 says to verify. Use only the token colours and only the text/background pairs listed in §3. Keep tap targets ≥ 44 px on phones, respect prefers-reduced-motion, and make zero third-party requests (fonts self-hosted). Use real <button>/<a>/<input> elements with the aria attributes in §10. After each screen, run the app at 390 and 1440 px and compare against design/handoff/screenshots/*.png, then fix the differences before moving on.
```

Claude Code works best from the static HTML plus the spec. It needs the `.dc.html` sources only to see how a behaviour works, such as the letter-tape marks, the 500 ms auto-advance, the warm-up gating, the consent gate or the syllable answer flow. That logic is in the `<script data-dc-script>` block at the bottom of each source file.

## Screen names

Files are named `<Screen>-<width>.html`. `Osa3-1440` is the Osa 3 exercise at 1440 × 900; `Osa3-390` is the same at 390 × 844. Screens that scroll on a phone are drawn at their full height.

| Name | Screen |
|---|---|
| `Main` | Home at 1440 |
| `Home-390` | Home at 390 |
| `Ready-Osa1` … `Ready-Osa5` | The ready screens. `Ready-Osa1` is `/start`; `Ready-Osa5` includes the warm-up |
| `Exercises` | `/exercises` |
| `Extra-Syllables`, `Extra-Pairs` | The two supplementary exercises |
| `Extra-End` | The supplementary end screen |
| `NotFound` | The 404 page |
| `Report-A4-1..3` | The print pages |
| `Tokens`, `Components` | Specification sheets, not app screens |

Routes are mapped in HANDOFF.md §8.

## Viewing the static files

Open any file in `screens/static/` in a browser. Each page is the artboard at its fixed size, so view it at 100 % zoom.

These files load the three fonts from Google Fonts so they render correctly from disk. The app itself must self-host them (HANDOFF.md §4).
