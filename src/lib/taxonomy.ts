import { CATEGORIES, TAGS } from "@constants";

export type TagDefinition = (typeof TAGS)[number];
export type CategoryDefinition = (typeof CATEGORIES)[number];
export type TagId = TagDefinition["id"];
export type CategoryId = CategoryDefinition["id"];

/**
 * Synchronous taxonomy ID sets for frontmatter schema validation.
 *
 * Content Collection reads are async, while Zod refinements in `postSchema`
 * need synchronous predicates.
 */
const tagIds = new Set<string>(TAGS.map((tag) => tag.id));
const categoryIds = new Set<string>(CATEGORIES.map((category) => category.id));

/** Returns whether a value is a defined tag ID. */
export const isTagId = (value: string): value is TagId => tagIds.has(value);

/** Returns whether a value is a defined category ID. */
export const isCategoryId = (value: string): value is CategoryId =>
  categoryIds.has(value);

/** Loads all tag definitions from the taxonomy collection. */
export const getTagDefinitions = (): TagDefinition[] => [...TAGS];

/** Loads all category definitions from the taxonomy collection. */
export const getCategoryDefinitions = (): CategoryDefinition[] => [
  ...CATEGORIES,
];

/**
 * Resolves a tag ID to its display label.
 *
 * Unknown IDs throw because normal post content should already be validated by
 * the frontmatter schema.
 */
export const getTagLabel = (id: string): string => {
  const tag = TAGS.find((tag) => tag.id === id);
  if (!tag) {
    throw new Error(`Unknown tag id: "${id}".`);
  }

  return tag.label;
};

/**
 * Resolves a category ID to its display label.
 *
 * Unknown IDs throw because normal post content should already be validated by
 * the frontmatter schema.
 */
export const getCategoryLabel = (id: string): string => {
  const category = CATEGORIES.find((category) => category.id === id);
  if (!category) {
    throw new Error(`Unknown category id: "${id}".`);
  }

  return category.label;
};
