import type { AstroIntegration } from "astro";
import * as glob from "glob";
import fs from "node:fs";
import path from "node:path";

/**
 * Collect all ULIDs from all posts and write them to a JSON file for Cloudflare Pages Functions.
 */
const ulidgen = (): AstroIntegration => {
	return {
		name: "ulidgen",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				logger.info("Collecting ULIDs from all posts...");

				// Collect all posts from src/content/posts/**/index.mdx
				const contentDir = path.resolve(process.cwd(), "src/content/posts");
				const files = glob.sync("**/index.mdx", { cwd: contentDir });

				const ulids: string[] = [];

				// Extract ULID from mdx files
				for (const file of files) {
					const filePath = path.join(contentDir, file);
					const content = fs.readFileSync(filePath, "utf-8");

					// Extract ULID from `ulid:` frontmatter
					const ulidMatch = content.match(/ulid: ([^\n]+)/);
					if (ulidMatch && ulidMatch[1]) {
						// Remove leading and trailing quotes and extra characters
						const ulid = ulidMatch[1].trim().replace(/["']/g, "");
						ulids.push(ulid);
					}
				}

				// Check `./dist/data` exists
				const outputDir = path.join(dir.pathname, "data");
				if (!fs.existsSync(outputDir)) {
					fs.mkdirSync(outputDir, { recursive: true });
				}

				// Write JSON file
				const outputPath = path.join(outputDir, "ulids.json");
				fs.writeFileSync(outputPath, JSON.stringify({ ulid: ulids }, null, 2));
				logger.info(`Finished collecting ULIDs, wrote json to ${outputPath}`);
			},
		},
	};
};

export default ulidgen;
