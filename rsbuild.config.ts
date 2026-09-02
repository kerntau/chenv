import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: '序栈',
    meta: {
      description: '心中有景，花香满径。',
      viewport: 'width=device-width, initial-scale=1.0',
      'og:image': 'https://chent.co/avatar.webp',
      'og:type': 'website',
      'twitter:image': 'https://chent.co/avatar.webp',
      'twitter:card': 'summary_large_image',
    },
    favicon: './public/favicon.svg',
    tags: [
      {
        tag: 'script',
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TL7V3JC5');`,
        append: false,
      },
      {
        tag: 'noscript',
        children: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TL7V3JC5" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
        head: false,
        append: false,
      },
      {
        tag: 'script',
        attrs: {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-73FXC49GB4',
        },
      },
      {
        tag: 'script',
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-73FXC49GB4');`,
      },
      {
        tag: 'script',
        children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","ybjuygdar5");`,
      },
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
