# 토스페이먼츠 + 카카오 로그인 연동 가이드

## 1. 환경 변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 값을 채우세요.

```bash
cp .env.example .env.local
```

### 토스페이먼츠

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com) 로그인
2. **내 개발정보** → **API 키**에서 키 확인
3. **결제위젯** 연동용 **클라이언트 키** → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
4. **시크릿 키** → `TOSS_SECRET_KEY` (서버 전용, 노출 금지)

- 테스트: `test_ck_...` / `test_sk_...`
- 라이브: 실제 키로 교체 후 결제 테스트

### 카카오 로그인

1. [카카오 개발자 콘솔](https://developers.kakao.com) 로그인
2. **앱** 선택 → **앱 키**: **JavaScript 키** → `NEXT_PUBLIC_KAKAO_JS_KEY`
3. **REST API 키** → `KAKAO_REST_API_KEY` (서버에서 토큰 교환용)
4. **카카오 로그인** → **Redirect URI** 등록  
   - 로컬: `http://localhost:3000/oauth/callback/kakao`  
   - 운영: `https://your-domain.com/oauth/callback/kakao`
5. `.env.local`에 `NEXT_PUBLIC_KAKAO_REDIRECT_URI`를 위에서 등록한 URI와 **완전히 동일**하게 설정

---

## 2. 토스페이먼츠 결제 흐름

1. **결제 페이지** (`/payment`)  
   - 약관 동의 후 **990원으로 전체 결과 보기** 클릭  
   - 토스 스크립트 로드 후 `requestPaymentWindow()` 호출 → 결제창 오픈
2. **결제 완료**  
   - 토스가 `successUrl`(`/payment/success?paymentKey=...&orderId=...&amount=...`)로 리다이렉트
3. **결제 승인**  
   - `/payment/success`에서 `/api/payments/confirm` 호출 (paymentKey, orderId, amount 전달)  
   - 서버에서 토스 **결제 승인 API** 호출 (시크릿 키 사용)
4. **실패 시**  
   - `failUrl`(`/payment/fail`)로 이동, 에러 메시지 표시

---

## 3. 카카오 로그인 흐름

1. **로그인 페이지** (`/login`)  
   - **카카오로 3초만에 시작하기** 클릭 → `Kakao.Auth.authorize({ redirectUri })`  
   - 카카오 로그인/동의 화면으로 이동
2. **동의 후**  
   - 카카오가 `redirectUri`로 리다이렉트 (`/oauth/callback/kakao?code=...`)
3. **콜백**  
   - `code`를 `/api/auth/kakao/token`에 전달  
   - 서버가 카카오에 토큰 요청 후 `access_token` 등 반환  
   - 클라이언트에서 로그인 처리 후 `/mypage`로 이동

---

## 4. 배포 시 체크

- **토스**: 운영 키로 교체, 결제 테스트
- **카카오**: 운영 도메인을 **Redirect URI**에 추가
- **환경 변수**: Vercel 등에 `NEXT_PUBLIC_*`, `TOSS_SECRET_KEY`, `KAKAO_REST_API_KEY` 등 설정
