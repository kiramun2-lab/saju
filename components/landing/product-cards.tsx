import Link from 'next/link';
import { Card, CardFooter, CardHeader } from '../ui/card';
import { PRODUCTS } from '../../lib/dummyData';

export function ProductCards() {
  const saju = PRODUCTS.find((p) => p.id === 'saju');

  if (!saju) return null;

  return (
    <div className="space-y-3">
      <Card className="border-white/10 bg-muted/70">
        <CardHeader
          icon={<span className="text-lg">☾</span>}
          title={saju.name}
          subtitle={saju.description}
        />
        <CardFooter>
          <div className="text-xs text-foreground/60">
            <p>990원에 받는 감성적인 나만의 사주 리포트.</p>
            <p className="mt-1 text-accent-gold">단 990원 · 모바일 전용</p>
          </div>
          <Link
            href="/saju"
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all bg-white/8 text-foreground shadow-card-soft hover:bg-white/12 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
          >
            사주 입력하기
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}


