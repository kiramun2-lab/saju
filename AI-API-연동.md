# AI API 연동 가이드 (상세 메시지 생성)

상세 메시지를 **입력 조건 + 리드 메시지**에 맞춰 생성형 AI로 만들 때 참고용입니다.

---

## 1. 흐름 요약

1. **사용자**가 사주 입력(이름, 성별, 생년월일, 태어난 시간 등) 후 결과로 이동
2. **결과 페이지**는 URL의 `seed`로 리드 10개를 이미 결정
3. **상세 문단**은 두 가지 소스 중 하나 사용:
   - **AI 사용 시**: 입력 정보 + 10개 리드 문구를 서버로 보내고, AI가 섹션별 4~5문단 생성 → 카드 뒷면에 표시
   - **미사용 시**: 기존처럼 `DESTINY_AREAS`의 `detailParagraphs` 사용

---

## 2. 환경 변수

`.env.local`에 추가:

```env
# OpenAI (상세 메시지 생성용)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

- **주의**: 이 키는 **서버(API 라우트)에서만** 사용하고, 클라이언트에 노출하지 마세요.

---

## 3. API 라우트 예시 (`/api/saju/generate`)

이미 `app/api/saju/generate/route.ts` 에 예시가 있습니다.

- **POST** body: `{ form, leads }`
  - `form`: `{ name, relation, birthDate, birthTime, gender, calendarType }`
  - `leads`: `string[]` (10개 섹션 리드 문구 순서)
- **응답**: `{ details: { overall: string[], love: string[], ... } }`  
  - 각 키는 섹션 id, 값은 문단 문자열 배열(4~5개, 400~600자 분량 권장)

서버에서 `OPENAI_API_KEY`로 OpenAI Chat Completions를 호출해, 위 형식으로 파싱해 반환하면 됩니다.

---

## 4. 결과 페이지에서 부르는 방법

**옵션 A: 결과 페이지 마운트 시 한 번 호출**

1. 입력 페이지에서 결과로 넘어갈 때, **sessionStorage**에 `form` 저장 (이미 저장해 두었다면 생략)
2. 결과 페이지에서:
   - `sessionStorage`에서 `form` 복구
   - `leads`는 URL의 `seed`로 이미 계산된 상태
   - `POST /api/saju/generate` 에 `{ form, leads }` 보냄
   - 로딩 중에는 스켈레톤 또는 “상세 생성 중…” 표시
   - 응답 `details`를 state에 넣고, 카드 뒷면에는 `area.detailParagraphs` 대신 `details[area.id]` 사용
3. API 실패 또는 키 없음이면 기존 `DESTINY_AREAS.detailParagraphs` 로 폴백

**옵션 B: 입력 페이지에서 생성 후 이동**

1. 입력 페이지에서 분석 완료 → **먼저** `POST /api/saju/generate` 호출
2. 응답 `details`를 sessionStorage에 저장하고 `router.push('/saju/result?seed=' + seed)` 로 이동
3. 결과 페이지는 sessionStorage에서 `details` 읽어서 표시 (없으면 더미 데이터)

---

## 5. 영역별 프롬프트 (나중에 수정)

**파일**: `lib/areaPrompts.ts` — `AREA_PROMPTS` 객체에 10개 영역 id마다 프롬프트 문자열이 있습니다. 상세 생성 시 **해당 영역 프롬프트 + 리드 메시지 + 사용자 정보**가 AI에 전달됩니다. 영역별로 지시를 바꾸려면 해당 id 문자열만 수정하면 됩니다. API는 **영역당 1회** 호출하므로 영역마다 다른 톤·지시 가능합니다.

- **입력**: `form`(이름, 생년월일, 성별, 태어난 시간, 양력/음력 등) + 해당 섹션 `theme` + `lead`
- **지시 예** (참고용, 실제는 areaPrompts.ts에서 수정):  
  “다음은 사주 기반 운명 읽기 앱의 한 섹션입니다. 사용자 정보(이름, 생년월일, 성별, 출생 시간, 양력/음력)와 리드 문구를 바탕으로, 이 사람에게 맞는 **상세 해석**을 4~5개 문단, 총 400~600자 분량으로 작성해 주세요. 문단은 배열로 반환해 주세요.”

JSON으로 문단 배열만 받도록 지시하면 파싱이 쉽습니다.

---

## 6. 정리

| 항목 | 내용 |
|------|------|
| 키 위치 | `.env.local` → `OPENAI_API_KEY` (서버 전용) |
| 호출 위치 | API 라우트 `app/api/saju/generate/route.ts` 에서 OpenAI 호출 |
| 클라이언트 | 결과 페이지에서 `fetch('/api/saju/generate', { method: 'POST', body: JSON.stringify({ form, leads }) })` 후 응답 `details` 사용 |
| 폴백 | 키 없음/실패 시 `DESTINY_AREAS` 의 `detailParagraphs` 사용 |

이렇게 붙이면 같은 조건(이름, 성별, 생년월일, 시간 등)일 때 리드는 `seed`로 동일하게 유지하고, 상세만 AI로 사람마다 다르게 생성할 수 있습니다.
