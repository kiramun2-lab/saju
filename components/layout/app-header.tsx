'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';

const iconClass = 'h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors';

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15L19 4" />
      <path d="M18 5l2 2-4 4-2-2 4-4" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CircleQuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: '이 서비스는 무엇인가요?',
    a: '태어난 생년월일·시간을 바탕으로 사주를 계산하고, 10가지 영역(전체 기질, 연애, 커리어, 매력, 강점, 인생 방향, 재능, 재물, 인간관계, 미래)에 대한 운명 읽기를 제공하는 서비스입니다.',
  },
  {
    q: '결제는 어떻게 하나요?',
    a: '운명 읽기 결과에서 전체 보기를 선택하시면 결제 페이지로 이동합니다. 카드 등 간편 결제를 지원합니다.',
  },
  {
    q: '입력한 정보는 어떻게 보관되나요?',
    a: '입력하신 생년월일·시간 등은 운명 분석에만 사용되며, 서비스 이용에 필요한 범위에서만 보관합니다.',
  },
  {
    q: '사주 결과는 과학적으로 검증된 건가요?',
    a: '사주·운세는 전통 명리학을 바탕으로 한 참고용 콘텐츠이며, 과학적 검증을 목적으로 하지 않습니다. 재미와 자기 성찰의 참고로 활용해 주세요.',
  },
];

export function AppHeader() {
  const { isLoggedIn, logout } = useAuth();
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-end gap-5 px-4 py-2">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={logout}
            className={iconClass}
            aria-label="로그아웃"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        ) : (
          <Link
            href="/login"
            className={iconClass}
            aria-label="로그인"
          >
            <LoginIcon className="h-5 w-5" />
          </Link>
        )}
        <Link
          href={isLoggedIn ? '/mypage' : '/login'}
          className={iconClass}
          aria-label="마이페이지"
        >
          <UserIcon className="h-5 w-5" />
        </Link>
        <button
          type="button"
          onClick={() => setFaqOpen(true)}
          className={iconClass}
          aria-label="자주 묻는 질문"
        >
          <CircleQuestionIcon className="h-5 w-5" />
        </button>
      </header>

      {/* FAQ 모달 */}
      {faqOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="자주 묻는 질문"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setFaqOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="text-base font-semibold text-white">자주 묻는 질문</h2>
              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4 max-h-[calc(85vh-52px)]">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-medium text-white/95">{item.q}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/75">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
