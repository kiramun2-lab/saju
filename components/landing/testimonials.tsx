import { Card } from '../ui/card';

const TESTIMONIALS = [
  {
    id: 1,
    name: '20대 후반 · 학생',
    text: '말이 너무 부드러워서, 밤에 혼자 읽다가 울컥했어요. 다른 운세랑 다르게 진짜 제 마음을 이해해주는 느낌이었어요.'
  },
  {
    id: 2,
    name: '30대 초반 · 직장인',
    text: '결국 중요한 건 제 선택이라는 말을 계속 상기시켜줘서 좋았어요. 가격이 믿기지 않을 정도로 디테일합니다.'
  },
  {
    id: 3,
    name: '20대 중반 · 프리랜서',
    text: '요즘 관계 때문에 고민 많았는데, 애매했던 감정을 딱 정리해주는 문장들이 있어서 스크린샷 잔뜩 찍어뒀어요.'
  }
];

export function Testimonials() {
  return (
    <section className="mt-6 space-y-2">
      <h2 className="text-sm font-semibold text-foreground">사용자 후기</h2>
      <div className="grid gap-2">
        {TESTIMONIALS.map((t) => (
          <Card
            key={t.id}
            className="bg-muted/70"
          >
            <p className="text-xs leading-relaxed text-foreground/80">“{t.text}”</p>
            <p className="mt-2 text-[11px] text-foreground/60">{t.name}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

