'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setStatus('fail');
      setError('결제 정보가 없습니다.');
      return;
    }

    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code ?? data.error) {
          setStatus('fail');
          setError(data.message ?? data.error ?? '결제 승인에 실패했습니다.');
        } else {
          setStatus('success');
        }
      })
      .catch(() => {
        setStatus('fail');
        setError('결제 승인 요청에 실패했습니다.');
      });
  }, [searchParams]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-6">
      {status === 'loading' && (
        <p className="text-white/80">결제를 확인하고 있어요...</p>
      )}
      {status === 'success' && (
        <div className="text-center">
          <p className="text-lg font-medium text-white">결제가 완료되었어요.</p>
          <p className="mt-2 text-sm text-white/70">
            운명 리포트를 확인해 보세요.
          </p>
          <Link
            href="/saju/result"
            className="mt-6 inline-block rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white"
          >
            결과 보기
          </Link>
        </div>
      )}
      {status === 'fail' && (
        <div className="text-center">
          <p className="text-lg font-medium text-white">결제 처리에 실패했어요.</p>
          {error && <p className="mt-2 text-sm text-white/60">{error}</p>}
          <Link
            href="/payment"
            className="mt-6 inline-block rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white"
          >
            결제 다시 시도
          </Link>
        </div>
      )}
    </main>
  );
}
