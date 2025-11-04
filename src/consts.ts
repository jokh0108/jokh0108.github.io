import type { Site, Page, Links, Socials } from "@types";

// Global
export const SITE: Site = {
  TITLE: "참참다랑어의 블로그",
  DESCRIPTION: "디자이너와 개발자를 위한 포트폴리오와 블로그",
  AUTHOR: "Kyungho Jo",
};

// Work Page
export const WORK: Page = {
  TITLE: "경력",
  DESCRIPTION: "제가 근무했던 곳들",
};

// Blog Page
export const BLOG: Page = {
  TITLE: "블로그",
  DESCRIPTION: "",
};

// Projects Page
export const PROJECTS: Page = {
  TITLE: "프로젝트",
  DESCRIPTION: "최근 작업한 프로젝트들",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "검색",
  DESCRIPTION: "키워드로 모든 포스트와 프로젝트 검색",
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
