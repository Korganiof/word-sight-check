---
name: dev-fast
description: Toggle DEV_FAST on or off in src/lib/devConfig.ts
user-invocable: true
---

The user wants to toggle the DEV_FAST flag in `src/lib/devConfig.ts`.

- If the user says "on", "enable", or "true" → set `DEV_FAST = true`
- If the user says "off", "disable", or "false" → set `DEV_FAST = false`
- If no argument is given, check the current value and toggle it to the opposite

Edit only the line `export const DEV_FAST = ...` in `src/lib/devConfig.ts`.
After editing, confirm the new value to the user in one short sentence.
