import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DESTINY_AREAS } from '../../../../lib/dummyData';
import { buildBatchDetailPrompt } from '../../../../lib/geminiDetailPrompt';

type FormInput = {
  name: string;
  relation: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  calendarType: string;
};

const AREA_IDS = DESTINY_AREAS.map((a) => a.id);

/** AI 없을 때 폴백: 기존 더미 데이터 반환 */
function getFallbackDetails(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  DESTINY_AREAS.forEach((area) => {
    out[area.id] = area.detailParagraphs;
  });
  return out;
}

/** 배치 응답 텍스트를 영역별 3문단으로 파싱 */
function parseBatchResponse(text: string): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  const re = new RegExp(
    `\\[(${AREA_IDS.join('|')})\\]\\s*\\n\\s*([\\s\\S]*?)(?=\\s*\\[(${AREA_IDS.join('|')})\\]\\s*\\n|$)`,
    'gi'
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const id = m[1].toLowerCase();
    const block = m[2].trim();
    const paragraphs = block
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .slice(0, 3);
    if (paragraphs.length > 0) details[id] = paragraphs;
  }
  return details;
}

/** 429 시 재시도 대기(ms) */
function getRetryDelayMs(err: unknown): number {
  const delay = (err as { errorDetails?: Array<{ retryDelay?: string }> })?.errorDetails?.find(
    (d) => typeof (d as { retryDelay?: string }).retryDelay === 'string'
  ) as { retryDelay?: string } | undefined;
  if (delay?.retryDelay) {
    const sec = parseFloat(delay.retryDelay.replace(/s$/i, ''));
    if (!Number.isNaN(sec)) return Math.min(sec * 1000, 15_000);
  }
  return 5000;
}

/** 10개 영역을 한 번에 Gemini 1회 호출로 생성 → 파싱 */
async function generateWithGemini(
  form: FormInput,
  leads: string[]
): Promise<Record<string, string[]> | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    console.error(
      '[saju/generate] GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 GEMINI_API_KEY를 넣어주세요. 더미 디테일을 반환합니다.'
    );
    return null;
  }

  const fallback = getFallbackDetails();
  const userName = form.name?.trim() || undefined;
  const areas = DESTINY_AREAS.map((area, i) => ({
    id: area.id,
    theme: area.theme,
    lead: leads[i] ?? area.lead ?? '',
  }));

  const prompt = buildBatchDetailPrompt(areas, userName);
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'; // 무료 한도 넉넉
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
    },
  });

  const run = async (): Promise<Record<string, string[]>> => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text?.trim()) return {};
    const parsed = parseBatchResponse(text);
    // 파싱 실패한 영역은 폴백
    const details: Record<string, string[]> = {};
    DESTINY_AREAS.forEach((area) => {
      details[area.id] = parsed[area.id]?.length
        ? parsed[area.id]
        : fallback[area.id] ?? [];
    });
    return details;
  };

  try {
    return await run();
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 429) {
      const waitMs = getRetryDelayMs(err);
      console.warn(`Gemini batch 429, retry after ${waitMs}ms`);
      await new Promise((r) => setTimeout(r, waitMs));
      try {
        return await run();
      } catch (retryErr) {
        console.error('Gemini batch retry error:', retryErr);
        return null;
      }
    }
    console.error('Gemini batch error:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  console.log('[saju/generate] GEMINI_API_KEY configured:', hasKey);

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

    const details = await generateWithGemini(safeForm, safeLeads);
    const result = details ?? getFallbackDetails();
    const generated = details != null;

    if (!generated) {
      console.warn(
        '[saju/generate] Gemini 호출 없이 더미 디테일 반환. GEMINI_API_KEY 확인 필요.'
      );
    }

    return NextResponse.json({
      details: result,
      _meta: { generated },
    });
  } catch (e) {
    console.error('POST /api/saju/generate error:', e);
    return NextResponse.json(
      {
        error: 'Server error',
        details: getFallbackDetails(),
        _meta: { generated: false },
      },
      { status: 500 }
    );
  }
}
