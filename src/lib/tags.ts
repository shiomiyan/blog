type TagDefinition = {
	readonly slug: string;
	readonly displayName: string;
};

/**
 * Mapping of tag definitions can be used in posts.
 */
// prettier-ignore
const TAGS: Record<string, TagDefinition> = {
	HATENABLOG: { slug: "hatenablog", displayName: "はてなブログ" },
	QIITA: { slug: "qiita", displayName: "Qiita" },
	ZENN: { slug: "zenn", displayName: "Zenn" },
	SECURITY: { slug: "security", displayName: "セキュリティ" },
	RANDOM: { slug: "random", displayName: "雑記" },
	TREE_SITTER: { slug: "tree-sitter", displayName: "Tree-sitter" },
	ASTRO: { slug: "astro", displayName: "Astro" },
	CLOUDFLARE_WORKERS: {	slug: "cloudflare-workers",	displayName: "Cloudflare Workers" },
	RASPBERRY_PI: { slug: "raspberry-pi", displayName: "Raspberry Pi" },
	PUPPETEER: { slug: "puppeteer", displayName: "Puppeteer" },
	TYPESCRIPT: { slug: "typescript", displayName: "TypeScript" },
	DENO: { slug: "deno", displayName: "Deno" },
	HTTP: { slug: "http", displayName: "HTTP" },
} as const;

/**
 * Get all tag slugs.
 */
export const getAllTagSlug = (): string[] => {
	return Object.values(TAGS).map((tag) => tag.slug);
};

/**
 * Get the display name of a tag.
 */
export const getTagDisplayName = (slug: string): string => {
	const tag = Object.values(TAGS).find((tag) => tag.slug === slug);
	return tag?.displayName || slug;
};
