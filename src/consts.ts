import type { Site, Socials } from "@types";

export const SITE: Site = {
	TITLE: "blog.736b.moe",
	DESCRIPTION: "Blog by @shiomiyan.",
	NUM_POSTS_ON_HOMEPAGE: 999,
} as const;

export const SOCIALS: Socials = [
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
