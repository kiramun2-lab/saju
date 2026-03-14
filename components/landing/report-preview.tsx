import { Card, CardHeader } from '../ui/card';
import { MOCK_REPORT } from '../../lib/dummyData';

export function ReportPreview() {
  const r = MOCK_REPORT;
  return (
    <Card className="mt-4 border-dashed border-white/15 bg-background/80">
      <CardHeader
        icon={<span className="text-sm">✶</span>}
        title="리포트 미리보기"
        subtitle="실제 리포트는 더 길고 상세하게 제공됩니다."
      />
      <div className="space-y-3 text-xs text-foreground/80">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-wide text-accent-gold/90">
            한 줄 요약
          </p>
          <p className="mt-1 text-sm font-semibold">{r.summary.headline}</p>
          <p className="mt-1 text-foreground/70">{r.summary.oneLiner}</p>
        </div>
        <div className="scroll-fade max-h-40 space-y-3 overflow-y-auto pr-1">
          {r.sections.map((s) => (
            <section
              key={s.id}
              className="rounded-xl bg-white/2 p-3"
            >
              <p className="text-[11px] font-semibold text-foreground/70">{s.title}</p>
              <p className="mt-1 text-[11px] text-accent-gold/90">{s.summary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground/70 line-clamp-3">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </Card>
  );
}

