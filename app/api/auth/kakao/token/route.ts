import { NextRequest, NextResponse } from 'next/server';

/**
 * 카카오 인가 코드로 액세스 토큰 발급
 * - redirect_uri로 리다이렉트된 페이지에서 code를 이 API로 보내면
 *   카카오에 토큰 요청 후 access_token 등을 반환
 */
export async function POST(request: NextRequest) {
  const restKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!restKey || !redirectUri) {
    return NextResponse.json(
      { error: 'Kakao env not configured' },
      { status: 500 }
    );
  }

  let body: { code: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { code } = body;
  if (!code) {
    return NextResponse.json({ error: 'code required' }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: restKey,
    redirect_uri: redirectUri,
    code,
  });

  try {
    const res = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params.toString(),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error_description ?? data.error ?? 'Token request failed' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
    });
  } catch (e) {
    console.error('Kakao token error:', e);
    return NextResponse.json(
      { error: 'Token request failed' },
      { status: 500 }
    );
  }
}
