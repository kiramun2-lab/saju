/**
 * Gemini 디테일 메시지용 프롬프트
 * - ~합니다 체, 이름 1~2회만 자연스럽게, 영역당 350~400자(기존의 60~70%) 수준
 * - 단일 영역용 buildDetailPrompt / 10개 한 번에 buildBatchDetailPrompt
 */

export function buildDetailPrompt(
  categoryName: string,
  leadMessage: string,
  userName?: string
): string {
  const name = userName?.trim();
  const nameBlock = name
    ? `\n- 대상 이름: "${name}". 본문에는 이름을 자연스럽게 1~2회만 사용합니다.`
    : '';

  return `
너는 운명을 읽어주는 프로필러입니다. 아래 [영역]과 [리드]를 바탕으로 디테일 리포트를 작성합니다.

[입력]
- 영역: ${categoryName}
- 리드: "${leadMessage}"
${nameBlock}

[규칙]
1. 어투: 반드시 '~합니다', '~됩니다' 등 존댓말(~합니다 체)로 통일합니다.
2. 글자 수: 공백 포함 350자~400자 내외로, 3개 문단으로 나눕니다.
3. 마크다운(**, #) 사용 금지. 순수 텍스트만 출력합니다.
4. 사주·명리·미신 용어 금지. 현대적·심리학적으로 서술합니다.

[구조]
문단1: 리드가 일상에서 어떻게 드러나는지 간단히 묘사합니다.
문단2: 그런 패턴 뒤의 심리나 기질을 짧게 분석합니다.
문단3: 그 기질을 어떻게 살릴 수 있는지 한두 문장으로 제시합니다.

본문만 출력하세요.
`.trim();
}

type AreaInput = { id: string; theme: string; lead: string };

/**
 * 10개 영역을 한 번에 요청하는 배치 프롬프트.
 * 응답은 반드시 "[영역id]" 한 줄 + 빈 줄 + 문단들 형태로 해야 파싱 가능.
 */
export function buildBatchDetailPrompt(
  areas: AreaInput[],
  userName?: string
): string {
  const name = userName?.trim();
  const nameLine = name
    ? `\n- 대상 이름: "${name}". 각 영역 본문에서 이름은 전체적으로 1~2회만 자연스럽게 사용합니다.`
    : '';

  const areaList = areas
    .map(
      (a, i) =>
        `${i + 1}. [${a.id}] 영역: ${a.theme} | 리드: "${a.lead}"`
    )
    .join('\n');

  return `
너는 운명을 읽어주는 프로필러입니다. 아래 10개 영역에 대해, 각 영역마다 짧은 디테일 리포트를 작성합니다.

[공통 규칙]
- 어투: 반드시 '~합니다', '~됩니다' 등 존댓말(~합니다 체)로 통일합니다.
- 영역당 글자 수: 공백 포함 350자~400자 내외. 각 영역마다 3개 문단으로 나눕니다.
- 마크다운(**, #) 사용 금지. 순수 텍스트만 출력합니다.
- 사주·명리·미신 용어 금지. 현대적·심리학적으로 서술합니다.
${nameLine}

[10개 영역 (순서 엄수)]
${areaList}

[출력 형식 - 반드시 아래 형식을 정확히 지킵니다]
각 영역마다 반드시 다음처럼 출력합니다. 다른 말 없이 이 형식만 사용합니다.

[overall]

(여기에 overall 영역 3문단)

[love]

(여기에 love 영역 3문단)

[career]

(여기에 career 영역 3문단)

[attract]

(여기에 attract 영역 3문단)

[strength]

(여기에 strength 영역 3문단)

[path]

(여기에 path 영역 3문단)

[talent]

(여기에 talent 영역 3문단)

[money]

(여기에 money 영역 3문단)

[relation]

(여기에 relation 영역 3문단)

[future]

(여기에 future 영역 3문단)

위 10개 블록만 출력하고, 블록 사이에 설명이나 주석을 넣지 마세요. 각 [영역id]는 반드시 위와 동일한 소문자 영문으로만 표기합니다.
`.trim();
}
