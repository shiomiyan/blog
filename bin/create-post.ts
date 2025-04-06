/**
 * Helper script for create post directory and mdx file with following format.
 *
 * ```
 * src/content/posts/<8-digit-datetime>-<slug>/index.mdx
 * ```
 *
 * Run from npm script.
 *
 * ```
 * npm run create-post -- '<TITLE>' '<SLUG>'
 * ```
 *
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { ulid } from "ulid";

const nowISO = new Date().toISOString();
const suffix = nowISO.split("T")[0].replace(/-/g, "");

const title = process.argv[2];
const slug = process.argv[3];
if (slug.match(/[^a-z0-9\-]/g)) {
	console.error(`Do not use not allowed characters`);
	process.exit(1);
}

const postUlid = ulid();
const target = `src/content/posts/${suffix}-${slug}/index.mdx`;
const content = `---
title: ${title}
date: ${nowISO}
description: ""
ulid: ${postUlid}
tags:
  - random
---
`;

fs.mkdir(path.dirname(target), { recursive: true }, (err) => {
	if (err) console.error(err);
	fs.writeFile(target, content, (err) => {
		if (err) console.error(err);
	});
});

console.log(target);
