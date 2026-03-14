import { ReactNode } from 'react';
import { Button } from '../ui/button';

type FixedCTAProps = {
  label?: string;
  priceLabel?: string;
  onClickHref?: string;
  icon?: ReactNode;
};

export function FixedCTA({
  label = '단 990원, 지금 바로 리포트 받기',
  priceLabel = '990원',
  onClickHref = '/saju',
  icon
}: FixedCTAProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-4">
      <div className="pointer-events-auto w-full max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-primary-dark/95 via-primary/95 to-primary-dark/95 p-3 shadow-card-soft backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between text-xs text-foreground/80">
            <span className="flex items-center gap-1">
              {icon ?? <span className="text-accent-gold">✶</span>}
              <span>{label}</span>
            </span>
            <span className="font-semibold text-gradient-gold">{priceLabel}</span>
          </div>
          <Button
            as-child={true as never}
            fullWidth
          >
            {/* Simple anchor; swap to Link if preferred */}
            <a href={onClickHref}>운명 리포트 시작하기</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

