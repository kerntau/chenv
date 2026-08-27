import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import {
  Terminal,
  Layers,
  Sparkles,
  Mail,
  Compass,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import {
  GoIcon,
  RustIcon,
  PythonIcon,
  NodejsIcon,
  SpringBootIcon,
  ReactIcon,
  TypeScriptIcon,
  RsbuildIcon,
  TailwindIcon,
  PostgresIcon,
  ClickHouseIcon,
  RedisIcon,
  KafkaIcon,
  MySqlIcon,
  DockerIcon,
  KubernetesIcon,
  LinuxIcon,
  NginxIcon,
  CicdIcon,
} from '../components/ui/TechIcons';
import { siteConfig } from '../content';

export const About: React.FC = () => {
  return (
    <PageShell>
      <Container>
        {/* 顶部个人名片（去卡片化纯净居中） */}
        <div className="mb-8 pb-7 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-500 mb-3">
            <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>IDENTITY &bull; 关于作者</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <img
              src={siteConfig.author.avatar || '/avatar.webp'}
              alt={siteConfig.author.name}
              className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                {siteConfig.author.name}
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-1">
                {siteConfig.author.description}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-lg">
            &ldquo;{siteConfig.subtitle}。记录全栈开发、云原生、系统架构与工程实践心得。&rdquo;
          </p>
        </div>

        {/* 全栈工程技能矩阵（去卡片化平铺布局） */}
        <div className="space-y-4 mb-9">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-serif font-semibold text-base sm:text-lg">
            <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h2>工程与全栈技术栈</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            在工程实践与系统构建中常用的工具与技术链条：
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
            {/* 后端与系统 */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                后端与系统
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <GoIcon size={13} className="shrink-0" />
                  <span>Go</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <RustIcon size={13} className="shrink-0 text-slate-800 dark:text-slate-200" />
                  <span>Rust</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <PythonIcon size={13} className="shrink-0" />
                  <span>Python</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <NodejsIcon size={13} className="shrink-0" />
                  <span>Node.js</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <SpringBootIcon size={13} className="shrink-0" />
                  <span>Spring Boot</span>
                </span>
              </div>
            </div>

            {/* 前端与渲染 */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                前端与渲染
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <ReactIcon size={13} className="shrink-0" />
                  <span>React 19</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <TypeScriptIcon size={13} className="shrink-0" />
                  <span>TypeScript</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <RsbuildIcon size={13} className="shrink-0" />
                  <span>Rsbuild</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <TailwindIcon size={13} className="shrink-0" />
                  <span>Tailwind CSS</span>
                </span>
              </div>
            </div>

            {/* 数据与中间件 */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                数据与中间件
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <PostgresIcon size={13} className="shrink-0" />
                  <span>PostgreSQL</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <ClickHouseIcon size={13} className="shrink-0" />
                  <span>ClickHouse</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <RedisIcon size={13} className="shrink-0" />
                  <span>Redis</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <KafkaIcon size={13} className="shrink-0 text-slate-800 dark:text-slate-200" />
                  <span>Kafka</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <MySqlIcon size={13} className="shrink-0" />
                  <span>MySQL</span>
                </span>
              </div>
            </div>

            {/* 云原生与运维 */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                云原生与运维
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <DockerIcon size={13} className="shrink-0" />
                  <span>Docker</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <KubernetesIcon size={13} className="shrink-0" />
                  <span>Kubernetes</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <LinuxIcon size={13} className="shrink-0" />
                  <span>Linux</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <NginxIcon size={13} className="shrink-0" />
                  <span>Nginx</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors">
                  <CicdIcon size={13} className="shrink-0" />
                  <span>CI/CD</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 博客设计与致谢区块（去卡片化） */}
        <div className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-serif font-semibold text-base sm:text-lg">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2>关于本站与设计理念</h2>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl">
            <p>
              本博客旨在打造具有纸质温度与现代极速性能的个人数字空间，摒弃过度装饰，让每一行技术文字如同落于宣纸之上自然呼吸。
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono gap-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5" />
              <span>纯静态构建 (SSG Ready) &bull; Rsbuild + React 19</span>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={siteConfig.author.github || 'https://github.com/kerntau'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <a
                href={`mailto:${siteConfig.author.email || 'hi@keru.in'}`}
                className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1"
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
