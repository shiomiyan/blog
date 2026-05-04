import { CATEGORIES, TAGS } from "@constants";

export type TagDefinition = {
  id: string;
  label: string;
};
export type CategoryDefinition = (typeof CATEGORIES)[number];
export type TagId = string;
export type CategoryId = CategoryDefinition["id"];

/**
 * Synchronous taxonomy ID sets for frontmatter schema validation.
 *
 * Content Collection reads are async, while Zod refinements in `postSchema`
 * need synchronous predicates.
 */
const categoryIds = new Set<string>(CATEGORIES.map((category) => category.id));

/** Returns whether a value is a defined category ID. */
export const isCategoryId = (value: string): value is CategoryId =>
  categoryIds.has(value);

/** Builds tag definitions from known labels plus labels used by posts. */
export const getTagDefinitions = (
  tagIds: Iterable<string> = [],
): TagDefinition[] => {
  const definitionsById = new Map<string, TagDefinition>(
    TAGS.map((tag) => [tag.id, tag]),
  );

  for (const id of tagIds) {
    definitionsById.set(id, {
      id,
      label: getTagLabel(id),
    });
  }

  return [...definitionsById.values()];
};

/** Loads all category definitions from the taxonomy collection. */
export const getCategoryDefinitions = (): CategoryDefinition[] => [
  ...CATEGORIES,
];

/**
 * Resolves a tag ID to its display label.
 *
 * Unknown IDs fall back to themselves so posts can introduce tags without
 * updating shared taxonomy first.
 */
export const getTagLabel = (id: string): string => {
  const tag = TAGS.find((tag) => tag.id === id);
  return tag?.label ?? id;
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
