import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { InneiHero } from '../components/home/InneiHero';

export const Home: React.FC = () => {
  return (
    <PageShell className="!min-h-0 flex flex-col items-center justify-center pt-2 sm:pt-6 pb-2">
      <Container size="default">
        <InneiHero />
      </Container>
    </PageShell>
  );
};
