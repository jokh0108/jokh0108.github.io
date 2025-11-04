import type { Site, Page, Links, Socials } from "@types";

// Global
export const SITE: Site = {
  TITLE: "참참다랑어의 블로그",
  DESCRIPTION:
    "Welcome to Astro Sphere, a portfolio and blog for designers and developers.",
  AUTHOR: "Kyungho Jo",
};

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
};

// Blog Page
export const BLOG: Page = {
  TITLE: "블로그",
  DESCRIPTION: "",
};

// Projects Page
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
};

// Links
export const LINKS: Links = [
  {
    TEXT: "홈",
    HREF: "/",
  },
  // {
  //   TEXT: "Work",
  //   HREF: "/work",
  // },
  {
    TEXT: "블로그",
    HREF: "/blog",
  },
  // {
  //   TEXT: "Projects",
  //   HREF: "/projects",
  // },
];

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "jokh0108@gmail.com",
    HREF: "mailto:jokh0108@gmail.com",
  },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "jokh0108",
    HREF: "https://github.com/jokh0108",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "jokh0108",
    HREF: "https://www.linkedin.com/in/jokh0108/",
  },
  // {
  //   NAME: "Twitter",
  //   ICON: "twitter-x",
  //   TEXT: "markhorn_dev",
  //   HREF: "https://twitter.com/markhorn_dev",
  // },
];
