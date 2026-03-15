'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { hashSajuInput, getLeadsForResult } from '../../lib/leadMessages';

type SajuFormState = {
  name: string;
  relation: string;
  birthDate: string;
  calendarType: 'solar' | 'lunar' | '';
  birthTime: string;
  gender: string;
};

type SajuFormErrors = Partial<Record<keyof SajuFormState, string>>;

// 불규칙 퍼센트 단계 (0 → 100%, 약 20~25초)
const PROGRESS_STEPS: { pct: number; lines: string[] }[] = [
  { pct: 0, lines: ['운명의 문을 여는 중…'] },
  { pct: 3, lines: ['운명의 문을 여는 중…'] },
  { pct: 7, lines: ['태어난 순간의 좌표를 찾는 중…'] },
  { pct: 12, lines: ['태어난 순간의 좌표를 찾는 중…'] },
  { pct: 18, lines: ['사주 팔자를 정렬하는 중…'] },
  { pct: 26, lines: ['사주 팔자를 정렬하는 중…'] },
  { pct: 34, lines: ['별의 흐름을 계산하는 중…'] },
  { pct: 41, lines: ['당신의 사주는', '생각보다 흥미로울 수도 있습니다'] },
  { pct: 53, lines: ['당신의 타고난 기운을 분석하는 중…'] },
  { pct: 67, lines: ['숨겨진 운명의 패턴을 찾는 중…'] },
  { pct: 78, lines: ['앞으로의 흐름을 해석하는 중…'] },
  { pct: 86, lines: ['중요한 전환점을 확인하는 중…'] },
  { pct: 93, lines: ['운명의 문장을 정리하는 중…'] },
  { pct: 100, lines: ['분석 완료', '당신의 운명이 준비되었습니다'] },
];

// 진행률은 0→93%까지만 타임라인으로. 100%는 API 응답 후에만 설정
const STEP_TIMINGS_MS = [
  0, 1200, 2600, 4200, 5800, 7800, 9800, 11800, 13800, 16300, 18300, 19800, 20800, 21800,
];
const MAX_PCT_BEFORE_API = 93; // API 오기 전까지 최대 93%

export default function SajuInputPage() {
  const router = useRouter();
  const [form, setForm] = useState<SajuFormState>({
    name: '',
    relation: '',
    birthDate: '',
    calendarType: '',
    birthTime: '',
    gender: '',
  });
  const [errors, setErrors] = useState<SajuFormErrors>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const [maxDate, setMaxDate] = useState('');
  const timelineStart = useRef<number | null>(null);
  const rafId = useRef<number>(0);
  const apiCompletedRef = useRef(false);

  useEffect(() => {
    setMaxDate(new Date().toISOString().slice(0, 10));
  }, []);

  const handleChange = (field: keyof SajuFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const nextErrors: SajuFormErrors = {};
    const nameTrim = form.name?.trim() ?? '';
    if (!nameTrim) nextErrors.name = '이름을 입력해주세요.';
    if (!form.birthDate) nextErrors.birthDate = '생년월일을 선택해주세요.';
    if (!form.calendarType) nextErrors.calendarType = '양력/음력을 선택해주세요.';
    if (!form.gender) nextErrors.gender = '성별을 선택해주세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // 진행률 0→93%만 타임라인으로. API 응답 오면 타임라인 멈추고 100% 유지
  useEffect(() => {
    if (!isAnalyzing) return;
    apiCompletedRef.current = false;
    timelineStart.current = Date.now();

    const tick = () => {
      if (apiCompletedRef.current) return; // API 완료됐으면 더 이상 진행률 갱신 안 함
      const start = timelineStart.current;
      if (start == null) return;
      const elapsed = Date.now() - start;

      let nextStep = 0;
      for (let i = STEP_TIMINGS_MS.length - 1; i >= 0; i--) {
        if (elapsed >= STEP_TIMINGS_MS[i]) {
          nextStep = i;
          break;
        }
      }
      const pct = Math.min(PROGRESS_STEPS[nextStep].pct, MAX_PCT_BEFORE_API);
      setProgressPct(pct);
      setStepIndex(pct >= MAX_PCT_BEFORE_API ? PROGRESS_STEPS.length - 2 : nextStep);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isAnalyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsAnalyzing(true);
  };

  // "내 운명 읽기" 누른 순간 Gemini 1회 호출. 응답 오면 100% + CTA 바로 표시
  useEffect(() => {
    if (!isAnalyzing) return;
    setShowCta(false);
    const seed = hashSajuInput({
      name: form.name,
      relation: form.relation,
      birthDate: form.birthDate,
      calendarType: form.calendarType,
      birthTime: form.birthTime,
      gender: form.gender,
    });
    const leads = getLeadsForResult(seed);
    fetch('/api/saju/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form: {
          name: form.name,
          relation: form.relation,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          gender: form.gender,
          calendarType: form.calendarType,
        },
        leads,
      }),
    })
      .then((res) => res.json())
      .then((data: { details?: Record<string, string[]> }) => {
        if (data.details) {
          try {
            sessionStorage.setItem(
              'saju_result_details',
              JSON.stringify({ seed, details: data.details })
            );
          } catch {
            // ignore
          }
        }
        apiCompletedRef.current = true;
        setProgressPct(100);
        setStepIndex(PROGRESS_STEPS.length - 1);
        setShowCta(true);
      })
      .catch(() => {
        apiCompletedRef.current = true;
        setProgressPct(100);
        setStepIndex(PROGRESS_STEPS.length - 1);
        setShowCta(true);
      });
  }, [isAnalyzing, form.name, form.relation, form.birthDate, form.birthTime, form.gender, form.calendarType]);

  const goToResult = () => {
    const seed = hashSajuInput({
      name: form.name,
      relation: form.relation,
      birthDate: form.birthDate,
      calendarType: form.calendarType,
      birthTime: form.birthTime,
      gender: form.gender,
    });
    try {
      sessionStorage.setItem('saju_result_form', JSON.stringify(form));
    } catch {
      // ignore
    }
    router.push(`/saju/result?seed=${seed}`);
  };

  const inputBase =
    'mt-1.5 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none transition-colors';
  const labelClass = 'block text-[16px] font-medium text-white/85 tracking-wide';

  // ——— Cosmic analysis loading screen (20~25초, 불규칙 %, 100% 후 CTA) ———
  if (isAnalyzing) {
    const step = PROGRESS_STEPS[stepIndex];
    const isInitial = progressPct === 0 && stepIndex === 0;
    const isComplete = progressPct === 100;

    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6">
        <div className="w-full max-w-[320px] space-y-8">
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-white/90 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* 퍼센트 숫자 */}
          <p className="text-center font-serif text-3xl tabular-nums tracking-wide text-white/95">
            {progressPct}%
          </p>

          {/* 단계 메시지 */}
          <div className="min-h-[3.5rem] text-center">
            {isInitial ? (
              <>
                <p className="text-[15px] leading-relaxed text-white/90">
                  운명의 흐름을 분석하는 중입니다
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  사주를 계산하는 데에는
                  <br />
                  잠시 시간이 필요합니다
                </p>
              </>
            ) : (
              step.lines.map((line, i) => (
                <p
                  key={i}
                  className={clsx(
                    i === 0 ? 'text-[15px]' : 'mt-1 text-[14px]',
                    'leading-relaxed text-white/90'
                  )}
                >
                  {line}
                </p>
              ))
            )}
          </div>

          {/* 100% 완료 후 CTA (아래에서 올라오며 등장, 등장 전에는 렌더되지 않음) */}
          {showCta && (
            <div className="cta-reveal">
              <button
                type="button"
                onClick={goToResult}
                className="cta-saju-read w-full rounded-full py-4 text-[16px] font-medium text-white"
              >
                내 운명 열어보기
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-16 pt-6">
      {/* Header: mystical, minimal */}
      <header className="mb-8 text-center">
        <h1 className="font-serif text-[22px] font-medium leading-[1.5] text-white tracking-wide">
          운명을 읽기 위한
          <br />
          좌표를 입력하세요
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-white/60">
          태어난 순간을 통해
          <br />
          당신의 사주를 분석합니다
        </p>
      </header>

      {/* Form: cosmic glass panel */}
      <div className="cosmic-glass-panel rounded-2xl p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              className={inputBase}
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-slate-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>누구의 운명인가요</label>
            <select
              className={inputBase}
              value={form.relation}
              onChange={(e) => handleChange('relation', e.target.value)}
            >
              <option value="">선택해주세요</option>
              <option value="self">본인</option>
              <option value="family">가족</option>
              <option value="friend">친구</option>
              <option value="lover">연인/배우자</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>태어난 날</label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="date"
                className={inputBase + ' flex-1'}
                min="1900-01-01"
                max={maxDate || undefined}
                value={form.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
              />
              <div className="flex shrink-0 gap-1">
                {[
                  { value: 'solar', label: '양력' },
                  { value: 'lunar', label: '음력' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      handleChange('calendarType', opt.value as 'solar' | 'lunar')
                    }
                    className={clsx(
                      'flex-1 rounded-full border px-3 py-2 text-xs transition',
                      form.calendarType === opt.value
                        ? 'segmented-toggle-selected border-white/10 text-white'
                        : 'border-white/[0.08] bg-white/5 text-white/60'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-white/45">
              이 정보는 사주 계산에 사용됩니다.
            </p>
            {errors.birthDate && (
              <p className="mt-1 text-[11px] text-slate-400">{errors.birthDate}</p>
            )}
            {errors.calendarType && (
              <p className="mt-1 text-[11px] text-slate-400">{errors.calendarType}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>태어난 시간</label>
            <div className="mt-1.5 flex h-11 items-center gap-2">
              <input
                type="time"
                className={inputBase + ' h-11 flex-1'}
                value={form.birthTime}
                onChange={(e) => handleChange('birthTime', e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleChange('birthTime', '')}
                className={clsx(
                  'flex h-11 shrink-0 items-center justify-center rounded-full border px-3 text-[11px] transition',
                  !form.birthTime
                    ? 'segmented-toggle-selected text-white'
                    : 'border-white/[0.08] bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                )}
              >
                모르겠어요
              </button>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
              가능하면 정확하게 입력해주세요.
              <br />
              모르면 대략적인 시간도 괜찮습니다.
            </p>
          </div>

          <div>
            <label className={labelClass}>성별</label>
            <div className="mt-1.5 flex gap-2">
              {[
                { value: 'female', label: '여성' },
                { value: 'male', label: '남성' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('gender', opt.value)}
                  className={clsx(
                    'flex-1 rounded-full border px-3 py-2.5 text-[13px] transition',
                    form.gender === opt.value
                      ? 'segmented-toggle-selected text-white'
                      : 'border-white/[0.08] bg-white/5 text-white/60'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="mt-1.5 text-[11px] text-slate-400">{errors.gender}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="cta-saju-read w-full rounded-full py-4 text-[16px] font-medium text-white"
            >
              내 운명 읽기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
