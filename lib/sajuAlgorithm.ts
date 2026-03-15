/**
 * 사주팔자(四柱八字) 계산
 * 생년월일시 → 년주·월주·일주·시주 (천간+지지)
 * - 양력 기준. 음력 선택 시에는 입력한 날짜를 그대로 사용(음력→양력 변환은 별도 라이브러리 필요)
 */

/** 천간 10개 (0=甲 ... 9=癸) */
export const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

/** 지지 12개 (0=子 ... 11=亥) */
export const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

export type Pillar = {
  stem: number;   // 0-9
  branch: number; // 0-11
  stemName: string;
  branchName: string;
  /** 한 글자씩 "갑자" 형태 */
  display: string;
};

export type SajuPillars = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  /** "갑자년 을축월 병인일 정묘시" 형태 */
  displayFull: string;
};

/** 그레고리안 날짜 → Julian Day Number (정수) */
function toJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** 2000-01-01 = 庚辰日 (JD 2451545, 60갑자 인덱스 16) */
const JD_2000_01_01 = 2451545;
const DAY_CYCLE_2000_01_01 = 16; // 庚辰

function toPillar(stem: number, branch: number): Pillar {
  const stemName = CHEONGAN[stem];
  const branchName = JIJI[branch];
  return {
    stem,
    branch,
    stemName,
    branchName,
    display: stemName + branchName,
  };
}

/** 년주: 1900년 = 庚子 (간지 인덱스 36) → (year-1900+36)%60 → stem=(year-1900+6)%10, branch=(year-1900)%12 */
function getYearPillar(year: number): Pillar {
  const y = year - 1900;
  const stem = (y + 6 + 100) % 10;
  const branch = (y + 120) % 12;
  return toPillar(stem, branch);
}

/** 월주: 寅月=正月. 월지 = (month+1)%12. 월간 = 五虎遁(년간에 따른 寅月 천간) */
const FIRST_MONTH_STEM_BY_YEAR_STEM = [2, 4, 6, 8, 0]; // 甲己→丙, 乙庚→戊, 丙辛→庚, 丁壬→壬, 戊癸→甲

function getMonthPillar(year: number, month: number): Pillar {
  const yearPillar = getYearPillar(year);
  const branch = (month + 1) % 12; // 1월→寅(2), 12월→丑(1)
  const firstStem = FIRST_MONTH_STEM_BY_YEAR_STEM[yearPillar.stem % 5];
  const stem = (firstStem + (month - 1) + 100) % 10;
  return toPillar(stem, branch);
}

/** 일주: JD 기준 60갑자 */
function getDayPillar(jd: number): Pillar {
  const cycle = (jd - JD_2000_01_01 + DAY_CYCLE_2000_01_01 + 60000) % 60;
  const stem = cycle % 10;
  const branch = cycle % 12;
  return toPillar(stem, branch);
}

/** 시주: 子時 23-1, 丑 1-3, ... 亥 21-23. 時間 = 五鼠遁(일간 기준) */
const HOUR_STEM_BASE_BY_DAY_STEM = [0, 2, 4, 6, 8]; // 甲己→甲子, 乙庚→丙子, ...

function getHourPillar(dayStem: number, hour24: number, minute: number): Pillar {
  // 23:30 → 子時, 00:30 → 丑時. 시지: (hour24 + 1) / 2 내림, 0~23 → 0~11
  let h = hour24;
  if (minute >= 30) h = (h + 1) % 24;
  const branch = Math.floor((h + 1) / 2) % 12;
  const base = HOUR_STEM_BASE_BY_DAY_STEM[dayStem % 5];
  const stem = (base + branch) % 10;
  return toPillar(stem, branch);
}

export type SajuFormInput = {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or ''
  calendarType: string; // 'solar' | 'lunar'
};

/**
 * 생년월일시 → 사주팔자(년월일시주) 계산
 * birthDate: YYYY-MM-DD (양력일자. 음력 선택 시에도 현재는 동일 값 사용)
 * birthTime: HH:mm (비어 있으면 子時로 간주)
 */
export function computeSajuPillars(input: SajuFormInput): SajuPillars | null {
  const { birthDate, birthTime } = input;
  if (!birthDate || birthDate.length < 10) return null;

  const [yStr, mStr, dStr] = birthDate.split('-');
  const year = parseInt(yStr!, 10);
  const month = parseInt(mStr!, 10);
  const day = parseInt(dStr!, 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;

  const jd = toJulianDay(year, month, day);
  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(year, month);
  const dayPillar = getDayPillar(jd);

  let hour24 = 0;
  let minute = 0;
  if (birthTime && birthTime.includes(':')) {
    const [h, m] = birthTime.split(':').map((s) => parseInt(s, 10));
    hour24 = Number.isNaN(h) ? 0 : Math.max(0, Math.min(23, h));
    minute = Number.isNaN(m) ? 0 : Math.max(0, Math.min(59, m));
  }
  const hourPillar = getHourPillar(dayPillar.stem, hour24, minute);

  const displayFull = [
    `${yearPillar.display}년`,
    `${monthPillar.display}월`,
    `${dayPillar.display}일`,
    `${hourPillar.display}시`,
  ].join(' ');

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    displayFull,
  };
}
