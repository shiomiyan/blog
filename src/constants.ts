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

/**
 * Mapping of tag definitions can be used in this site.
 */
// prettier-ignore
export const TAGS = {
	"hatenablog": "はてなブログ",
	"qiita": "Qiita",
	"zenn": "Zenn",
	"security": "セキュリティ",
	"random": "雑記",
	"tree-sitter": "Tree-sitter",
	"astro": "Astro",
	"cloudflare": "Cloudflare",
	"raspberry-pi": "Raspberry Pi",
	"puppeteer": "Puppeteer",
	"typescript": "TypeScript",
	"deno": "Deno",
	"npm": "npm",
	"rollup": "rollup",
	"browser": "Browser",
	"rfc": "RFC",
	"site-updates": "Site updates",
	"weekly-report": "Weekly report"
} as const;
