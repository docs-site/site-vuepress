import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/portfolio",
  "/sdocs/",
  {
    text: "参考文档",
    icon: "book",
    children: [
		{ text: "VuePress", icon: "emojione-v1:document", link: "https://vuepress.vuejs.org/zh/" },
		{ text: "theme-hope", icon: "emojione-v1:document", link: "https://theme-hope.vuejs.press/zh/" }
	]
  },
// 下面是原来的实例
//   "/demo/",
//   {
//     text: "指南",
//     icon: "lightbulb",
//     prefix: "/guide/",
//     children: [
//       {
//         text: "Bar",
//         icon: "lightbulb",
//         prefix: "bar/",
//         children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
//       },
//       {
//         text: "Foo",
//         icon: "lightbulb",
//         prefix: "foo/",
//         children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
//       },
//     ],
//   },
//   {
//     text: "V2 文档",
//     icon: "book",
//     link: "https://theme-hope.vuejs.press/zh/",
//   },
]);
