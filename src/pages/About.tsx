import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import {
  Shield,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Sparkles,
  Mail,
  Compass,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';

export const About: React.FC = () => {
  return (
    <PageShell>
      <Container>
        {/* 顶部个人名片 */}
        <div className="mb-12 pb-8 border-b border-stone-200/70 dark:border-stone-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 mb-2">
            <Shield className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <span>IDENTITY &bull; 关于序栈</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Perimsx (序栈)
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500">
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>信息安全专业在读学生</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800/70">
              <Terminal className="w-3.5 h-3.5" />
              <span>CTF Pwn / WebSec / Reverse</span>
            </span>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border-l-2 border-stone-400 dark:border-stone-600 max-w-[65ch]">
            <p className="font-serif italic text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              &ldquo;把每一次调试看作与计算机底层的对话，把每一次书写看作记忆的沉淀。在二进制的严苛逻辑与人文纸质的温润之间，寻找平衡的秩序。&rdquo;
            </p>
          </div>
        </div>

        {/* Bento 内容矩阵 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 学习与研究方向 */}
          <div className="p-6 rounded-3xl paper-card space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
              <Cpu className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <h2>安全研究方向</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              作为一名信息安全专业学生，日常研究聚焦于以下核心领域：
            </p>
            <ul className="space-y-2 text-xs font-sans text-stone-600 dark:text-stone-400">
              <li className="flex items-start space-x-2">
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">&bull;</span>
                <span>
                  <strong>二进制漏洞与内存安全 (Pwn)</strong>：Linux 堆内存分配器 (ptmalloc) 机制、内核利用与保护绕过。
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">&bull;</span>
                <span>
                  <strong>逆向工程与反调试 (Reverse)</strong>：x86_64 / ARM64 汇编分析、IDA Pro 与 Frida 动态插桩。
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">&bull;</span>
                <span>
                  <strong>密码学与代数数论 (Crypto)</strong>：椭圆曲线离散对数 (ECC)、零知识证明基础与哈希原语。
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">&bull;</span>
                <span>
                  <strong>Web 安全与渗透测试</strong>：逻辑漏洞挖掘、Node.js 原型链污染与代码审计。
                </span>
              </li>
            </ul>
          </div>

          {/* 全栈与工程构建 */}
          <div className="p-6 rounded-3xl paper-card space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
              <Layers className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <h2>工程与全栈技术栈</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              坚信“防御始于构建，攻防知其底层”，在现代全栈与工具链领域持续探索：
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  编程语言
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  C, Python, TypeScript, Rust, ARM64 ASM
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  前端与架构
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  React 19, Rsbuild, Tailwind CSS, Wouter
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  安全与逆向工具
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  GDB, Pwndbg, Ghidra, Frida, Burp Suite
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-800/50">
                <div className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200">
                  运行与系统
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-mono">
                  Arch Linux, Ubuntu LTS, Docker, Git
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 博客设计与致谢区块 */}
        <div className="p-6 sm:p-8 rounded-3xl paper-card space-y-6">
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-lg">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2>关于本站与设计致谢 (Inspirations)</h2>
          </div>

          <div className="space-y-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-w-[65ch]">
            <p>
              本博客系统由 <strong>Perimsx</strong> 从零独立构思与编写。我们抛弃了花哨的赛博朋克与霓虹灯光效，回归到更具质感与呼吸节奏的<strong>“信纸书写”</strong>隐喻。
            </p>
            <p>
              在视觉体验与架构设计上，本站汲取了诸多卓越开源项目的精髓：
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  astro-gyoza
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  排版美学
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                借鉴其米白色温、字间留白与沉静的阅读体验，让每一行技术文字如同落于宣纸之上。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  blog-v3
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  结构布局
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                借鉴其模块化 Bento Grid 便当盒架构与清晰的信息层级划分。
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-wrap items-center justify-between text-xs text-stone-500 font-mono gap-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5" />
              <span>纯静态构建 (SSG Ready) &bull; 零臃肿依赖</span>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <a
                href="mailto:contact@perimsx.me"
                className="hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
};
