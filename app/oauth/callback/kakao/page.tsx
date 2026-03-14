'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/auth-context';

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('fail');
      setError(searchParams.get('error_description') ?? '로그인이 취소되었습니다.');
      return;
    }
    if (!code) {
      setStatus('fail');
      setError('인가 코드가 없습니다.');
      return;
    }

    fetch('/api/auth/kakao/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('fail');
          setError(data.error);
          return;
        }
        login();
        setStatus('success');
        router.replace('/mypage');
      })
      .catch(() => {
        setStatus('fail');
        setError('로그인 처리에 실패했습니다.');
      });
  }, [searchParams, login, router]);

  return (
    <main className="flex min-h-[40vh] flex-col items-center justify-center px-6">
      {status === 'loading' && (
        <p className="text-white/80">로그인 처리 중...</p>
      )}
      {status === 'fail' && (
        <div className="text-center">
          <p className="text-white/90">로그인에 실패했어요</p>
          {error && <p className="mt-2 text-sm text-white/60">{error}</p>}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-6 rounded-full bg-white/15 px-6 py-3 text-sm text-white"
          >
            로그인 다시 시도
          </button>
        </div>
      )}
    </main>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[40vh] flex-col items-center justify-center px-6">
          <p className="text-white/80">로그인 처리 중...</p>
        </main>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
