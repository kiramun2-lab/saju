'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { DESTINY_AREAS } from '../../../lib/dummyData';

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
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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
                  {/* 앞면: 테마, 리드 (가운데 정렬, 크게) */}
                  <div
                    className={clsx(
                      'flip-card-front cosmic-glass-panel items-center justify-center px-5 py-6 text-center',
                      !isActive && isFree && 'flip-card-halo',
                      !isActive && !isFree && 'flip-card-glow'
                    )}
                  >
                    <span className="text-2xl text-white/40" aria-hidden>
                      {CARD_ICONS[index % CARD_ICONS.length]}
                    </span>
                    <p className="mt-3 text-[12px] font-medium uppercase tracking-wider text-white/50">
                      {area.theme}
                    </p>
                    <p className="mt-2 text-[18px] font-medium leading-snug text-white/95">
                      {area.lead}
                    </p>
                  </div>

                  {/* 뒷면: 무료는 디테일, 잠금은 결제 유도 */}
                  <div
                    className={clsx(
                      'flip-card-back cosmic-glass-panel px-5 py-5',
                      !isActive && isFree && 'flip-card-halo',
                      !isActive && !isFree && 'flip-card-glow'
                    )}
                  >
                    {isFree ? (
                      <div className="flex h-full flex-col overflow-y-auto">
                        <p className="font-serif text-[13px] leading-relaxed text-[#e8d5a3]/95">
                          {area.keySentence}
                        </p>
                        <div className="mt-3 flex-1 space-y-2">
                          {area.detailParagraphs.map((para, i) => (
                            <p
                              key={i}
                              className="text-[12px] leading-relaxed text-white/80"
                            >
                              {para}
                            </p>
                          ))}
                        </div>
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
