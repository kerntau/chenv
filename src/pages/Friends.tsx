import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Search, X, Mail, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
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

  const email = siteConfig.author.email || 'hi@chenv.cn';

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
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索友链..."
              className="w-full pl-9 pr-8 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 focus:border-sky-400 dark:focus:border-sky-500/60 focus:ring-1 focus:ring-sky-400/30 dark:focus:ring-sky-500/20 transition-all outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
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
              className="group relative p-4 rounded-lg border border-sky-300/60 dark:border-sky-500/30 bg-white/80 dark:bg-sky-950/15 hover:border-sky-400 dark:hover:border-sky-400/50 hover:bg-white dark:hover:bg-sky-950/25 transition-all duration-200"
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
                    <span className="text-[10px] font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/40 px-1.5 py-px rounded shrink-0">
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
        <section className="mb-6 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white/75 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs overflow-hidden">
          {/* 顶栏 */}
          <div className="px-5 py-3.5 border-b border-slate-200/60 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
              <h2 className="font-sans font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
                {guideTitle}
              </h2>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">
              欢迎志同道合的博客在此相聚
            </span>
          </div>

          {/* 双栏主体：仅保留用户选定的参数项与原则、邮箱 */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* 左栏：参数明细列表（名称、网址、简介、头像） */}
            <div className="rounded-lg border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/40 dark:bg-white/[0.01] divide-y divide-slate-200/50 dark:divide-white/[0.04] text-xs flex flex-col justify-around overflow-hidden">
              {[
                { label: '名称', val: templateName, key: 'name' },
                { label: '网址', val: templateUrl, key: 'url' },
                { label: '简介', val: templateDesc, key: 'desc' },
                { label: '头像', val: templateAvatar, key: 'avatar' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleCopyField(item.val, item.key)}
                  className="group flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer gap-2"
                  title="点击复制此项"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-8 shrink-0 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate text-[11.5px] select-all">
                      {item.val}
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {copiedField === item.key ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-sans">
                        <Check className="w-3 h-3" />
                        <span>已复制</span>
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 右栏：互换原则 + 邮箱联系 */}
            <div className="flex flex-col justify-between gap-3">
              {/* 互换原则 */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-sans block">
                  互换原则
                </span>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      1
                    </span>
                    <span><strong>独立原创</strong>：拥有独立域名与原创内容，定期维护。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      2
                    </span>
                    <span><strong>稳定访问</strong>：全站支持 HTTPS 访问，访问顺畅无恶意广告。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      3
                    </span>
                    <span><strong>先加后申</strong>：发送邮件前，请先将本站添加至您的友链中。</span>
                  </li>
                </ul>
              </div>

              {/* 邮箱按钮：hi@chenv.cn */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100/60 hover:bg-slate-200/60 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.06] transition-all flex items-center justify-center gap-2 cursor-pointer"
                title="点击复制站长邮箱"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-sans font-medium">已复制 {email}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{email}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
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
      className="group relative p-4 rounded-lg border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.12] hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-200"
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
