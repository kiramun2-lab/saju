'use client';

import { useMemo } from 'react';

export type LeadMessageData = {
  text: string;
  keywords?: string[];
};

type Segment = { type: 'normal' | 'highlight'; content: string };

/* 회색 톤 강조 */
const VARIANTS = {
  gray: {
    text: 'text-slate-200',
    glow: '0 0 6px rgba(148, 163, 184, 0.25)',
  },
  purple: {
    text: 'text-purple-400',
    glow: '0 0 8px rgba(88, 28, 135, 0.5), 0 0 3px rgba(126, 34, 206, 0.35)',
  },
  gold: {
    text: 'text-amber-300',
    glow: '0 0 8px rgba(146, 64, 14, 0.45), 0 0 3px rgba(217, 119, 6, 0.3)',
  },
} as const;

/**
 * text 안에서 keywords에 포함된 단어만 찾아 포인트 컬러 + 미세 글우로 강조.
 * keywords 없거나 비면 전체를 오프화이트로 렌더.
 */
function buildSegments(text: string, keywords: string[]): Segment[] {
  if (!keywords.length) return [{ type: 'normal', content: text }];

  // 긴 키워드 우선 매칭 (겹침 시 긴 것 인정)
  const sorted = [...keywords].filter(Boolean).sort((a, b) => b.length - a.length);
  const matches: { start: number; end: number }[] = [];

  for (const kw of sorted) {
    let pos = 0;
    while (pos < text.length) {
      const i = text.indexOf(kw, pos);
      if (i === -1) break;
      const end = i + kw.length;
      const overlaps = matches.some((m) => (i >= m.start && i < m.end) || (end > m.start && end <= m.end) || (i <= m.start && end >= m.end));
      if (!overlaps) matches.push({ start: i, end });
      pos = i + 1;
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const m of matches) {
    const last = merged[merged.length - 1];
    if (last && m.start <= last.end) {
      last.end = Math.max(last.end, m.end);
    } else {
      merged.push({ ...m });
    }
  }

  const segments: Segment[] = [];
  let idx = 0;
  for (const { start, end } of merged) {
    if (idx < start) {
      segments.push({ type: 'normal', content: text.slice(idx, start) });
    }
    segments.push({ type: 'highlight', content: text.slice(start, end) });
    idx = end;
  }
  if (idx < text.length) {
    segments.push({ type: 'normal', content: text.slice(idx) });
  }
  return segments.length ? segments : [{ type: 'normal', content: text }];
}

type LeadHighlightProps = {
  /** 전체 메시지 */
  text: string;
  /** 강조할 단어들 (text 내에 있는 문자열만 강조됨) */
  keywords?: string[];
  /** 강조 색상 톤 */
  variant?: keyof typeof VARIANTS;
  /** 루트 요소 클래스 (기본: 오프화이트 + 줄바꿈 방지) */
  className?: string;
};

export function LeadHighlight({
  text,
  keywords = [],
  variant = 'gray',
  className = 'break-keep text-gray-100',
}: LeadHighlightProps) {
  const segments = useMemo(() => buildSegments(text, keywords), [text, keywords]);
  const style = VARIANTS[variant];

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === 'highlight' ? (
          <span
            key={i}
            className={`${style.text} drop-shadow-sm`}
            style={{ textShadow: style.glow }}
            role="presentation"
          >
            {seg.content}
          </span>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  );
}
