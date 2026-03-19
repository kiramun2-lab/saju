import { ReactNode } from 'react';
import { AppHeader } from '../../components/layout/app-header';
import { SiteFooter } from '../../components/layout/site-footer';
import { Starfield } from '../../components/cosmic/starfield';

export default function SajuLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 cosmic-bg" aria-hidden />
      <Starfield />
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />
        <div className="min-h-0 flex-1">{children}</div>
        <SiteFooter />
      </div>
    </>
  );
}
