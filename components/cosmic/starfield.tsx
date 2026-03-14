'use client';

import { useMemo } from 'react';

const STAR_COUNT = 220;
const DUST_COUNT = 24;

function useSeededPositions(seed: number, count: number) {
  return useMemo(() => {
    const out: { left: string; top: string; delay: string; duration: string }[] = [];
    for (let i = 0; i < count; i++) {
      const s = (seed * (i + 1) + i * 7) % 100;
      const t = (i * 11 + s * 3) % 100;
      out.push({
        left: `${((s * 13 + i * 5) % 98) + 1}%`,
        top: `${((t * 17 + i * 11) % 98) + 1}%`,
        delay: `${(i * 0.28 + s * 0.02) % 5}s`,
        duration: `${2.8 + (i % 5) * 1.1}s`
      });
    }
    return out;
  }, [seed, count]);
}

function useDustPositions() {
  return useMemo(() => {
    const out: { left: string; top: string; delay: string; dx: number; dy: number }[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      out.push({
        left: `${(i * 19 + 7) % 100}%`,
        top: `${(i * 23 + 13) % 100}%`,
        delay: `${(i * 0.6) % 8}s`,
        dx: (i % 5 - 2) * 10,
        dy: (i % 3 - 1) * -8
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
