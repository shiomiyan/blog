import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: ".umirc",
  DESCRIPTION: "",
  EMAIL: "",
  NUM_POSTS_ON_HOMEPAGE: 999,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Micro is an accessible theme for Astro.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const SOCIALS: Socials = [
  {
    NAME: "Twitter",
    HREF: "https://twitter.com/shiomiyan",
  },
  {
    NAME: "GitHub",
    HREF: "https://github.com/shiomiyan",
  },
  {
    NAME: "Mastodon",
    HREF: "https://infosec.exchange/@sk",
  },
];
