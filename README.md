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

### <font size=3>2.2 常用命令</font>

命令其实都定义在 `package.json`中：

```json
{
    "scripts": {
        "docs:build": "vuepress-vite build src",
        "docs:clean-dev": "vuepress-vite dev src --clean-cache",
        "docs:dev": "vuepress-vite dev src",
        "docs:update-package": "pnpm dlx vp-update"
    },
}
```

常用的就是这几个命令：

```shell
pnpm docs:dev       # 启动开发服务器
pnpm docs:build     # 构建项目并输出
pnpm docs:clean-dev # 清除缓存并启动开发服务器
```

### <font size=3>2.3 更新版本</font>

要升级主题和 VuePress 版本，可以执行以下命令:

```shell
pnpm dlx vp-update
```

### <font size=3>2.4 项目结构</font>

```shell
.
├── .github (可选的)           # → GitHub 配置文件存放路径
│    └── workflow             # → GitHub 工作流配置
│         └── docs-deploy.yml # → 自动部署文档的工作流
├── src                       # → 文档文件夹
│    ├── .vuepress (可选的)    # → VuePress 配置文件夹
│    │    ├── dist (默认的)    # → 构建输出目录
│    │    ├── public (可选的)  # → 静态资源目录
│    │    ├── styles (可选的)  # → 用于存放样式相关的文件
│    │    ├── config.{js,ts} (可选的) # → 配置文件的入口文件
│    │    └── client.{js,ts} (可选的) # → 客户端文件
│    ├── ...                  # → 其他项目文档
│    └── README.md            # → 项目主页
└── package.json              # → Nodejs 配置文件
```

## <font size=3>3. 部署</font>

### <font size=3>3.1 工作流文件</font>

在初始化站点的时候，有让选择 【是否需要一个自动部署文档到 GitHub Pages 的工作流？】当时选择是的话，就会自动生成 `.github/workflows/deploy-docs.yml` 文件：

```shell
name: 部署文档

on:
  push:
    branches:
      - master # 或者 main，根据默认分支名称决定

permissions:   # 设置权限, 允许 GitHub Actions 写入仓库内容
  contents: write

jobs:
  deploy-gh-pages:          # 定义一个名为 deploy-gh-pages 的作业
    runs-on: ubuntu-latest  # 在最新的 Ubuntu 环境中运行
    steps:
      - name: Checkout      # 检出仓库代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          # 如果文档需要 Git 子模块，取消注释下一行
          # submodules: true

      - name: 设置 pnpm
        uses: pnpm/action-setup@v4

      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm       # 使用 pnpm 缓存依赖

      - name: 安装依赖
        run: |
          corepack enable                # 启用 corepack
          pnpm install --frozen-lockfile # 安装依赖，使用锁文件确保一致性

      - name: 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192 # 设置 Node.js 内存限制
        run: |-
          pnpm run docs:build
          > src/.vuepress/dist/.nojekyll

      - name: 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 部署文档
          branch: gh-pages
          folder: src/.vuepress/dist

```

要是没有选择创建的话可以自己创建一个，要注意一下生成的分支和自己推送的分支。

### <font size=3>3.2 仓库配置</font>

上传了上面的`.github/workflows/deploy-docs.yml`到Github仓库后，在我们推送到master分支的时候会自动触发Github Actions，工作流完成后，会把Github Actions服务器中生成的`docs/.vuepress/dist` 目录中构建生成的静态文件推送到当前仓库的 `gh-pages` 分支：

![image-20250605222730513](README/img/image-20250605222730513.png)

这个时候部署出来的页面是异常的，我们还需要设置以下仓库部署的分支：

![image-20250605223142965](README/img/image-20250605223142965.png)

配置完后就会自动触发部署页面的工作流：

![image-20250605222910146](README/img/image-20250605222910146.png)

这个时候会发现还是有问题（页面资源有问题），我们还需要修改，怎么修改？原因在于配置中的base，我们部署的路径为

```shell
https://vscode-devs.github.io/VS-Code-Extension-Doc/
```

所以config.ts中的base应该配置为`/VS-Code-Extension-Doc/`：

```ts
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/site-vuepress/",

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

> - [主页 | vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)
> - [首页 | VuePress](https://vuepress.vuejs.org/zh/)

# <font size=3>二、小徽章</font>

>- [badgen.net](https://badgen.net/)
>- [Shields.io | Shields.io](https://shields.io/)
>- [For the Badge](https://forthebadge.com/)

