import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { InneiHero } from '../components/home/InneiHero';
import { HomeSplitSection } from '../components/home/HomeSplitSection';

export const Home: React.FC = () => {
  return (
    <PageShell>
      {/* 顶部 Hero 保持原样标准紧凑版心不变 */}
      <Container size="default">
        <InneiHero />
      </Container>

      {/* 下部双栏专区: 保持超宽开阔展开，左右小边距不变 */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <HomeSplitSection />
      </div>
    </PageShell>
  );
};
