import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import {
  Terminal,
  Layers,
  Sparkles,
  Code2,
} from 'lucide-react';
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

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  go: GoIcon,
  rust: RustIcon,
  python: PythonIcon,
  nodejs: NodejsIcon,
  springboot: SpringBootIcon,
  react: ReactIcon,
  typescript: TypeScriptIcon,
  rsbuild: RsbuildIcon,
  tailwind: TailwindIcon,
  postgres: PostgresIcon,
  clickhouse: ClickHouseIcon,
  redis: RedisIcon,
  kafka: KafkaIcon,
  mysql: MySqlIcon,
  docker: DockerIcon,
  kubernetes: KubernetesIcon,
  linux: LinuxIcon,
  nginx: NginxIcon,
  cicd: CicdIcon,
};

export const About: React.FC = () => {
  const about = siteConfig.about;
  const author = siteConfig.author;

  const identityTitle = about?.identityTitle || 'IDENTITY • 关于作者';
  const quote = about?.quote || `${siteConfig.subtitle}。记录全栈开发、云原生、系统架构与工程实践心得。`;
  const techStackTitle = about?.techStackTitle || '工程与全栈技术栈';
  const techStackDesc = about?.techStackDesc || '在工程实践与系统构建中常用的工具与技术链条：';
  const techCategories = about?.techCategories || [];
  const designTitle = about?.designTitle || '关于本站与设计理念';
  const designPhilosophy =
    about?.designPhilosophy ||
    '本博客旨在打造具有纸质温度与现代极速性能的个人数字空间，摒弃过度装饰，让每一行技术文字如同落于宣纸之上自然呼吸。';

  return (
    <PageShell>
      <Container size="default">
        {/* 顶部个人名片（保持纯净居中排版，微调细节与质感） */}
        <div className="pt-2 pb-10 mb-10 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center text-center">
          {/* 终端标识小标签 */}
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mb-4 px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{identityTitle}</span>
          </div>

          {/* 头像区域：微光渐变边框 + 悬浮微动效 */}
          <div className="relative group mb-3">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-0.5 bg-gradient-to-tr from-sky-200 via-slate-200 to-indigo-200 dark:from-slate-700 dark:via-sky-900 dark:to-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
              <img
                src={author?.avatar || '/avatar.webp'}
                alt={author?.name || 'Author'}
                className="w-full h-full rounded-full object-cover border border-white dark:border-slate-900 shadow-inner"
              />
            </div>
          </div>

          {/* 姓名与简介 */}
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {author?.name || 'kerntau'}
          </h1>
          <p className="text-xs sm:text-[13px] font-mono text-slate-600 dark:text-slate-400 mt-1.5 max-w-md">
            {author?.description || '心中有景,花香满径 | 全栈工程师与开源爱好者'}
          </p>

          {/* 格言引用 */}
          {quote && (
            <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans max-w-xl italic opacity-90 px-4">
              &ldquo;{quote}&rdquo;
            </p>
          )}
        </div>

        {/* 全栈工程技能矩阵（保持原有 4 列分组，微调卡片容器质感与胶囊徽章） */}
        {techCategories.length > 0 && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-sans font-bold text-base sm:text-lg">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2>{techStackTitle}</h2>
            </div>
            {techStackDesc && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {techStackDesc}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {techCategories.map((group) => (
                <div
                  key={group.category}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                      {group.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => {
                      const iconKey = (item.icon || item.name).toLowerCase().replace(/[^a-z0-9]/g, '');
                      const IconComponent = ICON_MAP[iconKey] || Code2;
                      return (
                        <span
                          key={item.name}
                          title={item.desc || item.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:shadow-2xs transition-all duration-150 cursor-default"
                        >
                          <IconComponent size={13} className="shrink-0" />
                          <span>{item.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 博客设计理念区块（保持原样结构，微调质感） */}
        {designPhilosophy && (
          <div className="space-y-3 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 pb-6">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-sans font-bold text-base sm:text-lg">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2>{designTitle}</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-3xl">
              {designPhilosophy}
            </p>
          </div>
        )}
      </Container>
    </PageShell>
  );
};
