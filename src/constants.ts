export const SITE = {
  TITLE: "blog.736b.moe",
  DESCRIPTION: "Blog by @shiomiyan.",
  NUM_POSTS_ON_HOMEPAGE: 999,
} as const;

export const SOCIALS = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/shiomiyan",
    SVG_NAME: "github",
  },
  {
    NAME: "Twitter",
    HREF: "https://twitter.com/shiomiyan",
    SVG_NAME: "twitter",
  },
  {
    NAME: "Bluesky",
    HREF: "https://bsky.app/profile/736b.moe",
    SVG_NAME: "bluesky",
  },
] as const;

export const TAGS = [
  {
    id: "security",
    label: "セキュリティ",
  },
  {
    id: "random",
    label: "雑記",
  },
  {
    id: "tree-sitter",
    label: "Tree-sitter",
  },
  {
    id: "astro",
    label: "Astro",
  },
  {
    id: "cloudflare",
    label: "Cloudflare",
  },
  {
    id: "raspberry-pi",
    label: "Raspberry Pi",
  },
  {
    id: "puppeteer",
    label: "Puppeteer",
  },
  {
    id: "typescript",
    label: "TypeScript",
  },
  {
    id: "deno",
    label: "Deno",
  },
  {
    id: "npm",
    label: "npm",
  },
  {
    id: "rollup",
    label: "rollup",
  },
  {
    id: "browser",
    label: "Browser",
  },
  {
    id: "rfc",
    label: "RFC",
  },
  {
    id: "site-updates",
    label: "Site updates",
  },
  {
    id: "weekly-report",
    label: "Weekly report",
  },
] as const;

export const CATEGORIES = [
  {
    id: "tech",
    label: "Tech",
  },
  {
    id: "diary",
    label: "Diary",
  },
] as const;
