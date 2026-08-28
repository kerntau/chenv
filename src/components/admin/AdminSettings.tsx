import React, { useState, useRef } from 'react';
import {
  Settings2,
  Save,
  Download,
  Upload,
  ShieldAlert,
  HardDrive,
  Check,
  Globe,
  User,
  Palette,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { useToast } from './AdminToast';
import type { SiteConfig } from '../../types';

export const AdminSettings: React.FC = () => {
  const {
    siteConfig,
    saveSiteConfig,
    preferences,
    savePreferences,
    exportAllData,
    importData,
    resetToDefault,
    storageUsage,
    clearLogs,
  } = useAdminStore();
  const { success, error } = useToast();

  // 站点配置表单
  const [configForm, setConfigForm] = useState<SiteConfig>({ ...siteConfig });

  // 偏好设置
  const [accentColor, setAccentColor] = useState(preferences.accentColor || 'blue');
  const [themeMode, setThemeMode] = useState(preferences.theme || 'system');

  // 备份导入文件 Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // 保存站点设置
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteConfig(configForm);
    success('站点基本信息与站长资料已成功保存！');
  };

  // 保存外观偏好
  const handleSavePreferences = () => {
    savePreferences({
      accentColor: accentColor as any,
      theme: themeMode as any,
    });
    success('后台外观与偏好已保存');
  };

  // 导出全量备份 JSON
  const handleExportBackup = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cot-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('全站数据备份文件已导出！');
  };

  // 导入全量备份 JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const res = importData(content);
      if (res.success) {
        success(res.message);
        setConfigForm(siteConfig);
      } else {
        error(res.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 执行恢复出厂
  const handleConfirmReset = () => {
    resetToDefault();
    setConfigForm(siteConfig);
    setResetConfirmOpen(false);
    success('全站数据已重置为初始演示状态');
  };

  return (
    <div className="admin-page-body space-y-6">
      {/* 页面头部 */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>
            <Settings2 className="w-6 h-6 text-sky-500" />
            <span>站点设置与数据中心</span>
          </h1>
          <p>
            调整博客全局配置、站长资料、后台主题外观，并进行本地数据备份、恢复与重置。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 2 栏：基本设置 + 站长信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 站点基本信息表单 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                <Globe className="w-4 h-4 text-sky-500" />
                <span>站点基础信息设置</span>
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="admin-input-group">
                  <label className="admin-label">站点主标题 (Title) *</label>
                  <input
                    type="text"
                    required
                    value={configForm.title}
                    onChange={(e) => setConfigForm({ ...configForm, title: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">副标题 (Subtitle)</label>
                  <input
                    type="text"
                    value={configForm.subtitle}
                    onChange={(e) => setConfigForm({ ...configForm, subtitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">站点简介描述 (Description)</label>
                <textarea
                  rows={2}
                  value={configForm.description}
                  onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="admin-input-group">
                  <label className="admin-label">站点域名 URL</label>
                  <input
                    type="url"
                    value={configForm.url}
                    onChange={(e) => setConfigForm({ ...configForm, url: e.target.value })}
                    className="admin-input font-mono"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">ICP 备案号 (可选)</label>
                  <input
                    type="text"
                    value={configForm.footer?.icp || ''}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        footer: { ...configForm.footer, icp: e.target.value },
                      })
                    }
                    placeholder="萌ICP备20268811号"
                    className="admin-input font-mono"
                  />
                </div>
              </div>

              {/* 站长资料 */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-500" />
                  <span>站长个人资料</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="admin-input-group">
                    <label className="admin-label">昵称 (Author Name)</label>
                    <input
                      type="text"
                      value={configForm.author?.name || ''}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          author: { ...configForm.author, name: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">头像图片 URL</label>
                    <input
                      type="url"
                      value={configForm.author?.avatar || ''}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          author: { ...configForm.author, avatar: e.target.value },
                        })
                      }
                      className="admin-input font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="admin-input-group">
                    <label className="admin-label">联系邮箱</label>
                    <input
                      type="email"
                      value={configForm.author?.email || ''}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          author: { ...configForm.author, email: e.target.value },
                        })
                      }
                      className="admin-input font-mono"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">GitHub 主页</label>
                    <input
                      type="url"
                      value={configForm.author?.github || ''}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          author: { ...configForm.author, github: e.target.value },
                        })
                      }
                      className="admin-input font-mono"
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">个人标语 / 介绍</label>
                  <textarea
                    rows={2}
                    value={configForm.author?.description || ''}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        author: { ...configForm.author, description: e.target.value },
                      })
                    }
                    className="admin-textarea"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save className="w-4 h-4" />
                  <span>保存站点配置</span>
                </button>
              </div>
            </form>
          </div>

          {/* 外观偏好卡片 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                <Palette className="w-4 h-4 text-violet-500" />
                <span>后台外观与偏好</span>
              </h3>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="admin-input-group">
                  <label className="admin-label">系统主题模式</label>
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value as any)}
                    className="admin-select"
                  >
                    <option value="system">跟随系统</option>
                    <option value="light">浅色模式</option>
                    <option value="dark">深色模式</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">控制台强调色</label>
                  <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value as any)}
                    className="admin-select"
                  >
                    <option value="blue">天空蓝 (Sky Blue)</option>
                    <option value="emerald">翡翠绿 (Emerald)</option>
                    <option value="violet">紫罗兰 (Violet)</option>
                    <option value="amber">日落橙 (Amber)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存偏好</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧 1 栏：数据备份、恢复与存储统计 */}
        <div className="space-y-6">
          {/* 数据备份与恢复 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                <Database className="w-4 h-4 text-emerald-500" />
                <span>数据备份与恢复中心</span>
              </h3>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-sky-500" />
                  <span>导出本地全站快照</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  将所有文章、手记、说说、友链与站点配置打包为单个 JSON 备份文件保存到本地。
                </p>
                <button
                  onClick={handleExportBackup}
                  className="admin-btn admin-btn-secondary admin-btn-sm w-full mt-1"
                >
                  立即导出 JSON 备份
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-500" />
                  <span>从备份文件恢复</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  选择此前导出的 JSON 备份文件，一键恢复全站内容。
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="admin-btn admin-btn-secondary admin-btn-sm w-full mt-1"
                >
                  选择 JSON 备份文件
                </button>
              </div>

              {/* 危险操作区：出厂重置 */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>危险区域</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  重置将清除所有本地新增与修改，恢复初始演示数据。
                </p>
                <button
                  onClick={() => setResetConfirmOpen(true)}
                  className="admin-btn admin-btn-danger admin-btn-sm w-full"
                >
                  恢复出厂演示数据
                </button>
              </div>
            </div>
          </div>

          {/* 本地存储分析 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                <HardDrive className="w-4 h-4 text-sky-500" />
                <span>存储空间分析</span>
              </h3>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>LocalStorage 占用</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {storageUsage.usedKb} KB
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>文章篇数</span>
                  <span>{storageUsage.itemsCount.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span>手记篇数</span>
                  <span>{storageUsage.itemsCount.diaries}</span>
                </div>
                <div className="flex justify-between">
                  <span>说说数量</span>
                  <span>{storageUsage.itemsCount.records}</span>
                </div>
                <div className="flex justify-between">
                  <span>友链伙伴</span>
                  <span>{storageUsage.itemsCount.friends}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  clearLogs();
                  success('操作日志已清空');
                }}
                className="w-full mt-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] font-mono hover:underline"
              >
                清理历史操作日志
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 出厂重置二次确认模态框 */}
      {resetConfirmOpen && (
        <div className="admin-modal-overlay" onClick={() => setResetConfirmOpen(false)}>
          <div
            className="admin-modal-dialog p-6 space-y-4 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-950 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  确认重置全站数据？
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  此操作将丢弃所有在当前浏览器中创建或修改的文章、手记、说说及设置，并重置为初始演示状态。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReset}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
