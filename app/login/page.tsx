'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppHeader } from '../../components/layout/app-header';
import { Card } from '../../components/ui/card';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (options: { redirectUri: string }) => void;
      };
    };
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

/**
 * 카카오 로그인 (Kakao.Auth.authorize → redirectUri → 콜백에서 토큰 교환 후 로그인 처리)
 */
export default function LoginPage() {
  const initKakao = useCallback(() => {
    if (typeof window === 'undefined' || !KAKAO_JS_KEY) return;
    if (window.Kakao?.isInitialized()) return;
    window.Kakao?.init(KAKAO_JS_KEY);
  }, []);

  useEffect(() => {
    initKakao();
  }, [initKakao]);

  const handleKakaoLogin = () => {
    if (!KAKAO_REDIRECT_URI) {
      alert('카카오 Redirect URI가 설정되지 않았습니다. (NEXT_PUBLIC_KAKAO_REDIRECT_URI)');
      return;
    }
    if (!window.Kakao?.Auth) {
      alert('카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    window.Kakao.Auth.authorize({ redirectUri: KAKAO_REDIRECT_URI });
  };

  return (
    <>
      <AppHeader />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 pb-12">
        <Card className="w-full max-w-sm border-white/10 bg-white/5 p-6">
          <h1 className="text-center text-lg font-semibold text-white">로그인</h1>
          <p className="mt-2 text-center text-sm text-white/70">
            카카오 계정으로 간편히 로그인하고
            <br />
            나의 운명 리포트를 저장·공유해 보세요.
          </p>
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#191919] transition hover:brightness-110"
          >
            <span>카카오로 3초만에 시작하기</span>
          </button>
          <p className="mt-4 text-center text-xs text-white/50">
            로그인 시 개인정보 수집 및 이용에 동의하게 됩니다.
          </p>
        </Card>
        <Link
          href="/saju"
          className="mt-6 text-sm text-white/60 underline-offset-2 hover:text-white/80 hover:underline"
        >
          로그인 없이 계속하기
        </Link>
      </main>
    </>
  );
}
