import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Perimsx / 序栈 — 纸质极简个人书写与安全技术博客',
    meta: {
      description: '信息安全专业学生的个人数字书写空间与安全研究笔记。',
      viewport: 'width=device-width, initial-scale=1.0',
    },
    favicon: './public/favicon.svg',
  },
  source: {
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
