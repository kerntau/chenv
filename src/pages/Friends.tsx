import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Users, ArrowUpRight, Sparkles } from 'lucide-react';

interface Friend {
  name: string;
  url: string;
  avatarText: string;
  bio: string;
  tags?: string[];
}

export const Friends: React.FC = () => {
  const friends: Friend[] = [
    {
      name: 'Innei',
      url: 'https://innei.in',
      avatarText: 'I',
      bio: 'Design Engineer. Creator of Mix Space, Shiro & Yohaku.',
      tags: ['Design', 'Next.js', 'Shiro'],
    },
    {
      name: 'Astro-Gyoza',
      url: 'https://github.com',
      avatarText: 'G',
      bio: '纸质美学与静谧书写体验的开源探索者。',
      tags: ['Aesthetics', 'Typography'],
    },
    {
      name: 'PwnFox',
      url: 'https://github.com',
      avatarText: 'P',
      bio: '二进制安全研究员，专注 Linux 内核与浏览器沙箱逃逸。',
      tags: ['Kernel', 'Browser', 'Pwn'],
    },
    {
      name: 'CryptoNotes',
      url: 'https://github.com',
      avatarText: 'C',
      bio: '数论、后量子密码学与零知识证明爱好者。',
      tags: ['Crypto', 'ZKP', 'Math'],
    },
  ];

  return (
    <PageShell>
      <Container>
        {/* 顶部标题 */}
        <div className="mb-10 pb-6 border-b border-stone-200/70 dark:border-stone-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 mb-2">
            <Users className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <span>FRIENDS &bull; 朋友们</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            志同道合的朋友
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 font-sans">
            在浩瀚的互联网海洋里，感谢每一次思想的交汇与灵感的共振。
          </p>
        </div>

        {/* 朋友卡片 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {friends.map((friend) => (
            <a
              key={friend.name}
              href={friend.url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-3xl paper-card flex items-start space-x-4 group hover:border-amber-400/50 transition-all block"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center font-serif text-lg font-bold shrink-0 group-hover:scale-105 transition-transform">
                {friend.avatarText}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors truncate">
                    {friend.name}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {friend.bio}
                </p>

                {friend.tags && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {friend.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* 申请友链指南 */}
        <div className="p-6 rounded-3xl paper-card space-y-3 bg-stone-50/50 dark:bg-[#18181A]/50">
          <div className="flex items-center space-x-2 font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2>交换友链</h2>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
            如果您也拥有自己的个人独立博客，欢迎在您的站点添加序栈后通过邮件联系交换。
          </p>
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/50 dark:border-stone-800/50 text-xs font-mono text-stone-600 dark:text-stone-400 space-y-1">
            <div>名称：Perimsx / 序栈</div>
            <div>简介：以字为痕，以栈为序。信息安全与现代全栈书写。</div>
            <div>链接：https://perimsx.me</div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
};
