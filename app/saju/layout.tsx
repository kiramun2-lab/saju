import { ReactNode } from 'react';
import { AppHeader } from '../../components/layout/app-header';
import { Starfield } from '../../components/cosmic/starfield';

export default function SajuLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 cosmic-bg" aria-hidden />
      <Starfield />
      <div className="relative z-10 min-h-screen">
        <AppHeader />
        {children}
      </div>
    </>
  );
}
