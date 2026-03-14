# 운명읽기 MVP 배포 가이드

## 1. 배포 전 확인

```bash
npm run build
```

에러 없이 빌드되면 배포 가능합니다.

---

## 2. Vercel로 배포 (권장)

Next.js 프로젝트라 **Vercel**이 가장 간단합니다.

### 방법 A: GitHub 연동

1. [vercel.com](https://vercel.com) 가입 (GitHub 로그인)
2. 프로젝트를 **GitHub 저장소**에 푸시
   - 한글 경로 대신 영문 폴더에서 작업하거나, repo만 영문 경로에 두는 것을 권장
3. Vercel 대시보드 → **Add New** → **Project** → 해당 저장소 선택
4. **Deploy** (설정 기본값으로 진행)
5. 배포 후 생성된 URL로 접속

### 방법 B: Vercel CLI

```bash
npx vercel
```

로그인 후 안내에 따라 진행하면 배포 URL이 발급됩니다.

---

## 3. 환경 변수 (필요 시)

나중에 다음을 쓸 때 Vercel **Settings → Environment Variables**에 추가하세요.

- 카카오 로그인: `NEXT_PUBLIC_KAKAO_JS_KEY`, `KAKAO_REST_API_KEY`, `NEXT_PUBLIC_KAKAO_REDIRECT_URI`
- 결제(토스): `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`

코드에서는 `process.env.NEXT_PUBLIC_XXX` 형태로 사용합니다.

---

## 4. 커스텀 도메인 (선택)

Vercel 프로젝트 **Settings → Domains**에서 본인 도메인을 연결할 수 있습니다.

---

## 5. 요약 체크리스트

- [ ] `npm run build` 성공
- [ ] 코드를 GitHub 저장소에 푸시
- [ ] Vercel에서 해당 repo 연결 후 Deploy
- [ ] (필요 시) 환경 변수 설정

이후에는 `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다.
