'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message') ?? '결제가 취소되었거나 실패했습니다.';

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-6">
      <div className="text-center">
        <p className="text-lg font-medium text-white">결제를 완료하지 못했어요.</p>
        <p className="mt-2 text-sm text-white/60">{message}</p>
        {code && (
          <p className="mt-1 text-xs text-white/40">코드: {code}</p>
        )}
        <Link
          href="/payment"
          className="mt-6 inline-block rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white"
        >
          결제 다시 시도
        </Link>
      </div>
    </main>
  );
}
