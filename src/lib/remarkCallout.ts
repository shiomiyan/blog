import type { Blockquote, Paragraph, Root, RootContent, Text } from "mdast";
import type { Plugin } from "unified";

const alertPattern =
  /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)(?:\/([^\]]+))?\]/i;

const alertTitles = {
  caution: "Caution",
  important: "Important",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
} as const;

type AlertType = keyof typeof alertTitles;

type AlertMarker = {
  title: string;
  type: AlertType;
};

const isAlertType = (value: string): value is AlertType =>
  Object.hasOwn(alertTitles, value);

const isText = (node: RootContent | undefined): node is Text =>
  node?.type === "text";

const trimOpeningBreak = (
  children: Paragraph["children"],
): Paragraph["children"] => {
  if (children[0]?.type === "break") {
    return children.slice(1);
  }

  return children;
};

const getAlertTitle = (type: AlertType, customTitle: string | undefined) =>
  customTitle?.trim() || alertTitles[type];

const parseAlertMarker = (node: RootContent): AlertMarker | undefined => {
  if (node.type !== "paragraph") {
    return undefined;
  }

  const firstChild = node.children?.[0];
  if (!isText(firstChild) || !firstChild.value) {
    return undefined;
  }

  const match = firstChild.value.match(alertPattern);
  const type = match?.[1]?.toLowerCase();
  if (!match || !type || !isAlertType(type)) {
    return undefined;
  }

  const value = firstChild.value.replace(alertPattern, "").replace(/^\n+/, "");
  if (value.length > 0) {
    firstChild.value = value;
  } else {
    node.children = trimOpeningBreak(node.children?.slice(1) ?? []);
  }

  return {
    title: getAlertTitle(type, match[2]),
    type,
  };
};

const prependAlertTitle = (
  node: Blockquote,
  type: AlertType,
  title: string,
) => {
  const children = node.children;
  const firstChild = children[0];
  const contentChildren =
    firstChild?.type === "paragraph" && firstChild.children?.length === 0
      ? children.slice(1)
      : children;

  node.children = [
    {
      children: [{ type: "text", value: title }],
      data: {
        hProperties: {
          className: ["admonition-title", "markdown-alert-title"],
          dir: "auto",
        },
      },
      type: "paragraph",
    },
    ...contentChildren,
  ];

  node.data = {
    hName: "div",
    hProperties: {
      className: ["admonition", type, "markdown-alert", `markdown-alert-${type}`],
      dir: "auto",
    },
  };
};

const transformAlerts = (node: Root | RootContent) => {
  if (node.type === "blockquote") {
    const firstChild = node.children?.[0];
    const alert = firstChild ? parseAlertMarker(firstChild) : undefined;
    if (alert) {
      prependAlertTitle(node, alert.type, alert.title);
    }
  }

  if ("children" in node) {
    node.children.forEach(transformAlerts);
  }
};

/**
 * Render GFM callout blockquotes as styled HTML.
 *
 * This keeps the GitHub-flavored authoring syntax while letting the site own
 * the generated markup and CSS classes.
 */
const remarkGithubAlerts: Plugin<[], Root> = () => {
  return (tree) => {
    transformAlerts(tree);
  };
};

export default remarkGithubAlerts;
