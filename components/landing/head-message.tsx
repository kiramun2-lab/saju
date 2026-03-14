import { Card } from '../ui/card';

export function HeadMessage() {
  return (
    <Card className="bg-background/80">
      <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
        <p>
          <span className="font-semibold text-accent-gold">당신의 사주는</span>
          <br />
          평범한 사주일까요?
        </p>
        <p>
          아니면
          <br />
          한 번씩 크게 방향이 바뀌는 사주일까요?
        </p>
        <p>
          태어난 순간의 흐름을 분석해
          <br />
          당신의 운명을 읽어드립니다.
        </p>
        <p>
          <span className="font-semibold text-accent-gold">지금 확인해보세요.</span>
          <br />
          이미 10만명이 자신의 운명을 읽었습니다.
        </p>
      </div>
    </Card>
  );
}


