import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { InneiHero } from '../components/home/InneiHero';
import { RecentWriting } from '../components/home/RecentWriting';
import { TechRadarCard } from '../components/bento/TechRadarCard';
import { InspirationCard } from '../components/bento/InspirationCard';
import { QuickNotesCard } from '../components/bento/QuickNotesCard';

export const Home: React.FC = () => {
  return (
    <PageShell>
      <Container>
        {/* Innei 经典 Hero 氛围开场 */}
        <InneiHero />

        {/* Innei 经典近期笔墨时间轴列表 */}
        <RecentWriting />

        {/* Bento 模块扩展 (技术雷达 + 攻防速记 + 灵感致谢) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TechRadarCard />
            </div>
            <div className="md:col-span-1">
              <QuickNotesCard />
            </div>
            <div className="md:col-span-3">
              <InspirationCard />
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
};
