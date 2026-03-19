import { ReactNode } from 'react';
import { SiteFooter } from '../../components/layout/site-footer';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="min-h-0 flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
