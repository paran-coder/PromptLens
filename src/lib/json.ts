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

  assertString(data, "image_type");
  assertString(data, "summary");
  assertString(data, "prompt_ko");
  assertString(data, "prompt_en");

  if (!Array.isArray(data.preserve)) {
    throw new Error("preserve 값은 배열이어야 합니다.");
  }

  if (!Array.isArray(data.reduce)) {
    throw new Error("reduce 값은 배열이어야 합니다.");
  }

  if (![1, 2, 3].includes(data.recommended_detail_level as number)) {
    throw new Error("recommended_detail_level 값은 1, 2, 3 중 하나여야 합니다.");
  }

  return {
    image_type: data.image_type,
    summary: data.summary,
    preserve: data.preserve.map(String),
    reduce: data.reduce.map(String),
    recommended_detail_level: data.recommended_detail_level as 1 | 2 | 3,
    prompt_ko: data.prompt_ko,
    prompt_en: data.prompt_en,
  };
}

function assertString(
  data: Record<string, unknown>,
  key: string
): asserts data is Record<string, string> {
  if (typeof data[key] !== "string") {
    throw new Error(`${key} 값은 문자열이어야 합니다.`);
  }
}
