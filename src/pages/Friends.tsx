import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Users, Sparkles, Search, X } from 'lucide-react';
import { getAllFriends, siteConfig } from '../content';
import type { FriendItem } from '../types';

import { TechBadge } from '../components/friends/TechBadge';

export const Friends: React.FC = () => {
  const [query, setQuery] = useState('');
  const allFriends = useMemo(() => getAllFriends(), []);

  const filteredFriends = useMemo(() => {
    if (!query.trim()) return allFriends;
    const q = query.toLowerCase().trim();
    return allFriends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.desc && f.desc.toLowerCase().includes(q)) ||
        (f.framework && f.framework.toLowerCase().includes(q)) ||
        (f.deploy && f.deploy.toLowerCase().includes(q))
    );
  }, [allFriends, query]);

  const friendsPage = siteConfig.friendsPage;
  const pageTitle = friendsPage?.title || '志同道合的朋友';
  const pageSubtitle = friendsPage?.subtitle || '在浩瀚的互联网海洋里，感谢每一次思想的交汇与灵感的共振。';
  const guideTitle = friendsPage?.guideTitle || '交换友链';
  const guideText =
    friendsPage?.guideText ||
    `如果您也拥有自己的个人独立博客，欢迎在您的站点添加本站后通过邮件（${siteConfig.author.email}）或 GitHub 联系交换。`;
  const templateName = friendsPage?.template?.name || siteConfig.title;
  const templateDesc = friendsPage?.template?.desc || `${siteConfig.subtitle} | ${siteConfig.description}`;
  const templateUrl = friendsPage?.template?.url || siteConfig.url;
  const templateAvatar = friendsPage?.template?.avatar || `${siteConfig.url}${siteConfig.author.avatar}`;

  return (
    <PageShell>
      <Container size="wide">
        {/* 顶部标题 */}
        <div className="mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>FRIENDS &bull; 朋友们 ({allFriends.length})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {pageTitle}
            </h1>

            {/* 实时搜索过滤 (并排大标题右侧) */}
            <div className="relative w-64 sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索友链名称、技术栈或简介..."
                className="w-full pl-9 pr-8 py-1.5 rounded-sm text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-sky-400/80 dark:focus:border-sky-400/80 focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_0_0_1px_rgba(56,189,248,0.3)] transition-all outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  title="清除搜索"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {pageSubtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* 朋友卡片 Grid (一行 4 个) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
          {filteredFriends.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs font-mono text-slate-400">
              未找到匹配 &ldquo;{query}&rdquo; 的友链
            </div>
          )}
        </div>

        {/* 申请友链指南 */}
        <div className="p-4 sm:p-5 rounded-sm paper-card space-y-2.5 bg-slate-50/50 dark:bg-[#18181A]/50">
          <div className="flex items-center space-x-2 font-sans font-semibold text-slate-900 dark:text-slate-100 text-sm">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2>{guideTitle}</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {guideText}
          </p>
          <div className="p-3 rounded-sm bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <div>名称：{templateName}</div>
            <div>简介：{templateDesc}</div>
            <div>链接：{templateUrl}</div>
            <div>头像：{templateAvatar}</div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
};

const FriendCard: React.FC<{ friend: FriendItem }> = ({ friend }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (friend.name || '?').charAt(0).toUpperCase();

  return (
    <a
      href={friend.link}
      target="_blank"
      rel="noreferrer"
      className="p-3.5 rounded-sm paper-card flex items-start space-x-3 group block h-full"
    >
      {/* 左侧头像 */}
      <div className="w-9 h-9 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center font-sans text-xs font-bold shrink-0 overflow-hidden group-hover:scale-105 transition-transform border border-slate-200/50 dark:border-slate-700/50">
        {friend.avatar && !imgError ? (
          <img
            src={friend.avatar}
            alt={friend.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* 右侧主体：上方标题+技术栈/部署图标，下方简介 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="font-sans text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">
            {friend.name}
          </h3>

          {/* 右侧技术栈与部署方式图标 */}
          <div
            className="flex items-center space-x-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <TechBadge type="framework" name={friend.framework} />
            <TechBadge type="deploy" name={friend.deploy} />
          </div>
        </div>

        {/* 简介文本 */}
        {friend.desc && (
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
            {friend.desc}
          </p>
        )}
      </div>
    </a>
  );
};
