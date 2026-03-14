'use client';

import Link from 'next/link';
import { Card } from '../../../components/ui/card';

/**
 * 내 운명 분석하기 클릭 후 진입하는 분석용 랜딩 페이지
 */
export default function SajuAnalyzePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 pb-24">
      <Card className="w-full max-w-sm border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-white/60">운명 분석</p>
        <h1 className="mt-2 text-xl font-semibold text-white">
          입력하신 정보로
          <br />
          운명을 읽고 있어요
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          잠시만 기다려 주시면
          <br />
          사주의 흐름을 풀어낸 운명 리포트가 준비됩니다.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/saju/result"
            className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/15"
          >
            결과 미리보기 (데모)
          </Link>
          <Link
            href="/payment"
            className="block w-full rounded-xl bg-white/15 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
          >
            990원으로 전체 결과 보기
          </Link>
        </div>
      </Card>
    </main>
  );
}
