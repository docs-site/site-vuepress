import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/site-vuepress/",

  lang: "zh-CN",
  title: "苏木",
  description: "苏木的 VuePress Site 模板",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
