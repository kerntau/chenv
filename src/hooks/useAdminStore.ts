import { useEffect, useState } from 'react';
import { AdminStore, type AdminPreferences } from '../lib/admin-store';
import type { SiteConfig } from '../types';

export function useAdminStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = AdminStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    // 列表与实体
    posts: AdminStore.getPosts(true),
    publishedPosts: AdminStore.getPosts(false),
    diaries: AdminStore.getDiaries(),
    records: AdminStore.getRecords(),
    friends: AdminStore.getFriends(),
    categories: AdminStore.getCategories(),
    tags: AdminStore.getTags(),
    siteConfig: AdminStore.getSiteConfig(),
    logs: AdminStore.getLogs(),
    preferences: AdminStore.getPreferences(),
    storageUsage: AdminStore.getStorageUsage(),

    // 操作方法
    savePost: (data: Parameters<typeof AdminStore.savePost>[0]) => AdminStore.savePost(data),
    deletePost: (slug: string) => AdminStore.deletePost(slug),
    togglePostDraft: (slug: string) => AdminStore.togglePostDraft(slug),
    setPostRecommend: (slug: string, recommend: number) => AdminStore.setPostRecommend(slug, recommend),
    getPostBySlug: (slug: string) => AdminStore.getPostBySlug(slug),

    saveDiary: (data: Parameters<typeof AdminStore.saveDiary>[0]) => AdminStore.saveDiary(data),
    deleteDiary: (slug: string) => AdminStore.deleteDiary(slug),
    getDiaryBySlug: (slug: string) => AdminStore.getDiaryBySlug(slug),

    saveRecord: (record: Parameters<typeof AdminStore.saveRecord>[0]) => AdminStore.saveRecord(record),
    deleteRecord: (id: string | number) => AdminStore.deleteRecord(id),
    toggleRecordPin: (id: string | number) => AdminStore.toggleRecordPin(id),
    updateRecordLikes: (id: string | number, delta: number) => AdminStore.updateRecordLikes(id, delta),
    addRecordComment: (id: string | number, author: string, content: string) => AdminStore.addRecordComment(id, author, content),
    deleteRecordComment: (recordId: string | number, commentId: string) => AdminStore.deleteRecordComment(recordId, commentId),

    saveFriend: (friend: Parameters<typeof AdminStore.saveFriend>[0]) => AdminStore.saveFriend(friend),
    deleteFriend: (id: string | number) => AdminStore.deleteFriend(id),

    renameCategory: (oldName: string, newName: string) => AdminStore.renameCategory(oldName, newName),
    renameTag: (oldTag: string, newTag: string) => AdminStore.renameTag(oldTag, newTag),

    saveSiteConfig: (config: SiteConfig) => AdminStore.saveSiteConfig(config),
    savePreferences: (prefs: Partial<AdminPreferences>) => AdminStore.savePreferences(prefs),

    // 直接动文件操作
    getSiteConfigFileContent: () => AdminStore.getSiteConfigFileContent(),
    getFriendsFileContent: () => AdminStore.getFriendsFileContent(),
    getRecordsFileContent: () => AdminStore.getRecordsFileContent(),
    saveSiteConfigFileContent: (rawJson: string) => AdminStore.saveSiteConfigFileContent(rawJson),
    saveFriendsFileContent: (rawJson: string) => AdminStore.saveFriendsFileContent(rawJson),
    saveRecordsFileContent: (rawJson: string) => AdminStore.saveRecordsFileContent(rawJson),
    downloadFile: (filename: string, content: string, mimeType?: string) => AdminStore.downloadFile(filename, content, mimeType),
    downloadProjectFile: (fileType: 'siteConfig' | 'friends' | 'records' | 'fullBackup') => AdminStore.downloadProjectFile(fileType),

    exportAllData: () => AdminStore.exportAllData(),
    importData: (json: string) => AdminStore.importData(json),
    resetToDefault: () => AdminStore.resetToDefault(),
    clearLogs: () => AdminStore.clearLogs(),
  };
}
