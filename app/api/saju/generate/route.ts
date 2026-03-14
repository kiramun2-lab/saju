import { NextRequest, NextResponse } from 'next/server';
import { DESTINY_AREAS } from '../../../../lib/dummyData';
import { AREA_PROMPTS, SAJU_COMMON_PROMPT, SECTION_IDS } from '../../../../lib/areaPrompts';

type FormInput = {
  name: string;
  relation: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  calendarType: string;
};

/** AI 없을 때 폴백: 기존 더미 데이터 반환 */
function getFallbackDetails(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  DESTINY_AREAS.forEach((area) => {
    out[area.id] = area.detailParagraphs;
  });
  return out;
}

function formatUserInfo(form: FormInput): string {
  return [
    `이름: ${form.name || '(미입력)'}`,
    `관계: ${form.relation || '(미입력)'}`,
    `생년월일: ${form.birthDate}`,
    `태어난 시간: ${form.birthTime}`,
    `성별: ${form.gender}`,
    `양력/음력: ${form.calendarType || '(미입력)'}`,
  ].join('\n');
}

/** 한 영역에 대해: 영역별 프롬프트 + 리드 + 사용자 정보로 상세 문단 1세트 생성 */
async function generateOneSection(
  apiKey: string,
  sectionId: string,
  areaPrompt: string,
  lead: string,
  form: FormInput
): Promise<string[]> {
  const userContent = `${SAJU_COMMON_PROMPT}

---

## 이번 영역 지시
${areaPrompt}

## 리드 메시지 (이 문구의 뉘앙스를 반드시 살려서 상세글을 쓸 것)
${lead}

## 사용자 정보 (사주 입력)
${formatUserInfo(form)}

---
위 공통 규칙·영역 지시·리드·사용자 정보를 바탕으로, 이 영역의 상세 해석을 **4~6개 문단**(총 450~650자)으로 작성하세요.
응답은 반드시 다음 JSON 형식만 반환하세요. 예: { "paragraphs": ["문단1 내용", "문단2 내용", "문단3 내용", "문단4 내용"] }`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userContent }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`OpenAI [${sectionId}] error:`, res.status, err);
    return [];
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    const arr =
      Array.isArray(parsed)
        ? parsed
        : parsed.paragraphs ?? parsed.detail ?? parsed.result ?? [];
    return (Array.isArray(arr) ? arr : []).filter((p: unknown) => typeof p === 'string');
  } catch {
    return [];
  }
}

/** 영역별 프롬프트 + 리드 + 사용자 정보로 10개 영역 상세 문단 생성 (영역당 1회 호출) */
async function generateWithOpenAI(
  form: FormInput,
  leads: string[]
): Promise<Record<string, string[]> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const fallback = getFallbackDetails();

  const results = await Promise.all(
    SECTION_IDS.map(async (id, i) => {
      const lead = leads[i] ?? '';
      const areaPrompt = AREA_PROMPTS[id] ?? '';
      const paragraphs = await generateOneSection(
        apiKey,
        id,
        areaPrompt,
        lead,
        form
      );
      return { id, paragraphs: paragraphs.length > 0 ? paragraphs : fallback[id] ?? [] };
    })
  );

  const details: Record<string, string[]> = {};
  results.forEach(({ id, paragraphs }) => {
    details[id] = paragraphs;
  });
  return details;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { form, leads } = body as { form?: FormInput; leads?: string[] };

    if (!form?.birthDate) {
      return NextResponse.json(
        { error: 'form.birthDate required' },
        { status: 400 }
      );
    }

    const safeForm: FormInput = {
      name: form.name ?? '',
      relation: form.relation ?? '',
      birthDate: form.birthDate ?? '',
      birthTime: form.birthTime ?? '',
      gender: form.gender ?? '',
      calendarType: form.calendarType ?? '',
    };
    const safeLeads = Array.isArray(leads) && leads.length >= 10 ? leads : [];

    const details = await generateWithOpenAI(safeForm, safeLeads);
    const result = details ?? getFallbackDetails();

    return NextResponse.json({ details: result });
  } catch (e) {
    console.error('POST /api/saju/generate error:', e);
    return NextResponse.json(
      { error: 'Server error', details: getFallbackDetails() },
      { status: 500 }
    );
  }
}
