import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.resolve(__dirname, '../src/content/config/gallery.config.json');
const TARGET_IMG_DIR = path.resolve(__dirname, '../public/anime');
const TARGET_DATA_DIR = path.resolve(__dirname, '../src/content/data');
const TARGET_DATA_FILE = path.resolve(TARGET_DATA_DIR, 'anime-details.json');

async function ensureDirs() {
  await fs.mkdir(TARGET_IMG_DIR, { recursive: true });
  await fs.mkdir(TARGET_DATA_DIR, { recursive: true });
}

async function downloadImage(url, destPath) {
  try {
    const exists = await fs.stat(destPath).catch(() => null);
    if (exists && exists.size > 1024) {
      return true; // 已经存在有效图片，跳过
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://bgm.tv/',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.warn(`[下载失败 ${res.status}] ${url}`);
      return false;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) {
      console.warn(`[文件过小] ${url}`);
      return false;
    }

    await fs.writeFile(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`[下载异常] ${url}:`, err.message);
    return false;
  }
}

async function fetchSubjectDetail(subjectId) {
  try {
    const res = await fetch(`https://api.bgm.tv/v0/subjects/${subjectId}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Chent/1.0 (https://chenv.cn)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[获取详情异常 ${subjectId}]:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 开始追漫资产本地化与详情预烘焙...');
  await ensureDirs();

  const configRaw = await fs.readFile(CONFIG_PATH, 'utf-8');
  const galleryConfig = JSON.parse(configRaw);

  // 读取已有的离线详情数据（若存在增量合并）
  let existingDetails = {};
  try {
    const dataRaw = await fs.readFile(TARGET_DATA_FILE, 'utf-8');
    existingDetails = JSON.parse(dataRaw);
  } catch {}

  const detailsMap = { ...existingDetails };
  let downloadedCount = 0;

  for (let i = 0; i < galleryConfig.items.length; i++) {
    const item = galleryConfig.items[i];
    const match = item.href?.match(/subject\/(\d+)/);
    const subjectId = match ? match[1] : null;

    if (!subjectId) continue;

    const localFileName = `${subjectId}.jpg`;
    const localFilePath = path.join(TARGET_IMG_DIR, localFileName);
    const localWebPath = `/anime/${localFileName}`;

    console.log(`[${i + 1}/${galleryConfig.items.length}] 处理: ${item.title} (ID: ${subjectId})`);

    // 1. 下载海报到本地（支持已有远端 url 或已是本地 url）
    let downloadUrl = item.image;
    if (downloadUrl.startsWith('/anime/')) {
      // 如果已经写成本地了，尝试用 Bangumi 官方图库 URL 兜底
      downloadUrl = `https://lain.bgm.tv/pic/cover/l/${subjectId.slice(0, 2)}/${subjectId.slice(2, 4)}/${subjectId}.jpg`;
    }

    const ok = await downloadImage(downloadUrl, localFilePath);
    if (ok) {
      downloadedCount++;
      item.image = localWebPath;
    }

    // 2. 预抓取详情元数据（若已存在且数据完整则复用）
    if (!detailsMap[subjectId] || !detailsMap[subjectId].summary) {
      const detail = await fetchSubjectDetail(subjectId);
      if (detail) {
        detailsMap[subjectId] = detail;
      }
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  // 过滤无简介条目
  galleryConfig.items = galleryConfig.items.filter((item) => {
    const m = item.href.match(/subject\/(\d+)/);
    const id = m ? m[1] : null;
    return Boolean(id && detailsMap[id]?.summary && detailsMap[id].summary.trim());
  });

  // 写回 gallery.config.json
  await fs.writeFile(CONFIG_PATH, JSON.stringify(galleryConfig, null, 2), 'utf-8');
  console.log(`✅ gallery.config.json 已更新为本地路径，海报验证/下载: ${downloadedCount} 部，收录有效条目: ${galleryConfig.items.length} 部`);

  // 写回 anime-details.json
  await fs.writeFile(TARGET_DATA_FILE, JSON.stringify(detailsMap, null, 2), 'utf-8');
  console.log(`✅ anime-details.json 已预烘焙完成，共 ${Object.keys(detailsMap).length} 部动漫完整详情`);
}

main().catch(console.error);
