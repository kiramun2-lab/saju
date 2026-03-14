/**
 * 토스페이먼츠 스크립트 동적 로드 후 결제창 요청
 */

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      widgets: (opts?: { customerKey?: string }) => {
        requestPaymentWindow: (
          payment: {
            amount: { currency: string; value: number };
            orderId: string;
            orderName: string;
            successUrl: string;
            failUrl: string;
          },
          ui?: { variantKey?: { paymentMethod?: string; agreement?: string } }
        ) => Promise<unknown>;
      };
    };
  }
}

const SCRIPT_URL = 'https://js.tosspayments.com/v2/standard';

export function loadTossScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window undefined'));
  if (window.TossPayments) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Toss script load failed'));
    document.head.appendChild(script);
  });
}

export type RequestPaymentParams = {
  clientKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
};

export function requestTossPaymentWindow(params: RequestPaymentParams): Promise<void> {
  const { clientKey, amount, orderId, orderName, successUrl, failUrl } = params;
  const Toss = window.TossPayments;
  if (!Toss) return Promise.reject(new Error('TossPayments not loaded'));

  const widgets = Toss(clientKey).widgets();
  return widgets
    .requestPaymentWindow(
      {
        amount: { currency: 'KRW', value: amount },
        orderId,
        orderName,
        successUrl,
        failUrl,
      },
      { variantKey: { paymentMethod: 'DEFAULT', agreement: 'DEFAULT' } }
    )
    .then(() => {});
}
