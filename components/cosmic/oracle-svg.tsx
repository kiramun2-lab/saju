'use client';

/**
 * 중앙 원형 영역: SVG radialGradient + mask로 성운 가장자리만 노출,
 * 그 위에 불투명 검은 원 + 텍스트.
 */
const SIZE = 360;
const VIEW_SIZE = SIZE + 80; // viewBox 넓혀서 성운이 잘리지 않게
const CENTER = VIEW_SIZE / 2;
const NEBULA_R = 200;   // 성운 원 반지름 (원 밖 그라데이션을 더 크게)
const DISK_R = 152;     // 중앙 검은 원 반지름

export function OracleSvg() {
  return (
    <div className="hero-oracle hero-oracle--svg">
      <svg
        className="hero-oracle__canvas"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        width={SIZE}
        height={SIZE}
        aria-hidden
      >
        <defs>
          {/* 불규칙/삐쭉 질감: feTurbulence + feDisplacementMap */}
          <filter
            id="noiseFilter"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="4"
              result="noise"
              seed="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* 성운: 중앙 흰색 → 가장자리 검은색. 마스크로 가장자리만 보임. */}
          <radialGradient
            id="nebula-grad"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#c0c0c0" />
            <stop offset="60%" stopColor="#606060" />
            <stop offset="85%" stopColor="#202020" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* 마스크: 중앙 투명(검정), 가장자리 불투명(흰색) → 성운 가장자리만 보임 */}
          <mask id="nebula-mask">
            <radialGradient
              id="mask-grad"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="black" />
              <stop offset="55%" stopColor="black" />
              <stop offset="85%" stopColor="white" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={NEBULA_R}
              fill="url(#mask-grad)"
            />
          </mask>
        </defs>

        {/* 성운 원: 그라데이션 + 마스크 + 노이즈 필터 → 링이 불규칙·삐쭉하게 퍼짐 */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={NEBULA_R}
          fill="url(#nebula-grad)"
          mask="url(#nebula-mask)"
          filter="url(#noiseFilter)"
        />

        {/* 중앙 불투명 검은 원 (텍스트가 올라갈 영역) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={DISK_R}
          fill="#030303"
        />
      </svg>

      {/* 텍스트는 HTML로 중앙 정렬 (SVG 위에 겹침) */}
      <span className="hero-oracle__title">운명읽기</span>
    </div>
  );
}
