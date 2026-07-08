import type { Provider } from "../types/analysis";

export function getReadableErrorMessage(error: unknown, provider: Provider) {
  const raw = error instanceof Error ? error.message : String(error);

  const lower = raw.toLowerCase();

  if (lower.includes("cors") || lower.includes("cross-origin")) {
    return `${getProviderName(provider)} 브라우저 직접 호출이 CORS 정책에 의해 차단되었습니다. OpenAI로 먼저 테스트하거나, 이후 서버리스 프록시 버전이 필요합니다.`;
  }

  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("api key")) {
    return `${getProviderName(provider)} API 키가 올바르지 않거나 권한이 없습니다. 키를 다시 확인하세요.`;
  }

  if (lower.includes("429") || lower.includes("rate limit")) {
    return `${getProviderName(provider)} 사용량 제한에 도달했습니다. 잠시 후 다시 시도하거나 계정 사용량을 확인하세요.`;
  }

  if (lower.includes("model") && (lower.includes("not") || lower.includes("invalid"))) {
    return `${getProviderName(provider)} 모델을 사용할 수 없습니다. 계정 권한 또는 모델명을 확인해야 합니다.`;
  }

  if (lower.includes("json")) {
    return `모델 응답을 JSON으로 해석하지 못했습니다. 다시 시도하거나 다른 제공자로 테스트하세요. 원문 오류: ${raw}`;
  }

  return raw || "알 수 없는 오류가 발생했습니다.";
}

function getProviderName(provider: Provider) {
  return provider === "openai" ? "OpenAI" : "Claude";
}
