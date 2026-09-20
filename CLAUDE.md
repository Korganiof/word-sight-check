# Project Context (CLAUDE.md — AGENTS.md is a symlink to this file)

## What this project is

LukiSeula — a Finnish dyslexia screening tool for **15+ year-olds and adults**.
It presents a short battery of reading exercises and produces a risk summary.
All UI text and exercise content is in Finnish.

The app is standalone — no backend, no auth, no database, no analytics, no
third-party requests (the Manrope font is self-hosted). All state lives in
React component state, refs, and `sessionStorage` (cleared when the tab
closes). The Home page's "Tietosuoja" section promises exactly this — update
it if that ever changes (e.g. if PostHog is added).

### Scientific grounding

The exercise battery is modeled on the NMI "Lukivaikeuksien seulontamenetelmä
nuorille ja aikuisille" (Holopainen, Kairaluoma, Nevala, Ahonen & Aro 2004) and
validated against Panula 2013 (Helsingin yliopisto dissertation on adult
dyslexia). Timers follow NMI norms where applicable:

- Etsi kirjoitusvirheet (Tekninen 1): 100 words / 3.5 min
- Sanarajojen hahmottaminen (Tekninen 2): 15 sentences ≈ 60 words / 1.5 min
  (NMI uses ~100 words with a pen; tapping boundaries is the browser
  equivalent — do not turn this into a typing task, typing speed is a confound)
- Luetun ymmärtäminen: one ~250-word story with 12 semantic substitutions /
  4 min. NMI (Panula 2013, p. 112, citing Holopainen ym. 2004, 9–10): a Finnish
  literary text (~4 pages) in which 52 words are swapped for common words of
  the same word class that do not fit the sentence, paragraph or wider text by
  meaning; no time limit in principle; 9th-grade norm mean ≈ 33–37/52 and the support-need cut-off is 25/52
  ≈ 48 % (Panula 2013, tables 12 & 29) — our 50 % `selvia` line matches it.
  Substitutions are real, correctly inflected words that contradict the
  sentence — never case/inflection errors (those read as broken Finnish,
  not as a comprehension probe), never words that merely *could* differ.
- NMI cutoff for "tuen tarpeen selvittely": persentiili 12 %

Keep this in mind when tweaking content volume or timer durations — they are
not arbitrary.

### Scoring rules (`src/lib/levels.ts`)

- `scoreToLevel(correct, total, thresholds)` → `sujuu` / `jonkin` / `selvia`.
  Default cut-offs 75 % / 50 %. Two-alternative tasks (pseudowords, minimal
  pairs) use `TWO_AFC_THRESHOLDS` (90 % / 75 %) because chance is 50 % there.
- `scoreMarking(hits, falseAlarms, targets)` for every "mark the X" task
  (word search, spelling errors, reading comp): hits minus false alarms, out
  of the number of targets. Marking nothing and marking everything both score
  zero.
- Timed tasks score against the **full** item set — unreached items are wrong.
  That is how the timer measures speed.
- The report flags "tuen tarpeen selvittely" when ≥ 2 of the three
  NMI-aligned areas (sanarajat, kirjoitusvirheet, luetun ymmärtäminen) score
  `selvia`. All cut-offs are heuristic, not clinically normed — the UI says so.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** — styling uses literal palette values (`bg-[#fff8f5]`),
  no semantic tokens
- **React Router v6** (with v7 future flags on)
- **lucide-react** for icons
- **Vitest** + Testing Library for tests
- Package manager: **npm**
- shadcn/ui and the Lovable template were removed; do not re-add UI libraries.
  Avoid adding dependencies in general.

## Project structure

```
src/
  App.tsx                        — all routes defined here
  pages/                         — one file per page/route
  features/exercises/<name>/     — exercise feature folders
  components/                    — shared components (ready/end screens, footer, tasks 1–2)
  hooks/                         — useCountdown, useScreeningFlow
  lib/                           — flow, levels/scoring, session stores, content for the report
public/fonts/                    — self-hosted Manrope
```

## Exercise architecture

Each exercise lives in `src/features/exercises/<name>/` and follows this pattern:

```
types.ts              — TypeScript types for the exercise
<name>Items.fi.ts     — Finnish content/question data
<name>Exercise.tsx    — main component (+ inline end screen if not in the battery)
```

A thin page wrapper in `src/pages/<Name>ExercisePage.tsx` shows an
`ExerciseReadyScreen` with instructions (optionally a `demo` warm-up that
gates the start button, as reading comp does), then renders the feature
component.

Battery exercises save their result and call `goToNext()` from
`useScreeningFlow` — the order lives in `src/lib/flow.ts`. Supplementary
exercises show `ExerciseEndScreen` instead and return to `/exercises`.

To add a new exercise:
1. Create `src/features/exercises/<name>/` with the files above
2. Create `src/pages/<Name>ExercisePage.tsx`
3. Add a route in `src/App.tsx`
4. Add a card in `src/pages/ExerciseList.tsx`
5. If it's part of the battery: add it to `SCREENING_FLOW`, a store in
   `src/lib/exerciseResults.ts`, and a row in `src/lib/finalResultsContent.ts`

## Existing exercises

Main flow (`SCREENING_FLOW`; also linked from `ExerciseList.tsx`):

| Part | Name | Route | NMI-aligned | Description |
|---|---|---|---|---|
| Osa 1 | Pseudoword detection | `/task/pseudowords` | — | 15 real + 15 pseudo, 3 s each; pools are length-matched |
| Osa 2 | Word search | `/task/word-search` | supplementary | Find 12 target words in a 250-word passage, 3 min |
| Osa 3 | Word chains | `/exercise/word-chains` | ✓ Tekninen 2 | Tap word boundaries in 15 run-together sentences, 1.5 min |
| Osa 4 | Spelling errors | `/exercise/spelling-errors` | ✓ Tekninen 1 | Mark misspelt words in a 100-item list (50 errors), 3.5 min |
| Osa 5 | Reading comprehension | `/exercise/reading-comp` | ✓ Luetun ymmärtäminen | Mark the 12 wrong words in a passage, 4 min |
| Lisä | Syllable assembly | `/exercise/syllables` | — | Build a word from flashed syllables |
| Lisä | Minimal pair detection | `/exercise/minimal-pairs` | — | Choose the correct word from a length minimal pair |

Unrouted scaffolds (code kept in `src/features/exercises/`, **not** in
`App.tsx`): sentence chains, true/false statements, syllable boundaries. Their
passages (Mozart / Klassismi) need a provenance check before they ship — add
a `<Route>` only after that.

Results flow into `src/pages/FinalResults.tsx`, which renders a dossier-style
summary. The report deliberately does not reveal which items were missed
(retest contamination).

## Key conventions

- All UI text is in Finnish; button labels quoted in instructions must match
  the actual button ("Tarkista", "Valmis", "Olen valmis")
- Design system: "The Elevated Curator" (documented in user memory) — canvas
  `#fff8f5`, text `#241a11`, gold `#C69A2B` for primary CTAs only, labels
  `#785a00`, secondary text `#755e4d`. **`#d2c5b0` is for bars and ghost
  borders only — never for text** (1.6:1 contrast on the canvas).
- `PageFooter` for page footers, `ExerciseReadyScreen` for instructions,
  `ExerciseEndScreen` for supplementary-exercise results
- Clickable things are `<button>`s (keyboard reachable), with `aria-pressed`
  for toggles
- `cn()` from `@/lib/utils` for conditional classNames
- Feature components export named exports; page wrappers use default exports
- Pick/shuffle exercise items inside the component (`useMemo`), never at
  module scope — a retry in the same tab must get a fresh set
- Text inputs disable Chrome autofill (autoComplete="off", dynamic `name`,
  `data-lpignore`, `data-form-type="other"`) so prior answers don't bleed
  between items
- Content rules: pseudowords must not be inflected real words; minimal-pair
  sentences must be grammatical with the correct option in place (mind
  consonant gradation); syllable splits follow Finnish hyphenation; reading-comp
  substitutions are semantic contradictions in correct inflection, decidable
  from the text

## Dev helpers

- `src/lib/devConfig.ts` exposes `DEV_FAST`. When `true`, exercises slice to a
  tiny subset and timers drop to ~30s, so the whole flow can be smoke-tested in
  under a minute. Toggle via the `dev-fast` skill or edit the file directly.
  **Never ship with `DEV_FAST = true`.**
- `npm run dev` runs in React StrictMode — effects double-invoke in dev, which
  is intended.

## Commands

```sh
npm run dev       # start dev server (localhost:8080)
npm run build     # production build
npm run lint      # ESLint (must be clean — no ignores for app code)
npx vitest run    # run tests
```

## Deployment

Static SPA. `public/_redirects` (Netlify / Cloudflare Pages) and `vercel.json`
(Vercel) provide the `index.html` fallback that client-side routing needs.
Before launch: make `og:image` in `index.html` absolute and add `og:url`.
