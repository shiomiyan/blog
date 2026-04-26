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

## Documentation

**Core principle:**

Explain WHY, not WHAT. Keep comments as short as possible. One sentence explaining rationale beats a paragraph restating code.

**Comment style:**

There are two types of comments, JSDoc (`/** ... */`) and non-JSDoc ordinary comments (`// ... or /* ... */`).

- Use `/** JSDoc */` comments for documentation, i.e. comments a user of the code should read.
- Use `//` line comments for implementation comments, i.e. comments that only concern the implementation of the code itself.
- Use JSDoc for exported schemas, collection definitions, and shared helpers when explaining their contract or design rationale.

JSDoc comments are understood by tools (such as editors and documentation generators), while ordinary comments are only for other humans.

### Function docs

- First line: brief one-liner
- Second paragraph: explain design rationale and why this exists
- Document error handling philosophy when relevant
- Explain non-obvious behavior and platform differences

## References

- https://google.github.io/styleguide/tsguide.html
