import { defineConfig } from "tinacms";
import { CATEGORIES } from "../src/constants";

const requireEnv = (name: "NEXT_PUBLIC_TINA_CLIENT_ID" | "TINA_TOKEN") => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to build TinaCMS`);
  }

  return value;
};

/**
 * Keeps new posts in the existing `<folder>/index.md` layout.
 *
 * The URL is driven by frontmatter `id`, so filenames only need to stay
 * readable and stable for repository maintenance.
 */
const slugifyPostPath = (value?: string): string => {
  const slug =
    value
      ?.toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[-\s]+/g, "-")
      .replace(/^[-_]+|[-_]+$/g, "") ?? "";

  return `${slug || `draft-${Date.now()}`}/index`;
};

export default defineConfig({
  branch: "master",
  clientId: requireEnv("NEXT_PUBLIC_TINA_CLIENT_ID"),
  token: requireEnv("TINA_TOKEN"),
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      // Keep media co-located with content so existing relative references
      // remain valid in this repository.
      publicFolder: "src/content/posts",
      mediaRoot: "",
    },
  },
  schema: {
    collections: [
      {
        label: "Posts",
        name: "post",
        path: "src/content/posts",
        format: "md",
        match: {
          include: "**/index",
        },
        defaultItem: () => ({
          categories: ["tech"],
          created: new Date().toISOString(),
          description: "-",
          draft: true,
          postId: globalThis.crypto.randomUUID(),
          tags: [],
          title: "Untitled",
        }),
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => slugifyPostPath(values?.title),
          },
          router: ({ document }) =>
            typeof (document as { postId?: string } | undefined)?.postId ===
            "string"
              ? `/posts/${(document as unknown as { postId: string }).postId}`
              : undefined,
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "datetime",
            name: "created",
            label: "Created",
            required: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
          {
            type: "string",
            name: "postId",
            nameOverride: "id",
            label: "ID",
            required: true,
            ui: {
              description:
                "Public post identifier used in the `/posts/...` URL.",
            },
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            list: true,
            required: true,
            options: CATEGORIES.map((category) => ({
              label: category.label,
              value: category.id,
            })),
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
