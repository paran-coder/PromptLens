import { useState } from "react";
import type { Provider, StorageMode } from "../types/analysis";

type ApiSettingsProps = {
  provider: Provider;
  apiKey: string;
  storageMode: StorageMode;
  onProviderChange: (provider: Provider) => void;
  onApiKeyChange: (apiKey: string) => void;
  onStorageModeChange: (mode: StorageMode) => void;
  onClearKey: () => void;
  onClearAllKeys: () => void;
};

export function ApiSettings({
  provider,
  apiKey,
  storageMode,
  onProviderChange,
  onApiKeyChange,
  onStorageModeChange,
  onClearKey,
  onClearAllKeys,
}: ApiSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div>
        <p className="text-sm font-medium text-cyan-200">Step 1</p>
        <h2 className="mt-1 text-2xl font-bold">API 연결</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          OpenAI 또는 Claude 중 하나를 선택하고, 본인의 API 키를 입력하세요.
        </p>
      </div>

      <label className="mt-6 block text-sm font-medium text-slate-300">
        API Provider
      </label>
      <select
        value={provider}
        onChange={(event) => onProviderChange(event.target.value as Provider)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
      >
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
      </select>

      <label className="mt-5 block text-sm font-medium text-slate-300">
        API Key
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type={showApiKey ? "text" : "password"}
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder="API 키를 입력하세요"
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
        />
        <button
          type="button"
          onClick={() => setShowApiKey((value) => !value)}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
        >
          {showApiKey ? "숨김" : "보기"}
        </button>
        <button
          type="button"
          onClick={onClearKey}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
        >
          삭제
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium text-slate-300">
        저장 방식
      </label>
      <select
        value={storageMode}
        onChange={(event) => onStorageModeChange(event.target.value as StorageMode)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
      >
        <option value="local">로컬 저장</option>
        <option value="session">세션 저장</option>
        <option value="none">저장하지 않음</option>
      </select>

      <button
        type="button"
        onClick={onClearAllKeys}
        className="mt-4 w-full rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-300/15"
      >
        모든 API 키 삭제
      </button>

      <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
        기본값은 로컬 저장입니다. API 키는 선택한 저장 방식에 따라 이 브라우저에만
        보관됩니다. 공용 컴퓨터에서는 “저장하지 않음”을 선택하세요.
      </div>
    </div>
  );
}
