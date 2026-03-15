'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';

/**
 * 운명 읽어보기 진입 후 페이지들에서만 노출 (우측 상단 로그인/로그아웃 | 마이페이지)
 * 로그인 시: 로그아웃 | 마이페이지 → /mypage
 * 비로그인 시: 로그인 | 마이페이지 → /login
 */
export function AppHeader() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-3 px-4 py-3 text-sm">
      {isLoggedIn ? (
        <button
          type="button"
          onClick={logout}
          className="text-white/80 underline-offset-2 hover:text-white hover:underline"
        >
          로그아웃
        </button>
      ) : (
        <Link
          href="/login"
          className="text-white/80 underline-offset-2 hover:text-white hover:underline"
        >
          로그인
        </Link>
      )}
      <span className="h-3 w-px bg-white/30" aria-hidden />
      <Link
        href={isLoggedIn ? '/mypage' : '/login'}
        className="text-white/80 underline-offset-2 hover:text-white hover:underline"
      >
        마이페이지
      </Link>
    </header>
  );
}
