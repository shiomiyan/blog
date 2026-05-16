# Styling

`src/styles/global.css` is the source of truth for design tokens and shared UI styles.

- Prefer semantic tokens such as `--color-foreground` and `--color-border-subtle` before adding new raw values.
- Use shared classes like `text-link`, `ui-badge`, and `ui-panel` when the same visual pattern appears more than once.
- Treat base tokens like `--color-blue-600` as palette primitives for token definitions, not as the default choice in components.
- Keep `tailwind.config.mts` for Tailwind behavior such as plugins. Theme values should live in CSS.
- `src/components/Upvote.astro` intentionally stays outside the shared token system because it is scoped to `98.css`.
