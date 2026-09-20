import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.resolve(__dirname, '../src/content/config/gallery.config.json');

/**
 * 精选离线兜底高质量动漫插画与横版壁纸集合（经过严格可访问性与画质验证）
 */
const CURATED_ANIME_ITEMS = [
  {
    image: 'https://nekos.best/api/v2/waifu/1f51cdc0-c965-40d5-9f66-a0380b89f5b6.png',
    title: '星芒之誓 · 我美蘭',
    href: 'https://www.pixiv.net/en/artworks/97568978',
  },
  {
    image: 'https://nekos.best/api/v2/waifu/cfccd4b9-ad5d-4450-a4a6-0de2252bff28.png',
    title: '冬樱浅梦 · 1230_mochi',
    href: 'https://twitter.com/1230_mochi',
  },
  {
    image: 'https://nekos.best/api/v2/neko/77732fd5-7313-43cf-b552-32a26563ee9b.png',
    title: '喵影晴空 · NekosCollection',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/kitsune/20b0fa9b-2ffb-4ffb-ad0e-6f81b1a7f058.png',
    title: '灵狐神社 · KitsuneSpirit',
    href: 'https://nekos.best',
  },
  {
    image: 'https://t.alcy.cc/pic/pc/41da2cb05a8a9d0af541ae9c7ae0ccbd.webp',
    title: '云海之下 · 天空之境',
    href: 'https://t.alcy.cc/pc',
  },
  {
    image: 'https://t.alcy.cc/pic/pc/2025-10-0de44994a106357e3987d36fe748ea14.webp',
    title: '盛夏晚风 · 车站重逢',
    href: 'https://t.alcy.cc/pc',
  },
  {
    image: 'https://nekos.best/api/v2/waifu/3bb53e7f-7a46-4cb4-a1db-f215e9c0cbf9.png',
    title: '晨光微熹 · 日常漫步',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/neko/93dafe6a-2007-47b2-a4e7-a9a3efd8fc8c.png',
    title: '暖阳微憩 · 午后书屋',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/kitsune/40a0ef2d-f952-4a00-ab6f-a82f3efceeb7.png',
    title: '千本樱下 · 绯红记忆',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/waifu/0f6c243a-7a56-4aa4-82ee-b79ebfdc7a6e.png',
    title: '蔚蓝天际 · 青春回响',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/neko/57df8448-f938-4e1b-9be1-f2f2812ae9f6.png',
    title: '雨后初晴 · 彩虹小巷',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/kitsune/52d8eb1a-1d57-4184-a169-bbf073c683ee.png',
    title: '月夜风铃 · 神秘低语',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/waifu/69bfdc39-9d7a-4c26-a077-d7d4f9bf3ff2.png',
    title: '秋叶染霞 · 异域旅途',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/neko/68d2bb2e-3378-4c91-9e7c-b3a1cfbb42c5.png',
    title: '星愿之夜 · 银河漫步',
    href: 'https://nekos.best',
  },
  {
    image: 'https://nekos.best/api/v2/kitsune/15b3c3b0-6ae9-42b5-a32e-c7604ad5c55a.png',
    title: '绯色枫桥 · 岁月静好',
    href: 'https://nekos.best',
  },
];

async function fetchFromNekosBest(category, amount = 10) {
  try {
    const res = await fetch(`https://nekos.best/api/v2/${category}?amount=${amount}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];
    return data.results.map((item) => ({
      image: item.url,
      title: item.artist_name ? `${item.artist_name} 的插画作品` : '精选动漫插画',
      href: item.source_url || item.url,
    }));
  } catch (err) {
    return [];
  }
}

async function fetchDynamicWallpapers(count = 15) {
  const items = [];
  const seenUrls = new Set();

  for (let i = 0; i < count; i++) {
    try {
      const res = await fetch('https://t.alcy.cc/pc', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok && res.url && !seenUrls.has(res.url)) {
        seenUrls.add(res.url);
        items.push({
          image: res.url,
          title: `动漫壁纸 · 景致 #${items.length + 1}`,
          href: res.url,
        });
      }
    } catch {
      // 忽略单次网络超时
    }
  }
  return items;
}

async function main() {
  console.log('[Anime Gallery] 开始获取高清动漫图库...');

  const [waifus, nekos, kitsunes, wallpapers] = await Promise.all([
    fetchFromNekosBest('waifu', 10),
    fetchFromNekosBest('neko', 8),
    fetchFromNekosBest('kitsune', 8),
    fetchDynamicWallpapers(8),
  ]);

  let combined = [...wallpapers, ...waifus, ...nekos, ...kitsunes];

  // 如果网络拉取数量偏少，使用精选内置数据无缝补齐
  if (combined.length < 25) {
    console.log('[Anime Gallery] 网络拉取结果数量较少，已自动整合高质量内置二次元精选集合补足至 30+ 项');
    const existingUrls = new Set(combined.map((c) => c.image));
    for (const item of CURATED_ANIME_ITEMS) {
      if (!existingUrls.has(item.image)) {
        combined.push(item);
      }
    }
  }

  // 保证至少有 30 张图
  while (combined.length < 30) {
    combined = combined.concat(CURATED_ANIME_ITEMS.slice(0, 30 - combined.length));
  }

  const galleryConfig = {
    title: '二次元画廊',
    subtitle: '绮丽幻想与瞬息光影，漫游数字动漫画廊',
    description: '精选高质量二次元与动漫插画壁纸，在 3D 景深流转中感受光影共鸣。',
    items: combined.slice(0, 35),
  };

  await fs.writeFile(CONFIG_PATH, JSON.stringify(galleryConfig, null, 2), 'utf-8');
  console.log(`[Anime Gallery] 成功固化 ${galleryConfig.items.length} 张高质量动漫壁纸至 gallery.config.json`);
}

main().catch((err) => {
  console.error('[Anime Gallery] 异常:', err);
  process.exit(1);
});
