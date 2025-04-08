import type { ExternalFeeds, Site, Socials } from "@types";

export const SITE: Site = {
	TITLE: "blog.736b.moe",
	DESCRIPTION: "Blog by @shiomiyan.",
	NUM_POSTS_ON_HOMEPAGE: 999,
} as const;

export const SOCIALS: Socials = [
	{
		NAME: "Twitter",
		HREF: "https://twitter.com/shiomiyan",
		SVG_NAME: "twitter",
	},
	{
		NAME: "GitHub",
		HREF: "https://github.com/shiomiyan",
		SVG_NAME: "github",
	},
	{
		NAME: "Mastodon",
		HREF: "https://infosec.exchange/@sk",
		SVG_NAME: "mastodon",
	},
	{
		NAME: "Bluesky",
		HREF: "https://bsky.app/profile/736b.moe",
		SVG_NAME: "bluesky",
	},
] as const;

export const EXTERNAL_FEEDS: ExternalFeeds = [
	{
		NAME: "Qiita",
		URL: "https://qiita.com/736b/feed",
		TAG: "qiita",
	},
	{
		NAME: "Zenn",
		URL: "https://zenn.dev/736b/feed",
		TAG: "zenn",
	},
] as const;
