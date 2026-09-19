import fs from 'node:fs';
import path from 'node:path';

const distIndex = path.resolve('dist/index.html');
const dist404 = path.resolve('dist/404.html');

if (fs.existsSync(distIndex)) {
  let html = fs.readFileSync(distIndex, 'utf-8');
  if (!html.includes('lang=')) {
    html = html.replace(/<html(?=[\s>])/i, '<html lang="zh-CN"');
    fs.writeFileSync(distIndex, html, 'utf-8');
    console.log('[post-build] Injected lang="zh-CN" into dist/index.html');
  }
  fs.copyFileSync(distIndex, dist404);
  console.log('[post-build] Generated dist/404.html for SPA static hosting fallback.');
}
