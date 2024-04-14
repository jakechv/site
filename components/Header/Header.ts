import { PageSyntax, HtmlAttributes } from "../../src/types/html";

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
  targetDir,
  rootUrl,
  siteName,
  resourcesDir,
  faviconsDir,
}): PageSyntax => {
  console.log(resourcesDir, faviconsDir);
  return [
    "head",
    ["meta", { charset: "utf-8" }],
    ["title", `${title} / ${siteName}`],
    openGraphHeaders({ title, rootUrl, siteName }),
    meta("keywords", "jake"),
    meta("author", "Jake Chvatal"),
    meta("robots", "index,follow"),
    meta("description", "hi"),
    theme(),
    favicons(faviconsDir),
    // TODO: generate manifest.
    // ["link", { rel: "manifest", href: "/resources/manifest.json" }],
  ];
};

const Header = (args) => ({
  dependsOn: [
    { src: "/resources/style.css" },
    { src: "/resources/global.css" },
    { src: "/resources/elementsstyle.css" },
    { src: "/resources/lib.js" },
    { src: "/resources/elements.js", defer: true },
  ],
  body: header(args),
});

export default Header;
