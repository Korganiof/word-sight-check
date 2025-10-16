# AI Guidelines

- Default model: Claude (latest 3.5/3.7).
- Keep responses concise; show only relevant snippets/diffs.
- Do not reformat entire files; preserve existing indentation and style.
- Add/update tests for logic changes.
- Prefer existing utilities in `src/lib/` and shadcn/ui in `src/components/ui/`.
- Avoid adding new dependencies unless necessary.

## Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to `tasks/todo.md`.
2. The plan should have a list of todo items that you can check off as you complete them.
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made.
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the `tasks/todo.md` file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.




