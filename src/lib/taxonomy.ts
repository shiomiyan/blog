import { getCollection, type CollectionEntry } from "astro:content";
import categories from "../data/categories.json";
import tags from "../data/tags.json";

export type TagId = string;
export type CategoryId = string;
export type TagDefinition = CollectionEntry<"tags">["data"];
export type CategoryDefinition = CollectionEntry<"categories">["data"];

/**
 * Synchronous taxonomy ID sets for frontmatter schema validation.
 *
 * Content Collection reads are async, while Zod refinements in `postSchema`
 * need synchronous predicates.
 */
const tagIds = new Set(tags.map((tag) => tag.id));
const categoryIds = new Set(categories.map((category) => category.id));

/** Returns whether a value is a defined tag ID. */
export const isTagId = (value: string): boolean => tagIds.has(value);

/** Returns whether a value is a defined category ID. */
export const isCategoryId = (value: string): boolean => categoryIds.has(value);

/** Loads all tag definitions from the taxonomy collection. */
export const getTagDefinitions = async (): Promise<TagDefinition[]> =>
  (await getCollection("tags")).map((tag) => tag.data);

/** Loads all category definitions from the taxonomy collection. */
export const getCategoryDefinitions = async (): Promise<CategoryDefinition[]> =>
  (await getCollection("categories")).map((category) => category.data);

/**
 * Resolves a tag ID to its display label.
 *
 * Unknown IDs throw because normal post content should already be validated by
 * the frontmatter schema.
 */
export const getTagLabel = async (id: string): Promise<string> => {
  const tag = (await getCollection("tags", (tag) => tag.id === id)).at(0)?.data;
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
export const getCategoryLabel = async (id: string): Promise<string> => {
  const category = (
    await getCollection("categories", (category) => category.id === id)
  ).at(0)?.data;
  if (!category) {
    throw new Error(`Unknown category id: "${id}".`);
  }

  return category.label;
};
