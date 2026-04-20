# CLAUDE.md — Project Context for Claude Code

## What this project is

LukiSeula — a Finnish dyslexia screening tool for **15+ year-olds and adults**.
It presents a short battery of reading exercises and produces a risk summary.
All UI text and exercise content is in Finnish.

The app is standalone — no backend, no auth, no database. All state lives in
React component state, refs, and `sessionStorage` (cleared when the tab closes).

### Scientific grounding

The exercise battery is modeled on the NMI "Lukivaikeuksien seulontamenetelmä
nuorille ja aikuisille" (Holopainen, Kairaluoma, Nevala, Ahonen & Aro 2004) and
validated against Panula 2013 (Helsingin yliopisto dissertation on adult
dyslexia). Timers and word counts match NMI norms where applicable:

- Etsi kirjoitusvirheet (Tekninen 1): 100 words / 3.5 min
- Sanarajojen hahmottaminen (Tekninen 2): ~100 words / 1.5 min
- NMI cutoff for "tuen tarpeen selvittely": persentiili 12%

Keep this in mind when tweaking content volume or timer durations — they are
not arbitrary.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **shadcn/ui** for all UI components (`src/components/ui/`)
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Sonner** for toast notifications
- **Vitest** + Testing Library for tests
- Package manager: **npm**

## Project structure

```
src/
  App.tsx                        — all routes defined here
  pages/                         — one file per page/route
  features/exercises/<name>/     — exercise feature folders
  components/                    — shared components
  components/ui/                 — shadcn/ui primitives (do not edit)
  lib/                           — utilities
```

## Exercise architecture

Each exercise lives in `src/features/exercises/<name>/` and follows this pattern:

```
types.ts              — TypeScript types for the exercise
<name>Items.fi.ts     — Finnish content/question data
<name>Exercise.tsx    — main component + inline end screen
```

A thin page wrapper in `src/pages/<Name>ExercisePage.tsx` renders the feature component.

To add a new exercise:
1. Create `src/features/exercises/<name>/` with the files above
2. Create `src/pages/<Name>ExercisePage.tsx`
3. Add a route in `src/App.tsx` (`/exercise/<name>`)
4. Add a card in `src/pages/ExerciseList.tsx`

## Existing exercises

Main flow (linked from `ExerciseList.tsx`):

| Part | Name | Route | NMI-aligned | Description |
|---|---|---|---|---|
| Osa 1 | Pseudoword detection | `/task/pseudowords` | — | Real vs. pseudoword judgement |
| Osa 2 | Word search | `/task/word-search` | supplementary | Find target words in a text, 2-min timer |
| Osa 3 | Word chains | `/exercise/word-chains` | ✓ Tekninen 2 | Insert spaces into concatenated sentences (1.5 min) |
| Osa 4 | Spelling errors | `/exercise/spelling-errors` | ✓ Tekninen 1 | Flag misspelled words in a 100-item list (3.5 min) |
| Osa 5 | Reading comprehension | `/exercise/reading-comp` | ✓ Luetun ymmärtäminen | Read a passage, answer questions |
| Lisä | Syllable assembly | `/exercise/syllables` | — | Build a word from syllable tiles |
| Lisä | Minimal pair detection | `/exercise/minimal-pairs` | — | Choose the correct word from a minimal pair |

Hidden scaffolds (no nav link, direct URL only — reserved for heavier future battery):

| Name | Route |
|---|---|
| Sentence chains | `/exercise/sentence-chains` |
| True/false statements | `/exercise/true-false` |
| Syllable boundaries | `/exercise/syllable-boundaries` |

Results flow into `src/pages/FinalResults.tsx`, which renders a dossier-style
summary and flags "tuen tarpeen selvittely" when ≥2 NMI-aligned areas score in
the "selviä vaikeuksia" tier.

## Key conventions

- All exercise UI text is in Finnish
- Design system is documented in user memory as "The Elevated Curator" — palette
  anchored on `#fff8f5` / `#C69A2B` / `#241a11`. Check before restyling.
- shadcn/ui `Card`, `Button`, `Progress`, `Badge` are the primary UI primitives
- `cn()` from `@/lib/utils` for conditional classNames
- Feature components export named exports; page wrappers use default exports
- No global state management — exercises use local `useState`/`useRef`;
  cross-exercise results persist via `src/lib/exerciseResults.ts` (sessionStorage)
- Avoid adding new dependencies
- Text inputs should disable Chrome autofill (autoComplete="off", dynamic `name`,
  `data-lpignore`, `data-form-type="other"`) so prior answers don't bleed between
  items

## Dev helpers

- `src/lib/devConfig.ts` exposes `DEV_FAST`. When `true`, exercises slice to a
  tiny subset and timers drop to ~30s, so the whole flow can be smoke-tested in
  under a minute. Toggle via the `dev-fast` skill or edit the file directly.
  **Never ship with `DEV_FAST = true`.**

## Commands

```sh
npm run dev       # start dev server (localhost:8080)
npm run build     # production build
npm run lint      # ESLint
npx vitest        # run tests
```
