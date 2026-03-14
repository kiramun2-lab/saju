import { ReactNode } from 'react';
import { clsx } from 'clsx';

type CardProps = {
  children: ReactNode;
  className?: string;
  /** true면 카드 안 블러/글로우 음영 제거 (로그인·마이페이지용) */
  noOverlay?: boolean;
};

export function Card({ children, className, noOverlay }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl p-4',
        'glass',
        'relative overflow-hidden',
        className
      )}
    >
      {!noOverlay && (
        <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen">
          <div className="absolute -top-28 right-0 h-40 w-40 rounded-full bg-primary/35 blur-3xl" />
          <div className="absolute -bottom-28 left-0 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
        </div>
      )}
      <div className={noOverlay ? undefined : 'relative z-10'}>{children}</div>
    </div>
  );
}

type CardHeaderProps = {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
};

export function CardHeader({ title, subtitle, icon }: CardHeaderProps) {
  return (
    <div className="mb-3 flex items-start gap-3">
      {icon && <div className="mt-1 text-accent-gold/90">{icon}</div>}
      <div>
        {title && <h3 className="text-sm font-semibold text-foreground/95">{title}</h3>}
        {subtitle && <p className="mt-1 text-xs text-foreground/65">{subtitle}</p>}
      </div>
    </div>
  );
}

type CardFooterProps = {
  children: ReactNode;
  className?: string;
};

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={clsx('mt-4 flex items-center justify-between', className)}>{children}</div>;
}

