import type { Provider, StorageMode } from "../types/analysis";

const keyName = (provider: Provider) => `promptlens:${provider}:api-key`;

export function saveApiKey(provider: Provider, apiKey: string, mode: StorageMode) {
  clearApiKey(provider);

  if (mode === "local") {
    localStorage.setItem(keyName(provider), apiKey);
  }

  if (mode === "session") {
    sessionStorage.setItem(keyName(provider), apiKey);
  }
}

export function loadApiKey(provider: Provider): string {
  return (
    localStorage.getItem(keyName(provider)) ??
    sessionStorage.getItem(keyName(provider)) ??
    ""
  );
}

export function clearApiKey(provider: Provider) {
  localStorage.removeItem(keyName(provider));
  sessionStorage.removeItem(keyName(provider));
}

export function clearAllApiKeys() {
  clearApiKey("openai");
  clearApiKey("claude");
}
