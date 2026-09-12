# LukiSeula

A Finnish dyslexia screening tool for 15+ year-olds and adults, built with
React. Presents a five-part battery of timed reading exercises and produces a
dossier-style summary. No backend — everything runs in the browser and nothing
leaves the tab.

## Screening battery

| Osa | Exercise | Time |
|---|---|---|
| 1 | Pseudoword detection — real word or made up? (30 items, 3 s each) | ~1.5 min |
| 2 | Word search — find 12 target words in a passage | 3 min |
| 3 | Word chains — tap the word boundaries in run-together sentences | 1.5 min |
| 4 | Spelling errors — mark the misspelt words in a 100-word list | 3.5 min |
| 5 | Reading comprehension — mark the words that don't fit the text | 4 min |

Parts 3–5 follow the NMI adult screening battery (Holopainen et al. 2004);
see `CLAUDE.md` for the scientific grounding and scoring rules.

Two supplementary exercises (syllable assembly, minimal pairs) are available
from `/exercises` and do not feed the report.

## Tech stack

Vite · React 18 · TypeScript · Tailwind CSS · React Router v6 · Vitest

## Getting started

```sh
npm install
npm run dev       # http://localhost:8080
```

## Other commands

```sh
npm run build     # production build → dist/
npm run lint      # ESLint
npx vitest run    # tests
```

## Deploying

Static SPA — any static host works. Client-side routing needs a fallback to
`index.html`: `public/_redirects` covers Netlify / Cloudflare Pages and
`vercel.json` covers Vercel. Before launch, make the `og:image` URL in
`index.html` absolute and add `og:url`.
