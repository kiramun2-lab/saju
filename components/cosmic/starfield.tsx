'use client';

import { useMemo } from 'react';

const STAR_COUNT = 220;
const DUST_COUNT = 24;

/** 시드 하나로 0~1 구간의 의사난수 (한 줄/대각선 패턴 없이 흩어지게) */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function useSeededPositions(seed: number, count: number) {
  return useMemo(() => {
    const out: { left: string; top: string; delay: string; duration: string }[] = [];
    for (let i = 0; i < count; i++) {
      const s1 = seed + i * 7919;
      const s2 = seed + i * 4001 + 31;
      const left = 2 + rand(s1) * 96;
      const top = 2 + rand(s2) * 96;
      out.push({
        left: `${left}%`,
        top: `${top}%`,
        delay: `${rand(s1 + 7) * 5}s`,
        duration: `${2.4 + rand(s2 + 11) * 3.2}s`
      });
    }
    return out;
  }, [seed, count]);
}

function useDustPositions() {
  return useMemo(() => {
    const out: { left: string; top: string; delay: string; dx: number; dy: number }[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      const left = 5 + rand(i * 6781 + 1) * 90;
      const top = 5 + rand(i * 7829 + 2) * 90;
      out.push({
        left: `${left}%`,
        top: `${top}%`,
        delay: `${rand(i * 3 + 5) * 8}s`,
        dx: (rand(i * 11) - 0.5) * 24,
        dy: (rand(i * 13 + 1) - 0.5) * -16
      });
    }
    return out;
  }, []);
}

export function Starfield() {
  const stars = useSeededPositions(42, STAR_COUNT);
  const dust = useDustPositions();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {stars.map((s, i) => (
          <div
            key={`star-${i}`}
            className="star absolute h-px w-px rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              '--delay': s.delay,
              '--duration': s.duration
            } as React.CSSProperties}
          />
        ))}
        {stars.slice(0, 45).map((s, i) => (
          <div
            key={`star-big-${i}`}
            className="star absolute h-0.5 w-0.5 rounded-full bg-white/95"
            style={{
              left: s.left,
              top: s.top,
              '--delay': s.delay,
              '--duration': `${parseFloat(s.duration) * 1.4}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {dust.map((d, i) => (
          <div
            key={`dust-${i}`}
            className="dust-particle absolute h-1 w-1 rounded-full bg-white/25"
            style={{
              left: d.left,
              top: d.top,
              '--delay': d.delay,
              '--duration': '18s',
              '--dx': `${d.dx}px`,
              '--dy': `${d.dy}px`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
