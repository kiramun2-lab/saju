'use client';

import { useMemo } from 'react';

const STAR_COUNT = 220;
const DUST_COUNT = 24;

/** 시드 기반 의사난수 (서버/클라이언트 동일 → Hydration 안전), 별 위치 흐트러뜨리기용 */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useSeededPositions(seed: number, count: number) {
  return useMemo(() => {
    const rng = mulberry32(seed);
    const out: { left: string; top: string; delay: string; duration: string }[] = [];
    for (let i = 0; i < count; i++) {
      out.push({
        left: `${rng() * 97 + 1}%`,
        top: `${rng() * 97 + 1}%`,
        delay: `${rng() * 5}s`,
        duration: `${2.2 + rng() * 2.5}s`
      });
    }
    return out;
  }, [seed, count]);
}

function useDustPositions() {
  return useMemo(() => {
    const rng = mulberry32(12345);
    const out: { left: string; top: string; delay: string; dx: number; dy: number }[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      out.push({
        left: `${rng() * 98 + 1}%`,
        top: `${rng() * 98 + 1}%`,
        delay: `${rng() * 8}s`,
        dx: (rng() * 40 - 20) | 0,
        dy: (rng() * -24 + 4) | 0
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
