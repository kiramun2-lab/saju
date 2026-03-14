/**
 * 토스페이먼츠 클라이언트용 유틸
 * - 결제창 요청 시 사용하는 orderId, successUrl, failUrl 생성
 */

const REPORT_AMOUNT = 990;
const ORDER_NAME = '운명읽기 리포트';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export function getReportAmount(): number {
  return REPORT_AMOUNT;
}

export function getOrderName(): string {
  return ORDER_NAME;
}

/** 결제 요청용 고유 주문 ID (6~64자, 영문/숫자/-/_) */
export function createOrderId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `saju_${t}_${r}`.slice(0, 64);
}

export function getSuccessUrl(): string {
  return `${getBaseUrl()}/payment/success`;
}

export function getFailUrl(): string {
  return `${getBaseUrl()}/payment/fail`;
}
