const FAQ_ITEMS = [
  {
    q: '정말 990원만 결제하면 되나요?',
    a: '네, MVP 기간 동안에는 모든 리포트를 990원에 제공하고 있습니다. 숨겨진 추가 결제는 없습니다.'
  },
  {
    q: '리포트는 어떻게 만들어지나요?',
    a: '입력하신 정보를 바탕으로 AI가 서사적인 문장으로 재구성하여, 감성적인 리포트 형식으로 전달해드립니다.'
  },
  {
    q: '리포트는 어디서 다시 볼 수 있나요?',
    a: '카카오 로그인 후 마이페이지에서 언제든지 다시 열람하실 수 있습니다.'
  },
  {
    q: '결제 후 환불이 가능한가요?',
    a: '디지털 콘텐츠 특성상 이미 생성된 리포트는 환불이 어려운 점 양해 부탁드립니다.'
  }
];

export function FAQ() {
  return (
    <section className="mt-6 space-y-2">
      <h2 className="text-sm font-semibold text-foreground">자주 묻는 질문</h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-white/10 bg-muted/70 px-3 py-2 text-xs"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-foreground/90">
              <span>{item.q}</span>
              <span className="ml-2 text-foreground/50 group-open:hidden">＋</span>
              <span className="ml-2 hidden text-foreground/50 group-open:inline">－</span>
            </summary>
            <p className="mt-2 text-foreground/70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

