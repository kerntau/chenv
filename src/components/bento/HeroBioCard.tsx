import React from 'react';
import { Terminal, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export const HeroBioCard: React.FC = () => {
  return (
    <div className="relative p-6 sm:p-8 rounded-3xl paper-card overflow-hidden flex flex-col justify-between h-full bg-gradient-to-br from-white to-[#FAF7F2] dark:from-[#1D1D20] dark:to-[#171719]">
      {/* 顶部微质感光晕 */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* 状态徽章 */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-stone-200/50 dark:bg-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>信息安全在读 &bull; 探索底层机制</span>
          </span>
        </div>

        {/* 标题与个人隐喻 */}
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
          Perimsx / 序栈
        </h1>
        <p className="font-serif italic text-sm text-stone-500 dark:text-stone-400 mt-1 mb-4">
          &ldquo;以字为痕，以栈为序。在严谨的二进制世界里，保留一页纸张的温度。&rdquo;
        </p>

        {/* 核心简介 */}
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
          专注于<strong>二进制漏洞挖掘 (Pwn)</strong>、<strong>Linux 内存机制</strong>、<strong>密码学</strong>与<strong>现代全栈架构</strong>。
          记录实验复现、CTF 解题过程与代码美学思考。
        </p>

        {/* 核心标签 */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {['C / ASM', 'Python', 'Reverse / Pwn', 'React 19 / TS', 'Web Security'].map(
            (tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      {/* 底部信息条 */}
      <div className="mt-6 pt-5 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>信息安全专业</span>
          </span>
          <span className="flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Linux Env</span>
          </span>
        </div>
        <Link
          href="/about"
          className="inline-flex items-center space-x-1 text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 font-sans font-medium transition-colors"
        >
          <span>关于我</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
