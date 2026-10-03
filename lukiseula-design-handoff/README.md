# LukiSeula design handoff

Everything Claude Code needs to restyle the app. Nothing here changes what the exercises measure.

```
lukiseula-design-handoff/
  README.md                      this file
  HANDOFF.md                     the spec: direction, tokens, shell, components with states, every screen, print, a11y, copy to verify
  tokens/
    tokens.css                   CSS custom properties + base rules (source of truth)
    tailwind.config.tokens.js    Tailwind v3  → theme.extend
    tailwind.theme.css           Tailwind v4  → @theme block
  screens/
    static/   25 × .html         each screen as plain HTML with every value inline — the reference markup
    source/   25 × .dc.html      the interactive design-canvas sources — only for behaviour details
  screenshots/ 25 × .png         1× renders to compare the running app against
```

## Use it with Claude Code

1. Unzip into the repo, for example `design/handoff/`, and commit it.
2. Make sure `DESIGN_BRIEF.md` is in the repo too (HANDOFF.md refers to it).
3. Start Claude Code in the repo and paste:

```
Read design/handoff/README.md, then design/handoff/HANDOFF.md in full, then DESIGN_BRIEF.md.

Implement the UI refresh in this React + Tailwind app in this order, one step at a time, showing me a diff summary after each:
1. Tokens and fonts: add the token file that matches our Tailwind version (tokens/tailwind.config.tokens.js for v3 or tokens/tailwind.theme.css for v4) plus tokens/tokens.css, and self-host Manrope, Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono with @fontsource exactly as HANDOFF.md §4 lists them. Remove the old colour values #d2c5b0 and #ef4444 and the old level colours.
2. Shell + components (HANDOFF.md §6–7, reference design/handoff/screens/static/Components.html): AppBar, BatteryRail, TimerPill + TimeLine (with the low-time state), DockedBar, Counter, Sheet, Button (primary / secondary / answer key / tertiary), Keycap, WordToggle, GridWordToggle, LetterTape, LevelChip, LevelBar, ResourceLink, NoteBlock, SupportBlock, NumberedStep, IconTile, Badge.
3. The five exercise screens (§8.4–8.8) from screens/static/Osa*-1440.html and Osa*-390.html. Keep every existing exercise rule, timer, item count and scoring untouched — this is a restyle.
4. Results (§8.9) and its print stylesheet (§9, reference Report-A4-1..3.html).
5. Home (§8.1), Consent (§8.2), the ready screens (§8.3) including the Osa 5 warm-up gating.
6. The screens that were not designed (§8.10), built from the same components.

Rules: do not change any Finnish copy except the lines HANDOFF.md §11 says to verify; use only the token colours and only the text/background pairs listed in §3; tap targets ≥ 44 px on phones; respect prefers-reduced-motion; zero third-party requests (fonts self-hosted); real <button>/<a>/<input> elements with the aria attributes in §10. After each screen, run the app at 390 and 1440 px and compare against design/handoff/screenshots/*.png, then fix the differences before moving on.
```

Claude Code works best from the static HTML plus the spec. It does not need the `.dc.html` sources unless it asks how a behaviour works (the letter tape marks, the 500 ms auto-advance, the warm-up gating) — those are in the `<script data-dc-script>` block at the bottom of each source file.

## Screen names

`<Screen>-<width>.html`: `Osa3-1440` is the Osa 3 exercise at 1440 × 900, `Osa3-390` the same at 390 × 844. `Main` is Home at 1440 and `Home-390` is Home at 390. `Ready-Osa1` is `/start`; `Ready-Osa5` is the ready screen of `/exercise/reading-comp` with the warm-up. `Report-A4-1..3` are the print pages. `Tokens` and `Components` are specification sheets, not app screens. Routes are mapped in HANDOFF.md §8.

## Viewing the static files

Open any file in `screens/static/` in a browser. The page is the artboard at its fixed size, so view it at 100 % zoom. These files load the three fonts from Google Fonts so they render correctly from disk; the app itself must self-host (HANDOFF.md §4).
