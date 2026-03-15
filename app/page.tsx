import Link from 'next/link';
import { Starfield } from '../components/cosmic/starfield';
import { OracleSvg } from '../components/cosmic/oracle-svg';

export default function LandingPage() {
  return (
    <>
      {/* Star background: black + small white stars + subtle animation */}
      <div className="fixed inset-0 cosmic-bg" aria-hidden />
      <Starfield />

      <main className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-8 pb-12">
        {/* 운명읽기 원 + 캐치프레이즈 */}
        <div className="flex flex-col items-center pt-2">
          <OracleSvg />

          <div className="mt-8 max-w-[340px] text-center">
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
        </div>

        {/* CTA: 스크롤해야 보임, 글자와 겹치지 않음 */}
        <div
          className="mt-16 w-full max-w-[360px] pb-[env(safe-area-inset-bottom)]"
          aria-label="운명 읽기 시작"
        >
          <Link
            href="/saju"
            className="cta-saju block w-full rounded-full py-4 text-center font-semibold tracking-wide text-white transition hover:opacity-95"
          >
            운명 읽기 시작
          </Link>
        </div>
      </main>
    </>
  );
}
