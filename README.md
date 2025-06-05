# <font size=3>一、site-vuepress</font>

## <font size=3>1. 开发环境</font>

[![Static Badge](https://img.shields.io/badge/author-%E8%8B%8F%E6%9C%A8-blue?style=for-the-badge)](https://sumumm.github.io/)&nbsp;&nbsp;&nbsp;&nbsp;[![Static Badge](https://img.shields.io/badge/GITHUB-sumumm-blue?style=for-the-badge&logo=github)](https://github.com/sumumm)&nbsp;&nbsp;&nbsp;&nbsp;[![Static Badge](https://img.shields.io/badge/NPM-sumumm-blue?style=for-the-badge&logo=npm&logoSize=3&labelColor=%23CB3837)](https://www.npmjs.com/~sumumm)

[![node](https://badgen.net/static/node/v22.16.0/F96854)](https://nodejs.org/dist/v22.16.0/node-v22.16.0-win-x64.zip)&nbsp;&nbsp;&nbsp;&nbsp;[![npm](https://badgen.net/static/npm/10.9.2/F96854)](https://badgen.net/static/npm/10.9.2/F96854)&nbsp;&nbsp;&nbsp;&nbsp;[![pnpm](https://badgen.net/static/pnpm/10.11.1/F96854)](https://github.com/pnpm/pnpm)&nbsp;&nbsp;&nbsp;&nbsp;[![vuepress](https://badgen.net/static/vuepress/2.0.0-rc.23/cyan)](https://github.com/vuepress/core/releases/tag/v2.0.0-rc.23)&nbsp;&nbsp;&nbsp;&nbsp;[![vuepress-theme-hope](https://badgen.net/static/vuepress-theme-hope/2.0.0-rc.92/cyan)](https://github.com/vuepress-theme-hope/vuepress-theme-hope/releases/tag/v2.0.0-rc.92)

## <font size=3>2. 建立站点</font>

### <font size=3>2.1 初始化</font>

推荐使用 pnpm 作为项目管理器，因为 VuePress 和 VuePress Theme Hope 都是通过 pnpm 来管理依赖的：

```shell
corepack enable                       # 启用 corepack 
npm install pnpm -g                   # 全局安装pnpm
pnpm create vuepress-theme-hope <dir> # 安装 vuepress-theme-hope
```

通过这个命令可以直接建立hope主题的vuepress站点，在创建过程中会有一些交互的内容需要填写，按提示进行填写就可以了。

### <font size=3>2.2 本地预览</font>

```shell
npm run docs:dev
```

然后会看到以下输出：

```shell
D:\sumu_blog\VS-Code-Extension-Doc\test [master ≡ +1 ~1 -0 !]> npm run docs:dev

> vuepress-theme-hope-template@2.0.0 docs:dev
> vuepress-vite dev src

✔ Initializing and preparing data - done in 291ms

  vite v6.3.5 dev server running at:

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.136.1:8080/
  ➜  Network: http://192.168.81.1:8080/
  ➜  Network: http://192.168.43.32:8080/
```

我们本地打开这里的几个地址都可以。

## <font size=3>3. 部署</font>

### <font size=3>3.1 创建工作流文件</font>

在初始化站点的时候，有让选择 【是否需要一个自动部署文档到 GitHub Pages 的工作流？】当时选择是的话，就会自动生成 `.github/workflows/deploy-docs.yml` 文件：

```shell

name: 部署文档

on:
  push:
    branches:
      - master

permissions:
  contents: write

jobs:
  deploy-gh-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          # 如果你文档需要 Git 子模块，取消注释下一行
          # submodules: true



      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: 安装依赖
        run: |
          corepack enable
          npm ci

      - name: 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        run: |-
          npm run docs:build
          > src/.vuepress/dist/.nojekyll

      - name: 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 部署文档
          branch: gh-pages
          folder: src/.vuepress/dist

```

要是没有选择创建的话可以自己创建一个，一样的。

### <font size=3>3.2 仓库配置</font>

上传了上面的`.github/workflows/deploy-docs.yml`到Github仓库后，在我们推送到master分支的时候会自动触发GithubActions，工作流完成后，会把GithubActions服务器中生成的`docs/.vuepress/dist` 目录中构建生成的静态文件推送到当前仓库的gh-pages分支：

<img src="README/img/image-20250601120614829.png" alt="image-20250601120614829" />

这个时候部署出来的页面是异常的，我们还需要设置以下仓库部署的分支：

<img src="README/img/image-20250601120528355.png" alt="image-20250601120528355" />

这个时候会发现还是有问题（页面资源有问题），我们还需要修改，怎么修改？原因在于配置中的base，我们部署的路径为

```shell
https://vscode-devs.github.io/VS-Code-Extension-Doc/
```

所以config.ts中的base应该配置为`/VS-Code-Extension-Doc/`：

```ts
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/VS-Code-Extension-Doc/",

  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});

```

然后就正常了。

## <font size=3>4. 参考资料</font>

### <font size=3>4.1 扩展开发文档</font>

> - [VS Code插件开发文档-中文版](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/)
> - [扩展 API | Visual Studio Code 扩展 API](https://vscode.js.cn/api)

### <font size=3>4.2 VuePress文档</font>

> - [主页 | vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)
> - [首页 | VuePress](https://vuepress.vuejs.org/zh/)

# <font size=3>二、小徽章</font>

>- [badgen.net](https://badgen.net/)
>- [Shields.io | Shields.io](https://shields.io/)
>- [For the Badge](https://forthebadge.com/)

