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
  const techStackTitle = about?.techStackTitle || '工程与全栈技术栈';
  const techCategories = about?.techCategories || [];
  const designTitle = about?.designTitle || '关于本站与设计理念';
  const designPhilosophy =
    about?.designPhilosophy ||
    '本博客旨在打造具有纸质温度与现代极速性能的个人数字空间，摒弃过度装饰，让每一行技术文字如同落于宣纸之上自然呼吸。';

  // 避免个人身份标签与座右铭重复
  const cleanRole = (author?.description || '全栈工程师与开源爱好者').replace(/^心中有景.*?[|｜]\s*/, '').trim();

  // 动态同步页面专属 SEO 信息
  React.useEffect(() => {
    document.title = `关于作者 · ${siteConfig.title}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `关于 ${author?.name || 'kerntau'} - ${cleanRole}。${siteConfig.description}`);
    }
  }, [author?.name, cleanRole]);

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部个人名片（紧凑纯净居中） */}
        <div className="pt-1 pb-5 mb-6 border-b border-slate-200/70 dark:border-slate-800/70 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{identityTitle}</span>
          </div>

          <div className="relative mb-2.5">
            <img
              src={author?.avatar || '/avatar.webp'}
              alt={author?.name || 'Author'}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
            />
          </div>

          <h1 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {author?.name || 'kerntau'}
          </h1>

          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            {cleanRole}
          </p>
        </div>

        {/* 全栈工程技术栈（一体化紧凑行级排版，告别松散大卡片） */}
        {techCategories.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-sans font-semibold text-sm sm:text-base">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2>{techStackTitle}</h2>
            </div>

            {/* 一体化紧凑技术栈面板 */}
            <div className="rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-200/60 dark:divide-slate-800/60 overflow-hidden shadow-2xs">
              {techCategories.map((group) => (
                <div
                  key={group.category}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-3.5 py-2.5 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                >
                  {/* 左侧固定分类名 */}
                  <div className="w-24 shrink-0 font-mono text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70 dark:bg-sky-400/70 shrink-0" />
                    <span>{group.category}</span>
                  </div>

                  {/* 右侧紧凑胶囊徽章 */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {group.items.map((item) => {
                      const iconKey = (item.icon || item.name).toLowerCase().replace(/[^a-z0-9]/g, '');
                      const IconComponent = ICON_MAP[iconKey] || Code2;
                      return (
                        <span
                          key={item.name}
                          title={item.desc || item.name}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-2xs cursor-default"
                        >
                          <IconComponent size={12} className="shrink-0" />
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

        {/* 博客设计理念（极简紧凑收尾） */}
        {designPhilosophy && (
          <div className="space-y-2 pt-5 border-t border-slate-200/70 dark:border-slate-800/70 pb-4">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-sans font-semibold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2>{designTitle}</h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl">
              {designPhilosophy}
            </p>
          </div>
        )}
      </Container>
    </PageShell>
  );
};
