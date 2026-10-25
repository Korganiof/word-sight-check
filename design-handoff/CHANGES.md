# What changed in v2

**Why.** v1 drew only the Osa 1 and Osa 5 ready screens, and told you to build Osa 2–4 from the Osa 1 layout "with no example card". That left the start button alone at the top of an empty right-hand column, with the instructions pushed below the fold on a 1440 × 716 window.

v2 does four things:

- draws all five ready screens and Consent;
- puts every primary action in the docked bar;
- fixes three layout bugs;
- specifies the screens v1 left out.

The rules behind these changes are in HANDOFF.md §6.7. Exercise logic, timers, item counts, scoring and routing are unchanged.

## Changed screens

### Ready screens, Osa 1–5

Files: `Ready-Osa1-*` … `Ready-Osa5-*`. Spec: HANDOFF.md §8.3.

- **Layout.** One shared layout. The title and subtitle span the full width, with no `OSA n / 5` label. Below them sit 580 px of steps beside a 420 px example card; Osa 5 has the warm-up in that place. The desktop column is 1040 px, centred with `margin: auto 0`.
- **Button.** "Aloita harjoitus" has moved to the docked bar. The part's facts sit as pills on the left of the bar; on Osa 5 the gate hint replaces them until the warm-up is solved.
- **Fit.** All five fit 1440 × 716 without scrolling.

### Consent

Files: `Consent-1440`, `Consent-390`. Spec: HANDOFF.md §8.2.

- **Order.** One column: the three terms, then the checkbox, then the two notes. At 1440 × 716 the checkbox is above the fold.
- **Bar.** "Peruuta" and the gated "Jatka tehtävään" are in the docked bar, with the hint "Hyväksy ensin ehdot, niin voit jatkaa." on the left while the box is unchecked.
- **Removed.** The right-hand sticky card from v1 is gone.

### Osa 2 exercise, desktop

File: `Osa2-1440`. Spec: HANDOFF.md §8.5.

- **Layout.** One 840 px column. The target panel now sits above the text, sticky at the top of `main`, which matches the ready-screen copy ("…sen yläpuolella listan sanoista").
- **Bar.** The docked bar's inner row is 840 px.
- **Removed.** The 340 px aside is gone.

### Osa 1 exercise, desktop

File: `Osa1-1440`. Spec: HANDOFF.md §8.4.

- **Centring fix.** `main` now scrolls, and the block is centred with `margin: auto 0` instead of `justify-content: center` on `main`. Without the fix, the top of the content was clipped on short windows.

### Osa 3 exercise, desktop

File: `Osa3-1440`. Spec: HANDOFF.md §8.6.

- **Centring fix.** The same fix as Osa 1.
- **Title.** The title gets `flex-shrink: 0`; it was 4 px from wrapping beside the instruction.

### Prototype links only

Files: `Osa1-390`, `Osa2-390`, `Osa3-390`.

- In the canvas prototype, each exercise now hands off to the next part's ready screen. Leave the app's own flow as it is.

## New screens

| Screen | Files | Spec |
|---|---|---|
| Exercises list | `Exercises-1440`, `Exercises-390` | HANDOFF.md §8.10 |
| Supplementary: syllables | `Extra-Syllables-1440`, `Extra-Syllables-390` (tweak `vaihe`: Tavu / Vastaus / Oikein / Väärin) | §8.11 |
| Supplementary: minimal pairs | `Extra-Pairs-1440`, `Extra-Pairs-390` | §8.12 |
| Supplementary end screen | `Extra-End-1440`, `Extra-End-390` | §8.13 |
| 404 | `NotFound-1440`, `NotFound-390` | §8.14 |

## Unchanged

These screens are unchanged: Home, Osa 4, Osa 5, Results, the print pages, Tokens and Components. Their static files are byte-identical to v1, and their screenshots are the v1 renders.

## Copy

All new strings are listed at the end of HANDOFF.md §11. Wherever the app already has its own text, keep the app's text and only take the layout from here. This matters most for the ready-screen steps.

## Comparing against the screenshots

The v2 screenshots were rendered with the same Fontsource files the app self-hosts. Line breaks can still differ by a word between browsers, so compare layout and spacing rather than exact wraps.

`screenshots/1440x716/` holds the six screens that must fit that window.
