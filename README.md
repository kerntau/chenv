<div align="center">

# 序栈 · CHENV

**出版级数字花园、个人履历与全栈技术知识库。**<br>
*A publication-grade digital garden and personal knowledge system.*

[![GitHub](https://img.shields.io/badge/GitHub-kerntau%2Fchenv-181717?style=for-the-badge&logo=github)](https://github.com/kerntau/chenv)
[![Website](https://img.shields.io/badge/Website-chenv.cn-0284C7?style=for-the-badge&logo=googlechrome&logoColor=ffffff)](https://chenv.cn)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)](https://react.dev)
[![Rsbuild](https://img.shields.io/badge/Rsbuild-Rspack-F97316?style=for-the-badge)](https://rsbuild.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org)

</div>

---

## 01. PROJECT PURPOSE // 项目定位

Chenv 是 React 19 + Rsbuild 的静态数字花园和履历站点，提供文章、手记、说说、友链、归档和本地管理后台。线上主站为 chenv.cn，简历入口为 cv.chenv.cn。

## 02. TECHNICAL ARCHITECTURE // 技术架构

~~~mermaid
graph TD
    A[src/content Markdown and JSON] --> B[generate-content-index]
    B --> C[metadata index and dynamic loaders]
    C --> D[React pages]
    D --> E[Rsbuild dist]
    E --> F[Static hosting]
    B --> G[sitemap and RSS generators]
    H[local /admin] --> I[Browser localStorage]
~~~

- 元数据索引服务列表、归档和搜索；正文按需动态加载。
- Shiki、KaTeX、Mermaid、abcjs 等增强渲染库按需使用。
- /admin 仅面向 localhost/127.0.0.1，数据默认保存在浏览器 localStorage。

## 03. TECHNICAL MATRIX // 技术矩阵

| 模块 | 选型 | 说明 |
| --- | --- | --- |
| UI | React 19 + TypeScript | 页面、组件和类型边界 |
| 构建 | Rsbuild/Rspack | 开发、生产构建和预览 |
| 样式 | Tailwind CSS 3 | 原子化样式和排版 |
| 内容 | Markdown + JSON + gray-matter | 文章、手记、友链和设置 |
| 渲染 | Shiki、KaTeX、Mermaid、abcjs | 代码、公式、图表和乐谱 |
| 部署 | 静态托管 | 输出 dist/，支持 SPA 回退 |

## 04. REPOSITORY TOPOLOGY // 源码工程拓扑

~~~text
.
├── src/content/              # diaries、records、pages 和站点配置
├── src/components/           # layout、post、admin、says 和 UI 组件
├── public/                   # 字体、封面、feed、RSS 和 sitemap
├── scripts/                  # 索引、RSS、sitemap、封面和友链工具
├── start-dev.bat             # Windows 开发启动
├── rsbuild.config.ts         # 构建配置
└── package.json              # 脚本与依赖
~~~

## 05. CLONE & QUICK START // 极速装配指南

环境要求：Node.js 18+；推荐 pnpm 10。

~~~bash
git clone https://github.com/kerntau/chenv.git
cd chenv
pnpm install
pnpm dev
~~~

默认开发地址为 http://localhost:3000。生产构建会自动更新索引、sitemap、RSS 和 404 回退文件。

## 06. DEPLOYMENT & VERIFICATION // 部署与验证

~~~bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
~~~

Vercel 使用 pnpm build 并输出 dist/；自建静态服务器需要将前端路由回退到 index.html。主站和 cv.chenv.cn 的域名绑定由部署平台配置。

## 07. ENGINEERING CONTRACT // 工程协作契约

- 内容修改后运行 pnpm generate:content-index。
- 不手工编辑生成索引、feed、RSS 和 sitemap。
- /admin 的 localStorage 数据不会自动写回仓库，发布前必须导出并提交源文件。
- 友链探测只处理公开地址，禁止提交凭据和私有内网地址。

## 08. ROADMAP // 系统演进路线

- [x] 元数据索引、按需加载、RSS 和 sitemap。
- [x] 本地管理后台与友链健康探测。
- [x] 文章封面和多格式内容渲染。
- [ ] 增加内容 schema 校验和链接报告。
- [ ] 完善可复现部署与预览文档。

## 09. LICENSE // 许可证

项目基于 MIT License，许可证文本见 LICENSE。
