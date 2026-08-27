import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: '序栈',
    meta: {
      description: '个人技术博客与知识库，记录全栈开发、云原生、系统架构与工程实践心得。',
      viewport: 'width=device-width, initial-scale=1.0',
    },
    favicon: './public/favicon.svg',
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/misans-webfont/misans-style.css',
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.md$/,
            type: 'asset/source',
          },
        ],
      },
    },
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
});
