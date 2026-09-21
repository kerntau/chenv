import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { PageEpigraph } from '../components/layout/PageEpigraph';
import { Search, X, Mail, Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { getAllFriends, siteConfig } from '../content';
import type { FriendItem } from '../types';
import { TechBadge } from '../components/friends/TechBadge';

export const Friends: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
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
  const pageSubtitle = friendsPage?.subtitle || '山海相逢，灵感共振。';
  const guideTitle = friendsPage?.guideTitle || '交换友链';
  const templateName = friendsPage?.template?.name || siteConfig.title;
  const templateDesc = friendsPage?.template?.desc || siteConfig.description;
  const templateUrl = friendsPage?.template?.url || siteConfig.url;
  const rawAvatar = friendsPage?.template?.avatar || siteConfig.author?.avatar || '/avatar.jpg';
  const templateAvatar = rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://')
    ? rawAvatar
    : `${siteConfig.url.replace(/\/+$/, '')}/${rawAvatar.replace(/^\/+/, '')}`;

  const email = siteConfig.author.email || 'i@chenv.cn';

  const isMatchSelf = useMemo(() => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      templateName.toLowerCase().includes(q) ||
      (templateDesc && templateDesc.toLowerCase().includes(q)) ||
      '本站'.includes(q) ||
      templateUrl.toLowerCase().includes(q)
    );
  }, [query, templateName, templateDesc, templateUrl]);

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyField = (val: string, fieldKey: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <PageShell>
      <Container size="wide">
        {/* 页面标题 */}
        <header className="pt-2 pb-6 sm:pb-8 text-center">
          <h1 className="font-sans text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-sans">
              {pageSubtitle}
            </p>
          )}

          {/* 搜索 */}
          <div className="mt-5 max-w-sm mx-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索友链..."
              className="glass-input w-full pl-9 pr-8 py-2 rounded-md text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* 友链卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {/* 本站专属卡片 */}
          {isMatchSelf && (
            <a
              href={templateUrl}
              target="_blank"
              rel="noreferrer"
              data-external-bypass="true"
              className="glass-card glass-card-interactive group relative p-4 block !border-sky-400/50 dark:!border-sky-400/40"
            >
              <div className="flex items-center gap-3">
                {/* 圆形头像 */}
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden ring-1 ring-sky-400/30">
                  <img
                    src={rawAvatar}
                    alt={templateName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-sans text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {templateName}
                    </h3>
                    <span className="text-[10px] font-medium text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 px-1.5 py-px rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] shrink-0">
                      本站
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <p
                    className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5"
                    title={templateDesc}
                  >
                    {templateDesc}
                  </p>
                </div>
              </div>
            </a>
          )}

          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
          {!isMatchSelf && filteredFriends.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-slate-400 dark:text-slate-600">
              未找到匹配「{query}」的友链
            </div>
          )}
        </div>

        {/* 申请友链与本站信息 */}
        <section className="glass-panel mb-6 p-4 sm:p-5 text-xs relative overflow-hidden">
          {/* 顶栏：标题 + 邮箱快捷触发 */}
          <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100/80 dark:border-white/[0.05]">
            <div className="flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-sky-500/80 dark:text-sky-400/80 shrink-0" />
              <h2 className="font-sans font-medium text-slate-800 dark:text-slate-200 text-xs tracking-tight">
                {guideTitle}
              </h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-sans hidden sm:inline">
                · 欢迎志同道合的博客在此相聚
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="glass-tag inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer active:scale-[0.98]"
              title="点击复制站长邮箱"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-sans font-medium text-[10.5px]">已复制</span>
                </>
              ) : (
                <>
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{email}</span>
                  <Copy className="w-2.5 h-2.5 opacity-40 ml-0.5" />
                </>
              )}
            </button>
          </div>

          {/* 双栏主体：彻底扁平无内部嵌套盒 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            {/* 左栏：参数明细 */}
            <div className="space-y-0.5">
              {[
                { label: '名称', val: templateName, key: 'name' },
                { label: '网址', val: templateUrl, key: 'url' },
                { label: '简介', val: templateDesc, key: 'desc' },
                { label: '头像', val: templateAvatar, key: 'avatar' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleCopyField(item.val, item.key)}
                  className="group flex items-center justify-between px-2 py-1 -mx-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/[0.03] transition-colors cursor-pointer gap-2"
                  title="点击复制此项"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-7 shrink-0 font-mono text-[11px] text-slate-400 dark:text-slate-500 select-none">
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate text-[11.5px] select-all">
                      {item.val}
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {copiedField === item.key ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-sans font-medium">
                        <Check className="w-3 h-3" />
                        <span>已复制</span>
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 右栏：互换原则 */}
            <div className="md:border-l md:border-slate-100 md:dark:border-white/[0.04] md:pl-6 space-y-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  互换原则
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10.5px]">
                  先加后申
                </span>
              </div>
              <ul className="space-y-1 text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-medium shrink-0 pt-0.5">01</span>
                  <span><strong>独立原创</strong>：拥有独立域名与原创内容，定期维护。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-medium shrink-0 pt-0.5">02</span>
                  <span><strong>稳定访问</strong>：全站支持 HTTPS，顺畅无恶意广告。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-medium shrink-0 pt-0.5">03</span>
                  <span><strong>先加后申</strong>：发送邮件前，请先将本站添加至您的友链。</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 底部卷尾题跋 */}
        <PageEpigraph quote="山海相逢，灵感共振，行至深处皆是朋友。" />
      </Container>
    </PageShell>
  );
};

/* ─── 友链卡片 ─── */
const FriendCard: React.FC<{ friend: FriendItem }> = ({ friend }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (friend.name || '?').charAt(0).toUpperCase();

  return (
    <a
      href={friend.link}
      target="_blank"
      rel="noreferrer"
      data-external-bypass="true"
      className="glass-card glass-card-interactive group relative p-4 block"
    >
      <div className="flex items-center gap-3">
        {/* 圆形头像 */}
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
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

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-sans text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {friend.name}
            </h3>
            <ExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <p
            className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5"
            title={friend.desc}
          >
            {friend.desc || '独立个人博客'}
          </p>
        </div>
      </div>

      {/* 技术栈角标 */}
      {(friend.framework || friend.deploy) && (
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <TechBadge type="framework" name={friend.framework} />
          <TechBadge type="deploy" name={friend.deploy} />
        </div>
      )}
    </a>
  );
};
