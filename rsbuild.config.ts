import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: '序栈',
    meta: {
      description: '用理性梳理日常，用技术温柔时光',
      viewport: 'width=device-width, initial-scale=1.0',
      'og:image': 'https://chenv.cn/avatar-full.jpg',
      'og:type': 'website',
      'twitter:image': 'https://chenv.cn/avatar-full.jpg',
      'twitter:card': 'summary_large_image',
    },
    favicon: './public/favicon.ico',
    tags: [
      {
        tag: 'script',
        children: `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;var loaded=false;function loadAnalytics(){if(loaded)return;loaded=true;try{(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TL7V3JC5');var ga=document.createElement('script');ga.async=true;ga.src='https://www.googletagmanager.com/gtag/js?id=G-73FXC49GB4';document.head.appendChild(ga);gtag('js',new Date());gtag('config','G-73FXC49GB4');(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","ybjuygdar5");}catch(e){console.warn('analytics init error',e);}}if('requestIdleCallback' in window){window.addEventListener('load',function(){requestIdleCallback(function(){setTimeout(loadAnalytics,1500);},{timeout:3000});});}else{window.addEventListener('load',function(){setTimeout(loadAnalytics,2000);});}['touchstart','scroll','pointerdown'].forEach(function(evt){window.addEventListener(evt,loadAnalytics,{once:true,passive:true});});})();`,
      },
      {
        tag: 'noscript',
        children: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TL7V3JC5" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
        head: false,
        append: false,
      },
      {
        tag: 'link',
        attrs: {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'preconnect',
          href: 'https://cdn.jsdelivr.net',
          crossorigin: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'preconnect',
          href: 'https://q1.qlogo.cn',
          crossorigin: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/misans-webfont/misans/misans-regular/result.css',
          media: 'print',
          onload: "this.media='all'",
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/misans-webfont/misans/misans-bold/result.css',
          media: 'print',
          onload: "this.media='all'",
        },
      },
      {
        tag: 'noscript',
        children:
          '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/misans-webfont/misans/misans-regular/result.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/misans-webfont/misans/misans-bold/result.css">',
        append: true,
      },
      {
        tag: 'link',
        attrs: {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: '序栈 - RSS 订阅源',
          href: '/feed.xml',
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
