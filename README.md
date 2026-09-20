<div align="center">

# 序栈 · Chenv.cn

<p><strong>用理性梳理日常，用技术温柔时光</strong></p>
<p>基于 React 19 与 Rsbuild 构建的高性能出版级数字花园、个人履历与全栈技术知识库。</p>

<p>
  <a href="https://chenv.cn" target="_blank"><img src="https://img.shields.io/badge/Website-chenv.cn-0284c7?style=flat-square&logo=googlechrome&logoColor=white" alt="Website" /></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://rsbuild.dev" target="_blank"><img src="https://img.shields.io/badge/Rsbuild-Rspack-f97316?style=flat-square&logo=rust&logoColor=white" alt="Rsbuild" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="License MIT" /></a>
</p>

</div>

---

## 关联生态

- **主站（数字花园）**：[https://chenv.cn](https://chenv.cn)
- **知识库**：[https://wiki.chenv.cn](https://wiki.chenv.cn)
- **简历**：[https://cv.chenv.cn](https://cv.chenv.cn)
- **开源仓库**：[https://github.com/kerntau/chenv](https://github.com/kerntau/chenv)
- **联系邮箱**：[i@chenv.cn](mailto:i@chenv.cn)

---

## 核心设计理念

1. **出版级阅读体验**
   - 默认中文字体栈深度调优（内置小米 MiSans 全字阶支持），搭配严谨的版式行距与留白呼吸感；
   - 浅色模式为温润素雅的“纸墨质感”，深色模式为通透深邃的“极客终端质感”，支持系统跟随与轻量药丸无缝切换。

2. **亚毫秒级冷启动与动态分包**
   - 采用字节跳动基于 Rust 的下一代构建工具 **Rsbuild (Rspack)**，毫秒级冷启动与热重载；
   - 架构创新：列表页与全文检索仅加载轻量元数据索引（`content-index.json`），正文按需延迟拉取对应 Markdown 代码块，首屏零冗余。

3. **学术级富文本渲染管线**
   - **语法高亮**：Shiki 驱动的 AST 语法高亮，双模式配色智能适配；
   - **物理公式**：KaTeX 原生矢量渲染，支持复杂数学与物理排版；
   - **架构拓扑**：动态集成 Mermaid 图表，代码即架构图；
   - **乐谱支持**：abcjs 实时五线谱渲染；
   - **真实技术栈徽章**：内置 `TechIcon` 官方彩色矢量图标库。

4. **隐私优先与极客沙箱**
   - 全静态化生产产物，无外部数据库或追踪探针强依赖；
   - 本地内嵌管理后台（`/admin`），物理级 IP 隔离（仅限 `localhost` / `127.0.0.1` 访问，生产环境自动 404 阻断）。

---

## 功能矩阵

| 模块         | 路径             | 核心特性                                                               |
| ------------ | ---------------- | ---------------------------------------------------------------------- |
| **首页看板** | `/`              | 个人名片、精选手记、全栈技术栈、实时说说流、全站数据指标概览           |
| **随笔手记** | `/diaries`       | Markdown 深度长文与手记随笔、分类筛选、字数/阅读时间估算               |
| **手记详情** | `/diaries/:slug` | 目录大纲（TOC）、代码复制、KaTeX、Mermaid、文末卷轴题跋                |
| **时光归档** | `/archives`      | 年谱时间轴、等宽年份节点微胶囊、羽化渐隐光轴、单/双轨切换              |
| **关于作者** | `/about`         | 高密度专业履历（CV）版式、官方彩色技术栈徽章流、深信服专业认证点列     |
| **日常说说** | `/says`          | 碎片化灵感速记、短动态生活流                                           |
| **志同道合** | `/friends`       | 友链大厅、卡片微交互、自动化链路健康度探测、规范化友链申请指南         |
| **站点地图** | `/sitemap`       | 全局结构化拓扑总览、直达入口索引                                       |
| **管理中台** | `/admin`         | 本地专用：文章/说说/友链可视化增删改查、草稿暂存、回收站、数据导入导出 |

---

## 技术架构

### 核心技术栈

| 分层         | 技术选型                                     | 版本  | 用途与说明                                                |
| ------------ | -------------------------------------------- | ----- | --------------------------------------------------------- |
| **核心框架** | [React](https://react.dev)                   | 19.0  | 现代前端视图渲染，并发模式与轻量组件模型                  |
| **开发语言** | [TypeScript](https://www.typescriptlang.org) | 5.8   | 全链路静态强类型约束                                      |
| **构建引擎** | [Rsbuild](https://rsbuild.dev)               | 1.2   | 基于 Rust Rspack 的次时代极速构建工具链                   |
| **路由系统** | [wouter](https://github.com/molefrog/wouter) | 3.6   | 仅 ~1.5KB 的极简轻量级 Hash/History 路由                  |
| **样式工程** | [Tailwind CSS](https://tailwindcss.com)      | 3.4   | 现代化原子化样式与 `@tailwindcss/typography` 深度排版插件 |
| **动效库**   | [GSAP](https://gsap.com)                     | 3.15  | 流畅平滑的微交互动画与滚动物理动效                        |
| **代码高亮** | [Shiki](https://shiki.style)                 | 3.1   | VS Code 同款 TextMate 语法高亮引擎，双模式自适应          |
| **公式渲染** | [KaTeX](https://katex.org)                   | 0.16  | 极速学术级数学公式渲染                                    |
| **图表渲染** | [Mermaid](https://mermaid.js.org)            | 11.4  | 纯文本驱动的流程图、时序图与架构拓扑渲染                  |
| **乐谱排版** | [abcjs](https://paulrosen.github.io/abcjs/)  | 6.4   | 纯前端动态五线谱乐谱渲染引擎                              |
| **本地检索** | [Fuse.js](https://www.fusejs.io)             | 7.1   | 轻量级客户端模糊全文搜索                                  |
| **图标体系** | Lucide React + TechIcon                      | 1.16+ | 现代化通用图标 + 深度定制全栈官方真实彩色矢量图标         |

### 内容索引与按需加载流水线

```text
[src/content/diaries/*.md]
           │
           ▼ (node scripts/generate-content-index.mjs)
┌──────────────────────────────────────┐
│  元数据剥离 (gray-matter AST 分析)    │
└──────────────────┬───────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[content-index.json]   [content-loaders.ts]
 (全局元数据清单, 供    (动态 import() 代码块,
  列表/归档/检索使用)     进入正文详情时按需拉取)
```

---

## 目录结构

```text
chent/
├── public/                 # 静态托管根目录（图标、字体、covers 封面、xml 等）
│   ├── feed.xml            # Atom 订阅源
│   ├── rss.xml             # RSS 2.0 订阅源
│   └── sitemap.xml         # 站点地图协议文件
├── scripts/                # 自动化工程构建与工具脚本
│   ├── detect-friends.mjs  # 自动化友链健康可达性探测
│   ├── generate-article-covers.mjs # 自动化生成文章封面 SVG
│   ├── generate-content-index.mjs  # Markdown 元数据索引与 loader 生成器
│   ├── generate-rss.mjs    # RSS/Atom 订阅源自动生成器
│   ├── generate-sitemap.mjs# Sitemap 静态生成器
│   └── post-build.mjs      # 构建后处理（lang 注入与 404 SPA 回退保障）
├── src/
│   ├── components/         # 组件体系
│   │   ├── admin/          # 本地管理后台组件群
│   │   ├── layout/         # 骨架布局（Header、Footer、PageEpigraph 题跋等）
│   │   ├── post/           # 文章与手记渲染器（目录、代码块、KaTeX 等）
│   │   ├── says/           # 说说卡片与时间流组件
│   │   └── ui/             # 基础交互原子（TechIcon、ClickSpark、弹窗等）
│   ├── content/            # 内容数据源
│   │   ├── config/         # 站点全局配置文件（site.config.json）
│   │   ├── diaries/        # Markdown 随笔与长文原稿
│   │   ├── generated/      # 构建期自动化生成（严禁手动修改）
│   │   ├── pages/          # 友链等静态结构数据
│   │   └── records/        # 说说动态与时光片段（records.json）
│   ├── hooks/              # 自定义 React Hooks（主题、媒体查询、滚动监听等）
│   ├── pages/              # 页面入口组件（Home, Diaries, Archives, About 等）
│   ├── styles/             # 样式文件（index.css, 字体声明, 自定义工具类）
│   ├── types/              # TypeScript 全局强类型定义
│   ├── App.tsx             # 路由配置与全局上下文注入入口
│   └── index.tsx           # React 19 应用渲染引导文件
├── rsbuild.config.ts       # Rsbuild (Rspack) 构建配置
├── tailwind.config.ts      # Tailwind CSS 设计系统配置
├── tsconfig.json           # TypeScript 严格编译规则
└── package.json            # 依赖声明与自动化指令集合
```

---

## 快速开始

### 1. 环境准备

- 推荐运行时环境：**Node.js >= 18.18.0**
- 推荐包管理器：**pnpm >= 9.0**（亦支持 npm 或 yarn）

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 启动本地开发

```bash
pnpm dev
# 或
npm run dev
```

启动后会自动执行内容索引构建，本地开发服务器将运行在：  
👉 **http://localhost:3000**

---

## 常用开发指令

| 指令                          | 说明                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm dev`                    | 启动本地极速开发热重载服务器（自动生成内容索引）                                               |
| `pnpm build`                  | 全量静态生产构建（类型校验 → 索引生成 → 站点地图 → RSS 生成 → Rspack 打包 → SPA 404 回退注入） |
| `pnpm preview`                | 预览本地生产构建产物（`dist/` 目录）                                                           |
| `pnpm typecheck`              | 执行 TypeScript 静态类型严谨检查（`tsc --noEmit`）                                             |
| `pnpm lint`                   | 执行 ESLint 静态代码风格与安全规则检查                                                         |
| `pnpm format`                 | 使用 Prettier 自动化格式化项目全部源码与配置                                                   |
| `pnpm generate:content-index` | 手动触发生成正文索引 `content-index.json` 与动态代码拆分 `loaders`                             |
| `pnpm generate:sitemap`       | 手动根据当前内容生成最新的 `sitemap.xml`                                                       |
| `pnpm generate:rss`           | 手动生成标准的 `rss.xml` 与 `feed.xml`                                                         |
| `pnpm detect:friends`         | 对 `friends.json` 中配置的友链执行并发 HTTP 可达性健康探测                                     |
| `pnpm generate:covers`        | 批量生成文章默认 SVG 封面图                                                                    |

---

## 本地管理后台（Admin）

为了在纯静态架构下享受 CMS 级的写作体验，系统内置了本地可视化管理后台：

- **访问地址**：`http://localhost:3000/admin`
- **安全沙箱**：仅在本地环境（`localhost` 或 `127.0.0.1`）激活；线上部署环境自动阻断并返回 404 页面，杜绝安全与越权风险。
- **管理能力**：
  - 手记发布、修改、分类与标签关联；
  - 说说日常动态快速录入与时光片段流管理；
  - 友链增删改查与实时可达性检测；
  - 站点核心参数可视化配置（`site.config.json`）；
  - 草稿暂存箱与误删回收站；
  - 数据全量 JSON 导入与离线备份导出。

---

## 静态部署指南

由于项目采用纯静态生产构建与 Client-Side SPA 路由，构建产物可直接零成本部署至全球各大静态边缘网络：

- **输出目录**：`dist/`

### 常见平台适配

1. **Cloudflare Pages**：
   - 构建命令：`pnpm build`
   - 构建输出目录：`dist`
2. **Vercel**：
   - Framework Preset：`Other`
   - Build Command：`pnpm build`
   - Output Directory：`dist`
3. **Nginx / 自建静态托管**：
   - 需配置前端单页应用（SPA）重定向规则，将非静态文件请求回退至 `index.html`：
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
   _(注：构建流程中的 `post-build.mjs` 已自动在 `dist/` 下生成 `404.html`，可在 GitHub Pages 等服务中直接作为回退页面使用。)_

---

## 许可证

本项目基于 [MIT License](./LICENSE) 协议开源。欢迎自由学习、交流与派生。

Copyright (c) 2026 **kerntau**. All rights reserved.
