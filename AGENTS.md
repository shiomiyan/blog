## Tech Stack

**Core**

- Astro 6: Frontend, small APIs, build system
- TypeScript 6
- Tailwind CSS: UI (bit of 98.css)

**Development**

- pnpm: Package management
- eslint: Global linter
- textlint: Linter for Markdown contents
- Prettier: Global formatter

**Deploy**

- Cloudflare wrangler

## Code Style

### Function Definition

Prefer arrow functions over `function` declarations.

**Use:**

```ts
const add = (a: number, b: number): number => a + b;
```

**Avoid:**

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

**Exceptions:** use `function` only when hoisting, dynamic `this`, or TypeScript overloading is required.

Keep usage consistent across the codebase.
