import type { AstroIntegration } from "astro";
import path from "node:path";
import { createIndex } from "pagefind";

/**
 * Create pagefind index.
 * @see https://pagefind.app/docs/node-api/
 */
const createPagefindIndex = (): AstroIntegration => {
	return {
		name: "pagefind-indexer",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				logger.info("Creating pagefind index...");

				const { index } = await createIndex();
				if (!index) {
					logger.error("Failed to create pagefind index");
					return;
				}

				await index?.addDirectory({
					path: dir.pathname,
				});

				const outDir = path.join(dir.pathname, "pagefind");
				await index?.writeFiles({
					outputPath: outDir,
				});

				logger.info("Pagefind index output to " + outDir);
			},
		},
	};
};

export default createPagefindIndex;
