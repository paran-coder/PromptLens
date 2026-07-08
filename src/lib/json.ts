import type { PromptLensResult } from "../types/analysis";

export function extractJsonObject(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("모델 응답에서 JSON 객체를 찾을 수 없습니다.");
    }

    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }
}

export function validatePromptLensResult(value: unknown): PromptLensResult {
  if (!value || typeof value !== "object") {
    throw new Error("분석 결과 형식이 올바르지 않습니다.");
  }

  const data = value as Record<string, unknown>;

  const imageType = getString(data, "image_type");
  const summary = getString(data, "summary");
  const promptKo = getString(data, "prompt_ko");
  const promptEn = getString(data, "prompt_en");
  const negativePrompt = getString(data, "negative_prompt");
  const targetNotes = getString(data, "target_notes");

  const preserve = getStringArray(data, "preserve");
  const reduce = getStringArray(data, "reduce");
  const detailLevel = getDetailLevel(data.recommended_detail_level);

  return {
    image_type: imageType,
    summary,
    preserve,
    reduce,
    recommended_detail_level: detailLevel,
    prompt_ko: promptKo,
    prompt_en: promptEn,
    negative_prompt: negativePrompt,
    target_notes: targetNotes,
  };
}

function getString(data: Record<string, unknown>, key: string): string {
  const value = data[key];

  if (typeof value !== "string") {
    throw new Error(`${key} 값은 문자열이어야 합니다.`);
  }

  return value;
}

function getStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];

  if (!Array.isArray(value)) {
    throw new Error(`${key} 값은 배열이어야 합니다.`);
  }

  return value.map(String);
}

function getDetailLevel(value: unknown): 1 | 2 | 3 {
  if (value === 1 || value === 2 || value === 3) {
    return value;
  }

  throw new Error("recommended_detail_level 값은 1, 2, 3 중 하나여야 합니다.");
}
