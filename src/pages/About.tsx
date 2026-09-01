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
  const identityTitle = about?.identityTitle || 'IDENTITY • 关于作者';
  const quote = about?.quote || `${siteConfig.subtitle}。记录全栈开发、云原生、系统架构与工程实践心得。`;
  const techStackTitle = about?.techStackTitle || '工程与全栈技术栈';
  const techStackDesc = about?.techStackDesc || '在工程实践与系统构建中常用的工具与技术链条：';
  const techCategories = about?.techCategories || [];
  const designTitle = about?.designTitle || '关于本站与设计理念';
  const designPhilosophy = about?.designPhilosophy || '本博客旨在打造具有纸质温度与现代极速性能的个人数字空间，摒弃过度装饰，让每一行技术文字如同落于宣纸之上自然呼吸。';

  return (
    <PageShell>
      <Container>
        {/* 顶部个人名片（去卡片化纯净居中） */}
        <div className="mb-8 pb-7 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-500 mb-3">
            <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{identityTitle}</span>
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

          {quote && (
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-lg">
              &ldquo;{quote}&rdquo;
            </p>
          )}
        </div>

        {/* 全栈工程技能矩阵（去卡片化平铺布局） */}
        {techCategories.length > 0 && (
          <div className="space-y-4 mb-9">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-serif font-semibold text-base sm:text-lg">
              <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h2>{techStackTitle}</h2>
            </div>
            {techStackDesc && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {techStackDesc}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
              {techCategories.map((group) => (
                <div key={group.category} className="space-y-2">
                  <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => {
                      const iconKey = (item.icon || item.name).toLowerCase().replace(/[^a-z0-9]/g, '');
                      const IconComponent = ICON_MAP[iconKey] || Code2;
                      return (
                        <span
                          key={item.name}
                          title={item.desc || item.name}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100/80 dark:bg-slate-800/60 text-[11.5px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors"
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

        {/* 博客设计与致谢区块（去卡片化） */}
        {designPhilosophy && (
          <div className="space-y-2 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 pb-2">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-serif font-semibold text-base sm:text-lg">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2>{designTitle}</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl">
              {designPhilosophy}
            </p>
          </div>
        )}
      </Container>
    </PageShell>
  );
};
