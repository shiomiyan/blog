/**
 * Helper script for creating a post file with the following format.
 *
 * ```
 * src/content/posts/<8-digit-datetime>-<slug>/index.md
 * ```
 *
 * The template file must stay outside the content collection glob filter.
 * `src/content.config.ts` excludes markdown files whose basename starts
 * with `_`, so the template filename must keep that prefix.
 *
 * Run from pnpm script.
 *
 * ```
 * pnpm run create-post -- '<TITLE>' '<SLUG>'
 * ```
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";

const TEMPLATE_PATH = "src/content/posts/_template.md";
const TEMPLATE_TOKENS = {
  title: "__TITLE__",
  date: "__DATE__",
  id: "__ID__",
} as const;

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const [title, slug] = args;

if (!title || !slug) {
  console.error("Usage: pnpm run create-post -- '<TITLE>' '<SLUG>'");
  process.exit(1);
}

if (slug.match(/[^a-z0-9-]/g)) {
  console.error("Do not use not allowed characters");
  process.exit(1);
}

const nowISO = new Date().toISOString();
const suffix = nowISO.split("T")[0].replace(/-/g, "");
const target = `src/content/posts/${suffix}-${slug}/index.md`;

const assertTemplateTokens = (template: string) => {
  for (const token of Object.values(TEMPLATE_TOKENS)) {
    if (!template.includes(token)) {
      throw new Error(`Missing template token: ${token}`);
    }
  }
};

const buildContent = (template: string) => {
  return template
    .replaceAll(TEMPLATE_TOKENS.title, title)
    .replaceAll(TEMPLATE_TOKENS.date, nowISO)
    .replaceAll(TEMPLATE_TOKENS.id, crypto.randomUUID());
};

async function main() {
  const targetDir = path.dirname(target);

  try {
    await fs.access(targetDir);
    throw new Error(`Target directory already exists: ${targetDir}`);
  } catch (error) {
    if (!(error instanceof Error) || "code" in error === false) {
      throw error;
    }

    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }

  const template = await fs.readFile(TEMPLATE_PATH, "utf8");
  assertTemplateTokens(template);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(target, buildContent(template));

  console.log(target);
}

await main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
