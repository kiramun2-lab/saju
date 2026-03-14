import { NextRequest, NextResponse } from 'next/server';
import { getReportAmount } from '../../../../lib/toss';

/**
 * 토스페이먼츠 결제 승인 API
 * - successUrl으로 리다이렉트된 후, 클라이언트에서 paymentKey, orderId, amount를 보내면
 *   서버에서 토스에 승인 요청 후 결과 반환
 */
export async function POST(request: NextRequest) {
  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: 'TOSS_SECRET_KEY not configured' },
      { status: 500 }
    );
  }

  let body: { paymentKey: string; orderId: string; amount: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { paymentKey, orderId, amount } = body;
  if (!paymentKey || !orderId || amount == null) {
    return NextResponse.json(
      { error: 'paymentKey, orderId, amount required' },
      { status: 400 }
    );
  }

  const expectedAmount = getReportAmount();
  if (Number(amount) !== expectedAmount) {
    return NextResponse.json(
      { error: 'Amount mismatch', code: 'AMOUNT_MISMATCH' },
      { status: 400 }
    );
  }

  const basicAuth = Buffer.from(`${secret}:`).toString('base64');

  try {
    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? 'Payment confirm failed', code: data.code },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Toss confirm error:', e);
    return NextResponse.json(
      { error: 'Payment confirm failed' },
      { status: 500 }
    );
  }
}
