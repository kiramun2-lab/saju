import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { Noto_Serif_KR } from 'next/font/google';
import { AuthProvider } from '../contexts/auth-context';

export const metadata: Metadata = {
  title: '운명읽기 | 사주의 흐름을 풀어낸 운명 리포트',
  description: '사주의 흐름을 풀어낸 운명 리포트'
};

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/MaruBuri.css"
        />
      </head>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <body
        className={clsx(
          notoSerif.variable,
          'min-h-screen bg-[#030308] text-white antialiased'
        )}
        style={{ fontFamily: "'Pretendard', 'MaruBuri', 'Maruburi', sans-serif" }}
      >
        <div className="mx-auto min-h-screen max-w-md overflow-hidden pt-8">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

