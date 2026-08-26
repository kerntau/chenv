import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import {
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Mail,
  Compass,
  Code2,
  Database,
  Cloud,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import { siteConfig } from '../content';

export const About: React.FC = () => {
  return (
    <PageShell>
      <Container>
        {/* 顶部个人名片 */}
        <div className="mb-12 pb-8 border-b border-stone-200/70 dark:border-stone-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 mb-2">
            <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>IDENTITY &bull; 关于作者</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
            <img
              src={siteConfig.author.avatar || '/avatar.webp'}
              alt={siteConfig.author.name}
              className="w-16 h-16 rounded-full object-cover border border-stone-200 dark:border-stone-700 shadow-md"
            />
            <div>
              <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
                {siteConfig.author.name}
              </h1>
              <p className="text-xs font-mono text-stone-500 mt-1">
                {siteConfig.author.description}
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border-l-2 border-sky-500/70 dark:border-sky-400/70 max-w-[65ch]">
            <p className="font-sans text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              &ldquo;{siteConfig.subtitle}。记录全栈开发、云原生、系统架构与工程实践心得。&rdquo;
            </p>
          </div>
        </div>

        {/* Bento 内容矩阵 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 研究与核心领域 */}
          <div className="p-6 rounded-3xl paper-card space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
              <Cpu className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <h2>系统与技术方向</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              技术探索与实践主要聚焦于以下核心体系：
            </p>
            <ul className="space-y-2.5 text-xs font-sans text-stone-600 dark:text-stone-400">
              <li className="flex items-start space-x-2">
                <Cloud className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>云原生与分布式微服务</strong>：Kubernetes、Istio、gRPC、高可用分布式架构与可观测性体系。
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>高性能数据存储与分析</strong>：ClickHouse 列式分析、PostgreSQL 性能调优、Redis 缓存与分库分表。
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>现代全栈与并发编程</strong>：Go、Rust 内存安全、React 19、Next.js 与全栈工程化交付。
                </span>
              </li>
            </ul>
          </div>

          {/* 全栈工程技能矩阵 */}
          <div className="p-6 rounded-3xl paper-card space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
              <Layers className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <h2>工程与全栈技术栈</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              在工程实践与系统构建中常用的工具与技术链条：
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  后端与系统
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  Go, Rust, Python, Node.js, Spring Boot
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  前端与渲染
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  React 19, TypeScript, Rsbuild, Tailwind CSS
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  数据与中间件
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  PostgreSQL, ClickHouse, Redis, Kafka, MySQL
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  云原生与运维
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  Docker, Kubernetes, Linux, Nginx, CI/CD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 博客设计与致谢区块 */}
        <div className="p-6 sm:p-8 rounded-3xl paper-card space-y-6">
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2>关于本站与设计理念</h2>
          </div>

          <div className="space-y-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-w-[65ch]">
            <p>
              本博客旨在打造具有纸质温度与现代极速性能的个人数字空间，摒弃过度装饰，让每一行技术文字如同落于宣纸之上自然呼吸。
            </p>
          </div>

          <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-wrap items-center justify-between text-xs text-stone-500 font-mono gap-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5" />
              <span>纯静态构建 (SSG Ready) &bull; Rsbuild + React 19</span>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={siteConfig.author.github || 'https://github.com/kerntau'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <a
                href={`mailto:${siteConfig.author.email || 'hi@keru.in'}`}
                className="hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
};
