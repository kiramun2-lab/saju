'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { DESTINY_AREAS } from '../../../lib/dummyData';
import { getLeadsForResult, getLeadForSection } from '../../../lib/leadMessages';

const PAYMENT_PRICE = 990;

const CARD_ICONS = ['✦', '◈', '☽', '✧', '⋆', '◉', '◎', '✶', '◇', '✵'];

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

export default function SajuResultPage() {
  const searchParams = useSearchParams();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  /** 같은 조건(이름·성별·생년월일·시간 등)이면 같은 seed → 같은 리드 조합 */
  const seedParam = searchParams.get('seed');
  const seedNum = seedParam != null ? Number(seedParam) : undefined;
  const effectiveSeed =
    seedNum !== undefined && !Number.isNaN(seedNum) ? seedNum : undefined;
  const [leads] = useState(() => getLeadsForResult(effectiveSeed));
  /** AI로 생성한 상세 문단 (키: 섹션 id). null이면 아직 로드 전, 없으면 더미 사용 */
  const [aiDetails, setAiDetails] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = sessionStorage.getItem('saju_result_form');
      const form = raw ? (JSON.parse(raw) as Record<string, string>) : null;
      if (!form || cancelled) return;
      fetch('/api/saju/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, leads }),
      })
        .then((res) => res.json())
        .then((data: { details?: Record<string, string[]> }) => {
          if (!cancelled && data.details) setAiDetails(data.details);
        })
        .catch(() => {});
    } catch {
      setAiDetails(null);
    }
    return () => {
      cancelled = true;
    };
  }, [leads]);

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
    <main className="min-h-screen pb-24 pt-6">
      <header className="mb-6 px-4 text-center">
        <p className="text-[11px] text-white/50">운명 읽기 결과</p>
        <h1 className="mt-1 font-serif text-[22px] font-medium tracking-wide text-white">
          당신의 운명이 담긴
          <br />
          열 가지 영역
        </h1>
      </header>

      <section
        ref={carouselRef}
        className="result-carousel"
        aria-label="운명 카드 캐러셀"
        onScroll={handleScroll}
      >
        {DESTINY_AREAS.map((area, index) => {
          const isFree = index === 0;
          const isFlipped = flippedIndex === index;
          const isActive = scrollIndex === index;

          return (
            <div
              key={area.id}
              className={clsx(
                'result-carousel-card-wrap',
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
                  {/* 앞면: 아이콘, 테마, 리드(그라데이션), 뒤집기 힌트만 */}
                  <div
                    className={clsx(
                      'flip-card-front cosmic-glass-panel flex flex-col items-center justify-center px-5 py-6 text-center',
                      !isActive && isFree && 'flip-card-halo',
                      !isActive && !isFree && 'flip-card-glow'
                    )}
                  >
                    <span className="text-2xl text-white/50" aria-hidden>
                      {CARD_ICONS[index % CARD_ICONS.length]}
                    </span>
                    <p className="result-card-theme mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                      {area.theme}
                    </p>
                    <p className="result-card-lead mt-3 leading-snug">
                      {leads[index] ?? getLeadForSection(area.id, 0)}
                    </p>
                    <p className="mt-6 text-[11px] text-white/35">
                      탭하여 카드 뒤집기
                    </p>
                  </div>

                  {/* 뒷면: 디테일 텍스트 스크롤 영역 (max-h 420px) 또는 잠금 */}
                  <div
                    className={clsx(
                      'flip-card-back cosmic-glass-panel flex flex-col px-5 py-5',
                      !isActive && isFree && 'flip-card-halo',
                      !isActive && !isFree && 'flip-card-glow'
                    )}
                  >
                    {isFree ? (
                      <div
                        className="result-card-body max-h-[420px] flex-1 space-y-4 overflow-y-auto text-[13px] leading-relaxed text-white/90"
                        style={{ maxHeight: '420px' }}
                      >
                        {(aiDetails?.[area.id] ?? area.detailParagraphs).map((para, i) => (
                          <p key={i} className="text-white/88 leading-[1.75]">
                            {para}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60">
                          <LockIcon className="text-white/70" />
                        </span>
                        <p className="text-[13px] leading-relaxed text-white/90">
                          나머지 운명을 확인하려면
                          <br />
                          전체 운명 읽기를 해보세요
                        </p>
                        <p className="font-serif text-xl text-white">
                          {PAYMENT_PRICE.toLocaleString()}원
                        </p>
                        <Link
                          href="/payment"
                          className="cta-saju-read w-full rounded-full py-3 text-center text-[14px] font-medium text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          내 운명 전체 보기
                        </Link>
                        <button
                          type="button"
                          className="text-[11px] text-white/40 underline-offset-2 hover:text-white/60"
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

      {/* 인디케이터 점만 */}
      <div className="mt-5 flex justify-center gap-2">
        {DESTINY_AREAS.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'h-1.5 w-1.5 rounded-full transition-colors',
              scrollIndex === i ? 'bg-white/70' : 'bg-white/25'
            )}
            aria-hidden
          />
        ))}
      </div>
    </main>
  );
}
