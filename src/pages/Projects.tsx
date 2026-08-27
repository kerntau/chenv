import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { FolderGit2, Star, ArrowUpRight, Shield, Terminal, Cpu } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: 'security' | 'frontend' | 'tools';
  stars: number;
  githubUrl: string;
  demoUrl?: string;
  icon: typeof Shield;
}

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'security' | 'frontend' | 'tools'>('all');

  const projects: Project[] = [
    {
      id: 'pwntoolbox',
      name: 'PwnToolbox',
      description: 'Linux Glibc 堆内存分配可视化与自动化漏洞利用脚本生成脚手架。',
      tags: ['C', 'Python', 'GDB', 'Glibc', 'Pwn'],
      category: 'security',
      stars: 128,
      githubUrl: 'https://github.com',
      demoUrl: 'https://github.com',
      icon: Shield,
    },
    {
      id: 'ecc-crypto-viz',
      name: 'ECC-Crypto-Viz',
      description: '基于有限域代数数论与 Weierstrass 方程的椭圆曲线加法群交互式动态可视化教学平台。',
      tags: ['TypeScript', 'React 19', 'KaTeX', 'Canvas'],
      category: 'tools',
      stars: 94,
      githubUrl: 'https://github.com',
      icon: Cpu,
    },
    {
      id: 'perimsx-blog',
      name: 'Perimsx / 序栈',
      description: '复刻 Innei (Yohaku / Shiro) 极简设计美学的高性能个人博客系统，支持 Shiki 与 KaTeX。',
      tags: ['Rsbuild', 'React 19', 'Tailwind', 'Wouter'],
      category: 'frontend',
      stars: 256,
      githubUrl: 'https://github.com',
      demoUrl: '/',
      icon: Terminal,
    },
    {
      id: 'arm64-frida-hooker',
      name: 'ARM64-Frida-Hooker',
      description: '移动端逆向工程与 AArch64 反调试绕过注入脚本集，支持 ptrace 与 libc 动态 Hook。',
      tags: ['JavaScript', 'Frida', 'ARM64', 'Reverse'],
      category: 'security',
      stars: 76,
      githubUrl: 'https://github.com',
      icon: Shield,
    },
  ];

  const filteredProjects = projects.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <PageShell>
      <Container>
        {/* 顶部标题 */}
        <div className="mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <FolderGit2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>SHOWCASE &bull; 项目工坊</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            开源项目与安全工具
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
            将安全攻防实验、数论算法与现代全栈工程转化为可复用的代码制品。
          </p>

          {/* 分类过滤器 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { key: 'all', label: '全部项目' },
              { key: 'security', label: '安全攻防与逆向' },
              { key: 'frontend', label: '前端与架构' },
              { key: 'tools', label: '算法与可视化' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all ${
                  filter === tab.key
                    ? 'bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-medium shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 项目卡片 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="p-3.5 sm:p-4 rounded-sm paper-card flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="font-sans text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                        {project.name}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-mono text-slate-500">
                      <Star className="w-3.5 h-3.5 text-sky-500 fill-sky-400/30" />
                      <span>{project.stars}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans mt-1.5">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded-sm text-[10.5px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>源码仓库</span>
                  </a>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="inline-flex items-center space-x-1 text-xs font-sans text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <span>在线体验</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </PageShell>
  );
};
