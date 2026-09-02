import type { Diary, FriendItem, Post, RecordComment, RecordItem, SiteConfig } from '../types';
import siteConfigInitial from '../content/config/site.config.json';
import friendsInitial from '../content/pages/friends.json';
import recordsInitial from '../content/records/records.json';
import { calculateReadingTime, extractTOC, parseDiaryFile, parseMarkdownFile } from './markdown';

// 静态 Markdown 打包上下文读取
const postsContext = require.context('../content/posts', false, /\.md$/);
const initialPostsMap: Record<string, string> = {};
postsContext.keys().forEach((key: string) => {
  const slug = key.replace(/^\.\//, '').replace(/\.md$/, '');
  const mod = postsContext(key);
  initialPostsMap[slug] = typeof mod === 'string'
    ? mod
    : typeof mod === 'object' && mod !== null && 'default' in mod && typeof mod.default === 'string'
      ? mod.default
      : '';
});

const diariesContext = require.context('../content/diaries', false, /\.md$/);
const initialDiariesMap: Record<string, string> = {};
diariesContext.keys().forEach((key: string) => {
  const slug = key.replace(/^\.\//, '').replace(/\.md$/, '');
  const mod = diariesContext(key);
  initialDiariesMap[slug] = typeof mod === 'string'
    ? mod
    : typeof mod === 'object' && mod !== null && 'default' in mod && typeof mod.default === 'string'
      ? mod.default
      : '';
});

const defaultPosts: Post[] = Object.entries(initialPostsMap)
  .map(([slug, raw]) => parseMarkdownFile(slug, raw))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const defaultDiaries: Diary[] = Object.entries(initialDiariesMap)
  .map(([slug, raw]) => parseDiaryFile(slug, raw))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const defaultFriends: FriendItem[] = (friendsInitial as unknown[]).map((item: any) => ({
  id: item.id || Math.random().toString(36).slice(2, 9),
  name: item.name || '',
  desc: item.desc || '',
  avatar: item.avatar || '',
  link: item.link || '',
  order: item.order || 999,
  framework: item.framework || '',
  deploy: item.deploy || '',
  tags: item.tags || [],
}));

const defaultRecords: RecordItem[] = recordsInitial as RecordItem[];
const defaultSiteConfig: SiteConfig = siteConfigInitial as SiteConfig;

export interface ActivityLog {
  id: string;
  type: 'post' | 'diary' | 'record' | 'friend' | 'system' | 'setting';
  action: 'create' | 'update' | 'delete' | 'backup' | 'restore';
  title: string;
  description: string;
  timestamp: number;
}

const STORAGE_KEYS = {
  POSTS: 'cot_posts_data_v2',
  DIARIES: 'cot_diaries_data_v2',
  RECORDS: 'cot_records_data_v2',
  FRIENDS: 'cot_friends_data_v2',
  CONFIG: 'cot_site_config_v2',
  LOGS: 'cot_activity_logs_v2',
  PREFERENCES: 'cot_admin_prefs_v2',
};

export interface AdminPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'blue' | 'emerald' | 'violet' | 'amber';
  editorFontSize: number;
  sidebarCollapsed: boolean;
  autoSaveDraft: boolean;
}

const defaultPreferences: AdminPreferences = {
  theme: 'system',
  accentColor: 'blue',
  editorFontSize: 14,
  sidebarCollapsed: false,
  autoSaveDraft: true,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('[AdminStore] Listener execution error:', e);
    }
  });
}

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch (e) {
    console.error(`[AdminStore] Failed to load key: ${key}`, e);
    return fallback;
  }
}

function safeSave<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[AdminStore] Failed to save key: ${key}`, e);
  }
}

function deepMerge<T>(defaultObj: T, loadedObj: any): T {
  if (!loadedObj || typeof loadedObj !== 'object') return defaultObj;
  if (!defaultObj || typeof defaultObj !== 'object') return loadedObj;

  const result: any = Array.isArray(defaultObj) ? [...defaultObj] : { ...defaultObj };

  for (const key of Object.keys(loadedObj)) {
    const srcVal = loadedObj[key];
    const defVal = (defaultObj as any)[key];

    if (srcVal !== undefined && srcVal !== null) {
      if (Array.isArray(srcVal)) {
        result[key] = srcVal;
      } else if (typeof srcVal === 'object' && typeof defVal === 'object' && defVal !== null && !Array.isArray(defVal)) {
        result[key] = deepMerge(defVal, srcVal);
      } else {
        result[key] = srcVal;
      }
    }
  }

  // 保证默认对象中新增的顶层或嵌套字段不会因 loadedObj 缺失而丢失
  for (const key of Object.keys(defaultObj as any)) {
    if (result[key] === undefined) {
      result[key] = (defaultObj as any)[key];
    }
  }

  return result as T;
}

// 内存中活跃数据：对 posts 自动确保封面有效
const loadedPosts = safeLoad<Post[]>(STORAGE_KEYS.POSTS, defaultPosts);
const sanitizedPosts = loadedPosts.map((p) => ({
  ...p,
  coverImage: p.coverImage?.startsWith('/covers/') ? p.coverImage : `/covers/${p.slug}.svg`,
}));

let currentPosts: Post[] = sanitizedPosts;
let currentDiaries: Diary[] = safeLoad<Diary[]>(STORAGE_KEYS.DIARIES, defaultDiaries);
let currentRecords: RecordItem[] = safeLoad<RecordItem[]>(STORAGE_KEYS.RECORDS, defaultRecords);
let currentFriends: FriendItem[] = safeLoad<FriendItem[]>(STORAGE_KEYS.FRIENDS, defaultFriends);
let currentSiteConfig: SiteConfig = deepMerge<SiteConfig>(
  defaultSiteConfig,
  safeLoad<Partial<SiteConfig>>(STORAGE_KEYS.CONFIG, {})
);
let currentLogs: ActivityLog[] = safeLoad<ActivityLog[]>(STORAGE_KEYS.LOGS, [
  {
    id: 'log-init',
    type: 'system',
    action: 'update',
    title: '系统就绪',
    description: '管理控制台已初始化本地存储。',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
]);
let currentPreferences: AdminPreferences = safeLoad<AdminPreferences>(STORAGE_KEYS.PREFERENCES, defaultPreferences);

export const AdminStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  addLog(type: ActivityLog['type'], action: ActivityLog['action'], title: string, description: string) {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      action,
      title,
      description,
      timestamp: Date.now(),
    };
    currentLogs = [newLog, ...currentLogs.slice(0, 99)];
    safeSave(STORAGE_KEYS.LOGS, currentLogs);
    notify();
  },

  getLogs(): ActivityLog[] {
    return currentLogs;
  },

  clearLogs() {
    currentLogs = [];
    safeSave(STORAGE_KEYS.LOGS, currentLogs);
    notify();
  },

  // ===== 文章 Posts =====
  getPosts(includeDrafts = true): Post[] {
    return includeDrafts ? currentPosts : currentPosts.filter((p) => !p.draft);
  },

  getPostBySlug(slug: string): Post | null {
    return currentPosts.find((p) => p.slug === slug) ?? null;
  },

  savePost(postData: Partial<Post> & { title: string; slug: string; content: string }): Post {
    const { readingTime, wordCount } = calculateReadingTime(postData.content);
    const toc = extractTOC(postData.content);

    const existingIndex = currentPosts.findIndex((p) => p.slug === postData.slug);
    const updatedPost: Post = {
      slug: postData.slug.trim(),
      title: postData.title.trim(),
      date: postData.date || new Date().toISOString().split('T')[0],
      summary: postData.summary || postData.content.slice(0, 150).replace(/[#*`_\n]/g, ' ').trim() + '...',
      tags: Array.isArray(postData.tags) ? postData.tags.map((t) => t.trim()).filter(Boolean) : [],
      category: postData.category?.trim() || '技术文章',
      readingTime,
      wordCount,
      content: postData.content,
      toc,
      draft: Boolean(postData.draft),
      coverImage: postData.coverImage || undefined,
      recommend: typeof postData.recommend === 'number' ? postData.recommend : 0,
    };

    if (existingIndex >= 0) {
      currentPosts[existingIndex] = updatedPost;
      this.addLog('post', 'update', '更新文章', `更新了《${updatedPost.title}》`);
    } else {
      currentPosts = [updatedPost, ...currentPosts];
      this.addLog('post', 'create', '新建文章', `发布了新文章《${updatedPost.title}》`);
    }

    currentPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    safeSave(STORAGE_KEYS.POSTS, currentPosts);
    notify();
    return updatedPost;
  },

  deletePost(slug: string): boolean {
    const target = currentPosts.find((p) => p.slug === slug);
    if (!target) return false;
    currentPosts = currentPosts.filter((p) => p.slug !== slug);
    safeSave(STORAGE_KEYS.POSTS, currentPosts);
    this.addLog('post', 'delete', '删除文章', `删除了文章《${target.title}》`);
    notify();
    return true;
  },

  togglePostDraft(slug: string): boolean {
    const post = currentPosts.find((p) => p.slug === slug);
    if (!post) return false;
    post.draft = !post.draft;
    safeSave(STORAGE_KEYS.POSTS, currentPosts);
    this.addLog('post', 'update', '切换状态', `将《${post.title}》设为 ${post.draft ? '草稿' : '已发布'}`);
    notify();
    return true;
  },

  setPostRecommend(slug: string, recommend: number): boolean {
    const post = currentPosts.find((p) => p.slug === slug);
    if (!post) return false;
    post.recommend = recommend;
    safeSave(STORAGE_KEYS.POSTS, currentPosts);
    this.addLog('post', 'update', '设置置顶权重', `将《${post.title}》推荐权重调整为 ${recommend}`);
    notify();
    return true;
  },

  // ===== 手记 Diaries =====
  getDiaries(): Diary[] {
    return currentDiaries;
  },

  getDiaryBySlug(slug: string): Diary | null {
    return currentDiaries.find((d) => d.slug === slug) ?? null;
  },

  saveDiary(diaryData: Partial<Diary> & { title: string; slug: string; content: string }): Diary {
    const { readingTime, wordCount } = calculateReadingTime(diaryData.content);
    const existingIndex = currentDiaries.findIndex((d) => d.slug === diaryData.slug);

    const updatedDiary: Diary = {
      slug: diaryData.slug.trim(),
      title: diaryData.title.trim(),
      date: diaryData.date || new Date().toISOString().split('T')[0],
      time: diaryData.time || new Date().toTimeString().slice(0, 5),
      weather: diaryData.weather || '晴',
      mood: diaryData.mood || '平静',
      location: diaryData.location || '书房',
      tags: Array.isArray(diaryData.tags) && diaryData.tags.length > 0 ? diaryData.tags : ['手记'],
      summary: diaryData.summary || diaryData.content.slice(0, 120).replace(/[#*`_\n]/g, ' ').trim() + '...',
      content: diaryData.content,
      readingTime,
      wordCount,
    };

    if (existingIndex >= 0) {
      currentDiaries[existingIndex] = updatedDiary;
      this.addLog('diary', 'update', '更新手记', `更新了手记《${updatedDiary.title}》`);
    } else {
      currentDiaries = [updatedDiary, ...currentDiaries];
      this.addLog('diary', 'create', '新建手记', `记录了新手记《${updatedDiary.title}》`);
    }

    currentDiaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    safeSave(STORAGE_KEYS.DIARIES, currentDiaries);
    notify();
    return updatedDiary;
  },

  deleteDiary(slug: string): boolean {
    const target = currentDiaries.find((d) => d.slug === slug);
    if (!target) return false;
    currentDiaries = currentDiaries.filter((d) => d.slug !== slug);
    safeSave(STORAGE_KEYS.DIARIES, currentDiaries);
    this.addLog('diary', 'delete', '删除手记', `删除了手记《${target.title}》`);
    notify();
    return true;
  },

  // ===== 说说动态 Records =====
  getRecords(): RecordItem[] {
    return currentRecords;
  },

  saveRecord(record: Partial<RecordItem> & { content: string }): RecordItem {
    const isEdit = Boolean(record.id && currentRecords.some((r) => String(r.id) === String(record.id)));
    let savedItem: RecordItem;

    if (isEdit) {
      currentRecords = currentRecords.map((item) => {
        if (String(item.id) === String(record.id)) {
          savedItem = {
            ...item,
            ...record,
            content: record.content,
          };
          return savedItem;
        }
        return item;
      });
      this.addLog('record', 'update', '编辑说说', `更新了一条说说动态`);
    } else {
      savedItem = {
        id: `rec-${Date.now()}`,
        content: record.content,
        createTime: record.createTime || Date.now(),
        likes: record.likes || 0,
        mood: record.mood || '随笔',
        location: record.location || '',
        author: record.author || currentSiteConfig.author.name,
        contentType: record.contentType || 'markdown',
        media: record.media || [],
        comments: record.comments || [],
        pinned: Boolean(record.pinned),
      };
      currentRecords = [savedItem, ...currentRecords];
      this.addLog('record', 'create', '发布说说', `发布了一条新动态`);
    }

    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    notify();
    return savedItem!;
  },

  deleteRecord(id: string | number): boolean {
    const exists = currentRecords.some((r) => String(r.id) === String(id));
    if (!exists) return false;
    currentRecords = currentRecords.filter((r) => String(r.id) !== String(id));
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    this.addLog('record', 'delete', '删除说说', `删除了一条说说`);
    notify();
    return true;
  },

  toggleRecordPin(id: string | number): boolean {
    const item = currentRecords.find((r) => String(r.id) === String(id));
    if (!item) return false;
    item.pinned = !item.pinned;
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    this.addLog('record', 'update', '置顶切换', `${item.pinned ? '置顶' : '取消置顶'}了一条说说`);
    notify();
    return true;
  },

  updateRecordLikes(id: string | number, delta: number): number {
    const item = currentRecords.find((r) => String(r.id) === String(id));
    if (!item) return 0;
    item.likes = Math.max(0, (item.likes || 0) + delta);
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    notify();
    return item.likes;
  },

  addRecordComment(recordId: string | number, author: string, content: string): RecordComment | null {
    const item = currentRecords.find((r) => String(r.id) === String(recordId));
    if (!item) return null;
    const newComment: RecordComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      author: author.trim() || '博主回复',
      content: content.trim(),
      createdAt: Date.now(),
      local: true,
    };
    item.comments = [...(item.comments || []), newComment];
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    this.addLog('record', 'update', '发表评论', `在说说中回复：${content.slice(0, 20)}...`);
    notify();
    return newComment;
  },

  deleteRecordComment(recordId: string | number, commentId: string): boolean {
    const item = currentRecords.find((r) => String(r.id) === String(recordId));
    if (!item || !item.comments) return false;
    item.comments = item.comments.filter((c) => c.id !== commentId);
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    this.addLog('record', 'delete', '删除评论', `删除了一条评论互动`);
    notify();
    return true;
  },

  // ===== 友链 Friends =====
  getFriends(): FriendItem[] {
    return currentFriends.slice().sort((a, b) => (a.order || 999) - (b.order || 999));
  },

  saveFriend(friend: Partial<FriendItem> & { name: string; link: string }): FriendItem {
    const isEdit = Boolean(friend.id && currentFriends.some((f) => String(f.id) === String(friend.id)));
    let savedFriend: FriendItem;

    if (isEdit) {
      currentFriends = currentFriends.map((f) => {
        if (String(f.id) === String(friend.id)) {
          savedFriend = {
            ...f,
            ...friend,
            name: friend.name.trim(),
            link: friend.link.trim(),
            order: Number(friend.order ?? f.order ?? 999),
          };
          return savedFriend;
        }
        return f;
      });
      this.addLog('friend', 'update', '更新友链', `更新了友链《${friend.name}》`);
    } else {
      savedFriend = {
        id: friend.id || `fr-${Date.now()}`,
        name: friend.name.trim(),
        desc: (friend.desc || '').trim(),
        avatar: (friend.avatar || '').trim(),
        link: friend.link.trim(),
        order: Number(friend.order ?? (currentFriends.length + 1)),
        framework: (friend.framework || '').trim(),
        deploy: (friend.deploy || '').trim(),
        tags: friend.tags || [],
      };
      currentFriends = [...currentFriends, savedFriend];
      this.addLog('friend', 'create', '添加友链', `添加了新伙伴《${savedFriend.name}》`);
    }

    safeSave(STORAGE_KEYS.FRIENDS, currentFriends);
    notify();
    return savedFriend!;
  },

  deleteFriend(id: string | number): boolean {
    const target = currentFriends.find((f) => String(f.id) === String(id));
    if (!target) return false;
    currentFriends = currentFriends.filter((f) => String(f.id) !== String(id));
    safeSave(STORAGE_KEYS.FRIENDS, currentFriends);
    this.addLog('friend', 'delete', '删除友链', `删除了友链《${target.name}》`);
    notify();
    return true;
  },

  // ===== 分类与标签 Taxonomy =====
  getCategories(): { name: string; count: number }[] {
    const map: Record<string, number> = {};
    currentPosts.forEach((post) => {
      if (post.category) {
        map[post.category] = (map[post.category] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  renameCategory(oldName: string, newName: string): boolean {
    if (!oldName || !newName || oldName === newName) return false;
    let count = 0;
    currentPosts.forEach((post) => {
      if (post.category === oldName) {
        post.category = newName.trim();
        count++;
      }
    });
    if (count > 0) {
      safeSave(STORAGE_KEYS.POSTS, currentPosts);
      this.addLog('system', 'update', '重命名分类', `将分类「${oldName}」修改为「${newName}」（影响 ${count} 篇文章）`);
      notify();
      return true;
    }
    return false;
  },

  getTags(): { name: string; count: number }[] {
    const map: Record<string, number> = {};
    currentPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  renameTag(oldTag: string, newTag: string): boolean {
    if (!oldTag || !newTag || oldTag === newTag) return false;
    let count = 0;
    currentPosts.forEach((post) => {
      if (post.tags.includes(oldTag)) {
        post.tags = post.tags.map((t) => (t === oldTag ? newTag.trim() : t));
        count++;
      }
    });
    currentDiaries.forEach((diary) => {
      if (diary.tags.includes(oldTag)) {
        diary.tags = diary.tags.map((t) => (t === oldTag ? newTag.trim() : t));
        count++;
      }
    });
    if (count > 0) {
      safeSave(STORAGE_KEYS.POSTS, currentPosts);
      safeSave(STORAGE_KEYS.DIARIES, currentDiaries);
      this.addLog('system', 'update', '重命名标签', `将标签「${oldTag}」重命名为「${newTag}」`);
      notify();
      return true;
    }
    return false;
  },

  // ===== 站点配置 SiteConfig =====
  getSiteConfig(): SiteConfig {
    return currentSiteConfig;
  },

  saveSiteConfig(newConfig: SiteConfig): SiteConfig {
    currentSiteConfig = { ...newConfig };
    safeSave(STORAGE_KEYS.CONFIG, currentSiteConfig);
    this.addLog('setting', 'update', '更新站点设置', '更新了全站基本信息与站长配置');
    notify();
    return currentSiteConfig;
  },

  // ===== 控制台偏好 Preferences =====
  getPreferences(): AdminPreferences {
    return currentPreferences;
  },

  savePreferences(prefs: Partial<AdminPreferences>): AdminPreferences {
    currentPreferences = { ...currentPreferences, ...prefs };
    safeSave(STORAGE_KEYS.PREFERENCES, currentPreferences);
    notify();
    return currentPreferences;
  },

  // ===== 直接动文件源码操作 (Direct File Source Code) =====
  getSiteConfigFileContent(): string {
    return JSON.stringify(currentSiteConfig, null, 2);
  },

  getFriendsFileContent(): string {
    return JSON.stringify(currentFriends, null, 2);
  },

  getRecordsFileContent(): string {
    return JSON.stringify(currentRecords, null, 2);
  },

  saveSiteConfigFileContent(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, message: 'site.config.json 必须是 JSON 对象格式' };
      }
      currentSiteConfig = deepMerge<SiteConfig>(defaultSiteConfig, parsed);
      safeSave(STORAGE_KEYS.CONFIG, currentSiteConfig);
      this.addLog('setting', 'update', '直接更新配置文件', '通过源码编辑器更新了 site.config.json');
      notify();
      return { success: true, message: 'site.config.json 配置已成功应用并持久化！' };
    } catch (e) {
      return { success: false, message: `JSON 语法错误: ${(e as Error).message}` };
    }
  },

  saveFriendsFileContent(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'friends.json 必须是 JSON 数组格式' };
      }
      currentFriends = parsed;
      safeSave(STORAGE_KEYS.FRIENDS, currentFriends);
      this.addLog('friend', 'update', '直接更新友链文件', `通过源码编辑器更新了 friends.json（共 ${parsed.length} 项）`);
      notify();
      return { success: true, message: `friends.json 已更新并保存（共 ${parsed.length} 条友链）！` };
    } catch (e) {
      return { success: false, message: `JSON 语法错误: ${(e as Error).message}` };
    }
  },

  saveRecordsFileContent(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'records.json 必须是 JSON 数组格式' };
      }
      currentRecords = parsed;
      safeSave(STORAGE_KEYS.RECORDS, currentRecords);
      this.addLog('record', 'update', '直接更新动态文件', `通过源码编辑器更新了 records.json（共 ${parsed.length} 条）`);
      notify();
      return { success: true, message: `records.json 已更新并保存（共 ${parsed.length} 条动态）！` };
    } catch (e) {
      return { success: false, message: `JSON 语法错误: ${(e as Error).message}` };
    }
  },

  downloadFile(filename: string, content: string, mimeType = 'application/json'): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  downloadProjectFile(fileType: 'siteConfig' | 'friends' | 'records' | 'fullBackup'): void {
    if (fileType === 'siteConfig') {
      this.downloadFile('site.config.json', this.getSiteConfigFileContent());
    } else if (fileType === 'friends') {
      this.downloadFile('friends.json', this.getFriendsFileContent());
    } else if (fileType === 'records') {
      this.downloadFile('records.json', this.getRecordsFileContent());
    } else if (fileType === 'fullBackup') {
      const backup = this.exportAllData();
      this.downloadFile(
        `cot-full-backup-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(backup, null, 2)
      );
    }
  },

  // ===== 数据备份、恢复与统计 =====
  exportAllData() {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      siteConfig: currentSiteConfig,
      posts: currentPosts,
      diaries: currentDiaries,
      records: currentRecords,
      friends: currentFriends,
      logs: currentLogs,
      preferences: currentPreferences,
    };
  },

  importData(jsonContent: string): { success: boolean; message: string; details?: Record<string, number> } {
    try {
      const data = JSON.parse(jsonContent);
      if (!data || typeof data !== 'object') {
        return { success: false, message: '无效的 JSON 格式数据' };
      }

      let postsImported = 0;
      let diariesImported = 0;
      let recordsImported = 0;
      let friendsImported = 0;

      if (Array.isArray(data.posts)) {
        currentPosts = data.posts;
        safeSave(STORAGE_KEYS.POSTS, currentPosts);
        postsImported = currentPosts.length;
      }
      if (Array.isArray(data.diaries)) {
        currentDiaries = data.diaries;
        safeSave(STORAGE_KEYS.DIARIES, currentDiaries);
        diariesImported = currentDiaries.length;
      }
      if (Array.isArray(data.records)) {
        currentRecords = data.records;
        safeSave(STORAGE_KEYS.RECORDS, currentRecords);
        recordsImported = currentRecords.length;
      }
      if (Array.isArray(data.friends)) {
        currentFriends = data.friends;
        safeSave(STORAGE_KEYS.FRIENDS, currentFriends);
        friendsImported = currentFriends.length;
      }
      if (data.siteConfig && typeof data.siteConfig === 'object') {
        currentSiteConfig = data.siteConfig;
        safeSave(STORAGE_KEYS.CONFIG, currentSiteConfig);
      }

      this.addLog('system', 'restore', '数据恢复导入', `成功恢复 ${postsImported} 篇文章, ${diariesImported} 篇手记, ${recordsImported} 条说说, ${friendsImported} 位友链`);
      notify();
      return {
        success: true,
        message: '数据恢复导入成功！',
        details: {
          posts: postsImported,
          diaries: diariesImported,
          records: recordsImported,
          friends: friendsImported,
        },
      };
    } catch (e) {
      console.error('[AdminStore] Import error:', e);
      return { success: false, message: `导入解析失败：${(e as Error).message}` };
    }
  },

  resetToDefault() {
    currentPosts = [...defaultPosts];
    currentDiaries = [...defaultDiaries];
    currentRecords = [...defaultRecords];
    currentFriends = [...defaultFriends];
    currentSiteConfig = { ...defaultSiteConfig };
    currentLogs = [
      {
        id: `log-reset-${Date.now()}`,
        type: 'system',
        action: 'restore',
        title: '重置出厂数据',
        description: '全站数据已重置为初始演示状态。',
        timestamp: Date.now(),
      },
    ];
    currentPreferences = { ...defaultPreferences };

    safeSave(STORAGE_KEYS.POSTS, currentPosts);
    safeSave(STORAGE_KEYS.DIARIES, currentDiaries);
    safeSave(STORAGE_KEYS.RECORDS, currentRecords);
    safeSave(STORAGE_KEYS.FRIENDS, currentFriends);
    safeSave(STORAGE_KEYS.CONFIG, currentSiteConfig);
    safeSave(STORAGE_KEYS.LOGS, currentLogs);
    safeSave(STORAGE_KEYS.PREFERENCES, currentPreferences);

    notify();
  },

  getStorageUsage(): { usedBytes: number; usedKb: number; itemsCount: Record<string, number> } {
    let totalBytes = 0;
    if (typeof window !== 'undefined') {
      for (const key of Object.values(STORAGE_KEYS)) {
        const item = localStorage.getItem(key) || '';
        totalBytes += key.length + item.length * 2;
      }
    }
    return {
      usedBytes: totalBytes,
      usedKb: Math.round((totalBytes / 1024) * 100) / 100,
      itemsCount: {
        posts: currentPosts.length,
        diaries: currentDiaries.length,
        records: currentRecords.length,
        friends: currentFriends.length,
        logs: currentLogs.length,
      },
    };
  },
};
