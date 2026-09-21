import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/layout/Container';
import { PageEpigraph } from '../components/layout/PageEpigraph';
import { siteConfig } from '../content';
import { TechIcon } from '../components/ui/TechIcon';
import {
  MapPin,
  Mail,
  ExternalLink,
} from 'lucide-react';
import {
  GithubIcon,
  XTwitterIcon,
  MailIcon,
  BilibiliIcon,
  TelegramIcon,
} from '../components/ui/Icons';

const SOCIAL_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  bilibili: BilibiliIcon,
  x: XTwitterIcon,
  email: MailIcon,
  telegram: TelegramIcon,
};

export const About: React.FC = () => {
  const author = siteConfig.author;
  const about = siteConfig.about;
  const socials = author.socials || [];
  const techCategories = about?.techCategories || [];
  const certificates = about?.certificates || [];

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部微注脚 */}
        <div className="flex items-center justify-between px-1 mb-2.5 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          <span className="tracking-wider uppercase font-medium">About & Profile</span>
          <span className="flex items-center gap-1.5">
            <span>Built with</span>
            <strong className="font-semibold text-slate-700 dark:text-slate-300">React 19</strong>
          </span>
        </div>

        {/* 核心卡片容器：纸墨温润、极简大气、流体玻璃 */}
        <div className="paper-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/75 dark:bg-[#0c121e]/75 shadow-fluid-glass dark:shadow-fluid-glass-dark space-y-6 font-sans backdrop-blur-xl relative overflow-hidden">
          
          {/* 1. 个人履历抬头 Header */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-5 border-b border-slate-100/80 dark:border-white/[0.06]">
            {/* 头像 */}
            <div className="relative shrink-0">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full object-cover ring-2 ring-slate-100/80 dark:ring-white/10 shadow-xs"
              />
              <span
                title={author.statusBadge || '在席中'}
                className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs"
              />
            </div>

            {/* 姓名、定位与属性 */}
            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                    {author.name}
                  </h1>
                  {author.statusBadge && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/50 text-[11px] font-medium text-sky-700 dark:text-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                      <span>{author.statusBadge}</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
                {author.description}
              </p>

              {/* 扁平化属性条带 */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                {author.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>常驻：</span>
                    <strong className="font-medium text-slate-800 dark:text-slate-200">{author.location}</strong>
                  </span>
                )}
                {author.location && author.email && <span className="opacity-40">•</span>}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>邮箱：</span>
                    <strong className="font-medium text-slate-800 dark:text-slate-200">{author.email}</strong>
                  </a>
                )}
              </div>

              {/* 社交矩阵徽标流 */}
              {socials.length > 0 && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                  {socials.map((social) => {
                    const IconComponent = SOCIAL_ICONS[social.icon] || MailIcon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        data-external-bypass="true"
                        className="glass-icon-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-[11px] font-sans transition-all hover:-translate-y-0.5"
                      >
                        <IconComponent className="w-3.5 h-3.5 shrink-0" />
                        <span>{social.name}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-35 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 2. 工程与全栈技术栈（平铺精致徽标墙，去厚重灰底框） */}
          {techCategories.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100/80 dark:border-white/[0.06]">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                  {about?.techStackTitle || '工程与全栈技术栈'}
                </h2>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  Tech Stack
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {techCategories.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">
                      <span className="w-1 h-3 rounded-full bg-sky-500/80" />
                      <span>{cat.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item) => (
                        <div
                          key={item.name}
                          title={item.desc}
                          className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/70 dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-sky-400/60 dark:hover:border-sky-400/50 hover:bg-white/80 dark:hover:bg-white/[0.08] text-xs font-mono text-slate-700 dark:text-slate-200 transition-all cursor-default hover:-translate-y-0.5"
                        >
                          <TechIcon name={item.name} className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium text-[11.5px]">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. 资格证书与认证（去工单卡片化，回归出版级纯净排版） */}
          {certificates.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                  资格证书与专业认证
                </h2>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  Certificates
                </span>
              </div>

              <div className="space-y-1.5 text-xs sm:text-[13px] font-sans">
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 px-2 -mx-2 rounded-md hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {cert.name}
                      </span>
                    </div>

                    <span
                      onClick={() => handleCopy(cert.code)}
                      title="点击复制证书编号"
                      className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-colors pl-3.5 sm:pl-0 shrink-0 select-all"
                    >
                      <span>{cert.code}</span>
                      {copiedCode === cert.code ? (
                        <span className="text-[10px] text-emerald-500 font-sans">✓ 已复制</span>
                      ) : (
                        <span className="text-[10px] opacity-0 hover:opacity-100 text-slate-400">复制</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* 底部题跋 */}
        <div className="mt-8 sm:mt-10">
          <PageEpigraph quote="行远自迩，笃行不怠。" />
        </div>
      </Container>
    </PageShell>
  );
};

export default About;
