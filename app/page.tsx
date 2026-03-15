import Link from 'next/link';
import { Starfield } from '../components/cosmic/starfield';
import { OracleSvg } from '../components/cosmic/oracle-svg';

export default function LandingPage() {
  return (
    <>
      {/* Star background: black + small white stars + subtle animation */}
      <div className="fixed inset-0 cosmic-bg" aria-hidden />
      <Starfield />

      <main className="relative z-10 flex flex-col items-center px-5 pt-4 pb-12">
        {/* 첫 화면: 원 + 캐치프레이즈 + CTA (한 화면에) */}
        <div className="flex min-h-[100vh] min-h-[100dvh] flex-col items-center justify-center">
          <OracleSvg />

          <div className="mt-6 max-w-[340px] text-center">
            <p className="text-[22px] leading-[1.75] text-white">
              당신의 사주는
              <br />
              평범한 사주일까요?
            </p>
            <p className="mt-4 text-[22px] leading-[1.75] text-white">
              아니면
              <br />
              한 번쯤 크게 방향이 바뀌는
              <br />
              사주일까요?
            </p>
            <p className="mt-5 text-[16px] leading-[1.7] text-white opacity-80">
              태어난 순간의 흐름을 분석해
              <br />
              당신의 운명을 읽어드립니다.
            </p>
          </div>

          {/* CTA: 같은 화면에서 조금만 위로 */}
          <div
            className="mt-8 w-full max-w-[360px] pb-[env(safe-area-inset-bottom)]"
            aria-label="운명 읽기 시작"
          >
            <Link
              href="/saju"
              className="cta-saju block w-full rounded-full py-4 text-center font-semibold tracking-wide text-white transition hover:opacity-95"
            >
              운명 읽기 시작
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
