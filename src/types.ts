export type Site = {
	TITLE: string;
	DESCRIPTION: string;
	NUM_POSTS_ON_HOMEPAGE: number;
};

export type Metadata = {
	TITLE: string;
	DESCRIPTION: string;
};

export type Socials = {
	NAME: string;
	HREF: string;
	SVG: string;
}[];

export type ExternalFeeds = {
	NAME: string;
	URL: string;
	TAG: string;
}[];
