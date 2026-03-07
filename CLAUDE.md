# CLAUDE.md — Project Context for Claude Code

## What this project is

A Finnish dyslexia screening tool. It presents a series of reading exercises
to the user and measures performance. The target audience is Finnish speakers,
so all UI text and exercise content is in Finnish.

The app is standalone — no backend, no auth, no database. All state lives in
React component state and refs.

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

| Name | Route | Description |
|---|---|---|
| Pseudoword detection | `/task/pseudowords` | Real vs. pseudoword judgement |
| Word search | `/task/word-search` | Find target words in a text, 2-min timer |
| Syllable assembly | `/exercise/syllables` | Build a word by selecting syllable tiles |
| Minimal pair detection | `/exercise/minimal-pairs` | Choose the correct word from a minimal pair |

## Key conventions

- All exercise UI text is in Finnish
- shadcn/ui `Card`, `Button`, `Progress`, `Badge` are the primary UI primitives
- `cn()` from `@/lib/utils` for conditional classNames
- Feature components export named exports; page wrappers use default exports
- No global state management — exercises use local `useState`/`useRef`
- Avoid adding new dependencies

## Commands

```sh
npm run dev       # start dev server (localhost:8080)
npm run build     # production build
npm run lint      # ESLint
npx vitest        # run tests
```
