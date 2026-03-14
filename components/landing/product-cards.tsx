import Link from 'next/link';
import { Card, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
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
          <Button
            as-child={true as never}
            size={undefined as never}
          >
            <Link href="/saju">사주 입력하기</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


