'use client';

import { useState } from 'react';
import { Card, CardHeader } from '../../components/ui/card';
import {
  getReportAmount,
  getOrderName,
  createOrderId,
  getSuccessUrl,
  getFailUrl,
} from '../../lib/toss';
import { loadTossScript, requestTossPaymentWindow } from '../../lib/load-toss';

export default function PaymentPage() {
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePayment, setAgreePayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  const handlePay = async () => {
    if (!agreePrivacy || !agreePayment) {
      setError('모든 약관에 동의해주세요.');
      return;
    }
    if (!clientKey) {
      setError('결제 설정이 되어 있지 않습니다. (NEXT_PUBLIC_TOSS_CLIENT_KEY)');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await loadTossScript();
      await requestTossPaymentWindow({
        clientKey,
        amount: getReportAmount(),
        orderId: createOrderId(),
        orderName: getOrderName(),
        successUrl: getSuccessUrl(),
        failUrl: getFailUrl(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '결제창을 열 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-4 pb-6 px-4">
      <header className="space-y-1">
        <p className="text-[11px] text-foreground/60">결제 · 운명 리포트</p>
        <h1 className="text-lg font-semibold text-foreground">
          단 990원으로
          <br />
          오늘의 운명을 읽어보세요
        </h1>
        <p className="text-xs text-foreground/70">
          결제는 토스페이먼츠로 안전하게 진행되며,
          <br />
          생성된 리포트는 마이페이지에서 언제든 다시 볼 수 있어요.
        </p>
      </header>

      <Card className="bg-muted/70 border-white/10">
        <CardHeader
          title="상품 정보"
          subtitle="사주 운명 리포트 전체 열람"
        />
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">운명읽기 리포트</p>
              <p className="mt-1 text-foreground/70">
                나만의 언어로 읽어주는 감성 AI 운명 리포트
              </p>
            </div>
            <p className="text-right text-sm font-semibold text-gradient-gold">990원</p>
          </div>
        </div>
      </Card>

      <Card className="bg-muted/70 border-white/10">
        <CardHeader
          title="약관 동의"
          subtitle="서비스 이용을 위해 아래 약관에 동의해 주세요."
        />
        <div className="space-y-2 text-xs text-foreground/80">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-background/80"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            <span>[필수] 개인정보 수집 및 이용 동의</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-background/80"
              checked={agreePayment}
              onChange={(e) => setAgreePayment(e.target.checked)}
            />
            <span>[필수] 결제 진행 및 전자지급 결제대행 서비스 이용 동의 (토스페이먼츠)</span>
          </label>
          <p className="mt-1 text-[10px] text-foreground/50">
            디지털 콘텐츠 특성상, 리포트 생성 이후에는 환불이 어려운 점 양해 부탁드립니다.
          </p>
        </div>
      </Card>

      {error && <p className="text-[11px] text-red-300">{error}</p>}

      <div className="pt-1">
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="cta-saju-read w-full rounded-full py-4 text-center text-[16px] font-medium text-white disabled:opacity-60"
        >
          {loading ? '결제창 여는 중…' : '990원으로 전체 결과 보기'}
        </button>
      </div>
    </main>
  );
}
