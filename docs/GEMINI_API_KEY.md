# Gemini API 키 연동 (서버 환경)

디테일 메시지는 **Google Gemini API**로 생성됩니다. 서버에서만 사용하므로 키는 **절대 클라이언트에 노출되지 않습니다.**

## 1. 키 발급

1. [Google AI Studio](https://aistudio.google.com/apikey) 접속 후 로그인
2. **Create API key**로 새 키 생성
3. 생성된 키 복사

## 2. 로컬 개발 (Next.js)

1. **프로젝트 루트**에 `.env.local` 파일이 있는지 확인 (없으면 생성)
2. 아래 한 줄 추가 후, `your_actual_key`를 복사한 키로 바꿈:

```env
GEMINI_API_KEY=your_actual_key
```

3. **서버 재시작**  
   Next는 서버 기동 시에만 env를 읽습니다.  
   터미널에서 `npm run dev`(또는 `yarn dev`)를 **끄고 다시 실행**해야 합니다.

4. **확인**  
   사주 입력 후 "내 운명 읽기" → 로딩 → 결과 페이지에서 카드 뒤집기 시, 매번 다른 디테일이 나오면 연동된 것입니다.

## 3. 배포 환경 (Vercel / 기타)

- **Vercel**: 프로젝트 → Settings → Environment Variables 에서  
  이름 `GEMINI_API_KEY`, 값에 키 입력 후 저장.  
  배포를 다시 해야 반영됩니다.
- **다른 호스팅**: 해당 서비스의 "환경 변수" 설정에  
  `GEMINI_API_KEY` = (발급한 키) 로 넣으면 됩니다.

## 4. 404 Not Found / 모델 단종

- **증상**: `models/gemini-2.0-flash is no longer available to new users` 또는 404 에러.
- **조치**: `.env.local`에서 `GEMINI_MODEL=gemini-2.0-flash` 또는 `gemini-2.0-flash-lite`를 **삭제**하거나, `GEMINI_MODEL=gemini-2.5-flash` 로 바꾼 뒤 서버 재시작. (기본값이 2.5-flash라서 아예 안 넣어도 됨.)

## 5. 429 Too Many Requests / 한도 초과

- **증상**: 터미널에 `429 Too Many Requests`, `Quota exceeded` 로그가 보일 때.
- **이유**: 무료 플랜은 요청·토큰에 일일/분당 한도가 있음. `gemini-2.5-pro`는 무료 한도가 0인 경우가 있음.
- **조치**:
  1. **기본 모델**: 코드 기본값은 `gemini-2.5-flash`. `.env.local`에 `GEMINI_MODEL`을 안 넣으면 이 모델이 사용됩니다.
  2. **직접 지정**: 더 많이 쓰려면 `gemini-2.5-flash-lite`, 품질 올리려면 `gemini-2.5-pro` 등 설정. (`gemini-2.0-flash` 계열은 단종되어 404 발생)
  3. **재시도**: 429가 나오면 서버에서 한 번 대기 후 자동 재시도합니다. 그래도 한도 초과면 다음 날까지 기다리거나 [Google AI Studio](https://aistudio.google.com/) / 결제 설정에서 한도 확인.

## 6. 참고

- `.env.local`은 Git에 올리지 마세요 (이미 `.gitignore`에 있을 수 있음).
- 예시는 `.env.example`을 참고하면 됩니다.
