import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/layout/Container';
import { siteConfig } from '../content';
import { TechIcon } from '../components/ui/TechIcon';
import {
  MapPin,
  Mail,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  GithubIcon,
  XTwitterIcon,
  MailIcon,
  BilibiliIcon,
  TelegramIcon,
} from '../components/ui/Icons';
import { DecryptedText, ShinyText, FadeContent } from '../components/reactbits';

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
          <span className="tracking-wider uppercase font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70" />
            <span>Profile & Architecture</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>Built with</span>
            <ShinyText text="React 19" className="font-semibold text-slate-700 dark:text-slate-300" speed={4} />
          </span>
        </div>

        {/* 核心卡片容器：流体玻璃宏观大面板 (Tier 3 glass-panel) */}
        <div className="glass-panel p-6 sm:p-8 space-y-7 font-sans relative overflow-hidden">
          
          {/* 1. 个人履历抬头 Header */}
          <FadeContent direction="up" distance={15} duration={0.4}>
            <section className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-slate-100/80 dark:border-white/[0.06]">
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
                    <DecryptedText
                      text={author.name}
                      className="text-xl sm:text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400 font-douyin dark:drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                      style={{ fontFamily: '"Douyin Sans", "抖音美好体", sans-serif' }}
                      animateOn="view"
                      revealDirection="start"
                      speed={50}
                    />
                    {author.statusBadge && (
                      <span className="glass-pill inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-medium text-sky-700 dark:text-sky-300">
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
                          className="glass-tag inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-slate-600 dark:text-slate-300 text-[11px] font-sans transition-all hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5"
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span>{social.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-40 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </FadeContent>

          {/* 2. 工程与全栈技术栈（去厚重框线，轻盈微晶排布） */}
          {techCategories.length > 0 && (
            <FadeContent direction="up" distance={15} delay={0.1} duration={0.4}>
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100/80 dark:border-white/[0.06]">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                    {about?.techStackTitle || '工程与全栈技术栈'}
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    Tech Stack
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
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
                            className="glass-pill group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono text-slate-700 dark:text-slate-200 cursor-default hover:border-sky-400/60 dark:hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all"
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
            </FadeContent>
          )}

          {/* 3. 资格证书与认证（精炼出版级对齐清单，去卡片框化） */}
          {certificates.length > 0 && (
            <FadeContent direction="up" distance={15} delay={0.15} duration={0.4}>
              <section className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                    资格证书与专业认证
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    Certificates
                  </span>
                </div>

                <div className="divide-y divide-slate-100/70 dark:divide-white/[0.04]">
                  {certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2.5 px-2 -mx-2 rounded-md hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70 shrink-0 group-hover:bg-sky-500 group-hover:scale-125 transition-all" />
                        <span className="font-medium text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-snug">
                          {cert.name}
                        </span>
                      </div>

                      <div
                        onClick={() => handleCopy(cert.code)}
                        title="点击复制证书编号"
                        className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-colors pl-4 sm:pl-0 shrink-0 select-all"
                      >
                        <span className="tracking-wide">{cert.code}</span>
                        {copiedCode === cert.code ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-500 font-sans font-medium">
                            <Check className="w-3 h-3" /> 已复制
                          </span>
                        ) : (
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-sky-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeContent>
          )}

        </div>
      </Container>
    </PageShell>
  );
};

export default About;
