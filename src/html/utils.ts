// Utility functions for generating HTML tags.

// this works but theres something wrong with the type configuration
// @ts-nocheck

import { PageSyntax, HtmlAttributes } from "../types/html";
import { escapeHTML } from "bun";

/**
 * Construct a meta tag with a name and content.
 */
const meta = (key: string, value: string): PageSyntax => {
  return ["meta", { name: key, content: value }];
};

/**
 * Construct a meta property tag.
 */
const prop = (key: string, value: string): PageSyntax => {
  return ["meta", { property: key, content: value }];
};

/**
 * Construct a script tags with provided options.
 */
const script = (src: string, opts?: HtmlAttributes): PageSyntax => {
  return ["script", { src, id: src, type: "module", ...opts }];
};

/**
 * Construct a style tag with provided options and an optional body.
 */
const css = (src: string, opts?: HtmlAttributes, body?: string) => {
  return [
    "link",
    { rel: "stylesheet", type: "text/css", href: src, id: src, ...opts },
    body,
  ];
};

/**
 * Provided an icon directory, configure page icons of the front matter.
 */
const favicons = (iconDir: string) => {
  return [
    [
      "link",
      { rel: "icon", type: "image/x-icon", href: iconDir + "/favicon.ico" },
    ],
    [
      "link",
      { rel: "apple-touch-icon", href: iconDir + "/apple-touch-icon.png" },
    ],
  ];
};

/**
 * Configure the page color scheme.
 */
const colorScheme = (
  schemeName: string,
  backgroundColor: string
): PageSyntax => {
  return [
    "meta",
    {
      name: "theme-color",
      media: `(prefers-color-scheme: ${schemeName})`,
      content: backgroundColor,
    },
  ];
};

/**
 * Configure the color theme of this particular site. (hardcoded.)
 */
const theme = (): PageSyntax[] => {
  return [colorScheme("light", "white"), colorScheme("dark", "#111")];
};

/**
 * Generate open graph headers for this website
 * @param title the title of this specific page.
 * @param rootUrl the root URL that the site will be hosted on
 * @param siteName the name of the website as a whole.
 */
const openGraphHeaders = ({
  title,
  rootUrl,
  siteName = title,
}: {
  title: string;
  rootUrl: string;
  siteName?: string;
}): PageSyntax[] => {
  return [
    prop("og:title", title),
    prop("og:type", "website"),
    prop("og:url", rootUrl),
    prop("og:site_name", siteName),
  ];
};

// header we can use for every page
const header = ({
  title,
  rootUrl,
  siteName,
  resourcesDir: maybeResource,
  faviconsDir: maybeFaviconsDir,
}): PageSyntax => {
  const resourcesDir = maybeResource ?? "/resources";
  const faviconsDir = maybeFaviconsDir ?? resourcesDir + "/favicon";

  return [
    "head",
    ["meta", { charset: "utf-8" }],
    ["title", `${title} / ${siteName}`],
    ...openGraphHeaders({ title, rootUrl, siteName }),
    meta("keywords", "jake"),
    meta("author", "Jake Chvatal"),
    meta("robots", "index,follow"),
    meta("description", "hi"),
    ...theme(),
    ...(resourcesDir ? favicons(faviconsDir) : []),
    css("/resources/style.css"),
    css("/resources/global.css"),
    script("/resources/lib.js"),
    css("/resources/elements.css"),
    // TODO: generate manifest.
    ["link", { rel: "manifest", href: "/resources/manifest.json" }],

    css(
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/nord.min.css",
      { id: "dark-theme-highlight" }
    ),
    css(
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-light.min.css",
      { id: "light-theme-highlight" }
    ),
    script("https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js"),

    script("/resources/elements.js", { defer: true }),
  ];
};

/**
 * Excape things from HTML strings to avoid rendering them in the browser.
 * Forwarded from the 'bun' implementation.
 */
const escapeHtml = (text: string) => {
  return escapeHTML(text);
};

export { header, escapeHtml };
