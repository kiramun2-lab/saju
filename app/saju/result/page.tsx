'use client';

import { Suspense, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import type { LeadMessageData } from '../../../components/saju/LeadHighlight';
import { LeadHighlight } from '../../../components/saju/LeadHighlight';
import { DESTINY_AREAS } from '../../../lib/dummyData';
import { getLeadsForResult } from '../../../lib/leadMessages';

const PAYMENT_PRICE = 990;

// 테마별 상단 이모지 (overall, love, career, attract, strength, path, talent, money, relation, future)
const CARD_ICONS = ['🌟', '💕', '💼', '✨', '💪', '🧭', '🎨', '💰', '🤝', '🔮'];

/** 카드 뒤집기 액션 암시용 미니멀 회전 아이콘 */
function FlipHintIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SajuResultContent() {
  const searchParams = useSearchParams();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const seedParam = searchParams.get('seed');
  const seedNum = seedParam != null ? Number(seedParam) : undefined;
  const effectiveSeed =
    seedNum !== undefined && !Number.isNaN(seedNum) ? seedNum : undefined;
  const leads = useMemo(
    () => getLeadsForResult(effectiveSeed) ?? [],
    [effectiveSeed]
  );
  const [aiDetails, setAiDetails] = useState<Record<string, string[]> | null>(null);

  // 입력 페이지에서 미리 생성해 둔 디테일이 있으면 사용, 없으면 API 호출
  useEffect(() => {
    let cancelled = false;
    try {
      const cached = sessionStorage.getItem('saju_result_details');
      const parsed = cached ? (JSON.parse(cached) as { seed?: number; details?: Record<string, string[]> }) : null;
      if (effectiveSeed != null && parsed?.seed === effectiveSeed && parsed?.details) {
        setAiDetails(parsed.details);
        return;
      }
    } catch {
      // ignore
    }
    const raw = sessionStorage.getItem('saju_result_form');
    const form = raw ? (JSON.parse(raw) as Record<string, string>) : null;
    if (!form?.birthDate || cancelled) return;
    fetch('/api/saju/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, leads }),
    })
      .then((res) => res.json())
      .then((data: { details?: Record<string, string[]> }) => {
        if (cancelled) return;
        if (data.details) setAiDetails(data.details);
      })
      .catch(() => {
        if (!cancelled) setAiDetails(null);
      });
    return () => {
      cancelled = true;
    };
  }, [leads, effectiveSeed]);

  const handleCardClick = (index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index));
  };

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = Math.min(el.offsetWidth * 0.78, 300) + 16; // 78vw or 300px + gap
    const index = Math.round(el.scrollLeft / cardWidth);
    setScrollIndex(Math.min(Math.max(0, index), DESTINY_AREAS.length - 1));
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <main className="relative min-h-screen pb-24 pt-6">
      <header className="mb-6 px-4 text-center">
        <p className="text-[11px] text-gray-500">운명 읽기 결과</p>
        <h1 className="mt-1 break-keep font-serif text-[22px] font-medium tracking-wide text-slate-50">
          당신의 운명이 담긴
          <br />
          열 가지 영역
        </h1>
      </header>

      <section
        ref={carouselRef}
        className="result-carousel py-20"
        aria-label="운명 카드 캐러셀"
        onScroll={handleScroll}
      >
        {DESTINY_AREAS.map((area, index) => {
          const isFree = index === 0; // 1번만 무료, 나머지 9개는 결제 후 오픈
          const isFlipped = flippedIndex === index;
          const isActive = scrollIndex === index;
          const leadItem = leads[index] ?? area.lead;
          const leadText = typeof leadItem === 'string' ? leadItem : (leadItem as LeadMessageData).text;
          const leadKeywords = typeof leadItem === 'string' ? [] : ((leadItem as LeadMessageData).keywords ?? []);

          return (
            <div
              key={area.id}
              className={clsx(
                'result-carousel-card-wrap transition-all duration-300 ease-out hover:-translate-y-1',
                isActive && 'flip-card-active'
              )}
            >
              <div
                className={clsx('flip-card h-full w-full', isFlipped && 'flipped')}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(index);
                  }
                }}
                aria-label={`${area.theme} 카드, ${isFlipped ? '앞면으로' : '뒷면 보기'} 탭`}
              >
                <div className="flip-card-inner h-full w-full">
                  {/* 앞면: 로고 · 서브타이틀 · 리드 · 뒤집기 아이콘 (전체 가운데 정렬) */}
                  <div
                    className={clsx(
                      'flip-card-front relative flex flex-col items-center justify-center px-5 py-6 text-center'
                    )}
                  >
                    <span
                      className="text-base text-white/35"
                      aria-hidden
                    >
                      {CARD_ICONS[index % CARD_ICONS.length]}
                    </span>
                    <p
                      className="mt-3 break-keep text-sm text-gray-500"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {area.theme}
                    </p>
                    <p className="mt-3 text-[19px] font-bold leading-snug">
                      <LeadHighlight
                        text={leadText}
                        keywords={leadKeywords}
                        variant="gray"
                        className="break-keep text-gray-100"
                      />
                    </p>
                    <span
                      className="mt-5 flex text-white/40 animate-pulse"
                      aria-hidden
                    >
                      <FlipHintIcon className="h-5 w-5" />
                    </span>
                    {/* 하단 그라데이션: 클릭 유도 시각적 무게 */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/5 to-transparent"
                      aria-hidden
                    />
                  </div>

                  {/* 뒷면: 리드 + 디테일 문단 */}
                  <div className="flip-card-back px-5 py-5">
                    {isFree ? (
                      <div className="result-card-back-scroll flex h-full flex-col pr-1">
                        <p className="text-[15px] font-bold leading-snug">
                          <LeadHighlight
                            text={leadText}
                            keywords={leadKeywords}
                            variant="gray"
                            className="break-keep text-gray-100"
                          />
                        </p>
                        <div className="mt-4 space-y-3 break-keep" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                          {(aiDetails?.[area.id] ?? area.detailParagraphs).map((para, i) => (
                            <p
                              key={i}
                              className="text-[13px] leading-relaxed text-gray-100"
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400">
                          <LockIcon className="text-slate-500" />
                        </span>
                        <p className="break-keep text-[13px] leading-relaxed text-gray-100">
                          나머지 운명을 확인하려면
                          <br />
                          전체 운명 읽기를 해보세요
                        </p>
                        <p className="font-serif text-xl text-slate-50">
                          {PAYMENT_PRICE.toLocaleString()}원
                        </p>
                        <Link
                          href="/payment"
                          className="cta-saju-read w-full rounded-full py-3 text-center text-[14px] font-medium text-slate-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          내 운명 전체 보기
                        </Link>
                        <button
                          type="button"
                          className="break-keep text-[11px] text-slate-500 underline-offset-2 hover:text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedIndex(null);
                          }}
                        >
                          앞면으로
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 인디케이터 */}
      <div className="mt-5 flex justify-center gap-2">
        {DESTINY_AREAS.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'h-1.5 w-1.5 rounded-full transition-colors',
              scrollIndex === i ? 'bg-slate-400' : 'bg-slate-600'
            )}
            aria-hidden
          />
        ))}
      </div>
    </main>
  );
}

export default function SajuResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white/60">
          로딩 중…
        </div>
      }
    >
      <SajuResultContent />
    </Suspense>
  );
}
