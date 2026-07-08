import { useEffect, useState } from "react";
import { ApiSettings } from "./components/ApiSettings";
import { FeatureGrid } from "./components/FeatureGrid";
import { ImageUploader } from "./components/ImageUploader";
import { ResultPanel } from "./components/ResultPanel";
import {
  APP_VERSION,
  DEFAULT_CLEANUP_GOAL,
  DEFAULT_OUTPUT_TARGET,
  DEFAULT_PROMPT_LENGTH,
  DEFAULT_PROVIDER,
  DEFAULT_STORAGE_MODE,
  MAX_IMAGE_SIZE_MB,
  SUPPORTED_IMAGE_TYPES,
} from "./lib/constants";
import { getReadableErrorMessage } from "./lib/errors";
import { resizeImageToDataUrl } from "./lib/resizeImage";
import {
  clearAllApiKeys,
  clearApiKey,
  loadApiKey,
  saveApiKey,
} from "./lib/storage";
import { analyzeWithClaude } from "./lib/providers/claude";
import { analyzeWithOpenAI } from "./lib/providers/openai";
import type {
  AppStatus,
  CleanupGoal,
  DetailMode,
  ImageMeta,
  OutputTarget,
  PromptLength,
  PromptLensResult,
  Provider,
  StorageMode,
} from "./types/analysis";

export default function App() {
  const [provider, setProvider] = useState<Provider>(DEFAULT_PROVIDER);
  const [apiKey, setApiKey] = useState("");
  const [storageMode, setStorageMode] =
    useState<StorageMode>(DEFAULT_STORAGE_MODE);
  const [detailMode, setDetailMode] = useState<DetailMode>("auto");
  const [outputTarget, setOutputTarget] =
    useState<OutputTarget>(DEFAULT_OUTPUT_TARGET);
  const [promptLength, setPromptLength] =
    useState<PromptLength>(DEFAULT_PROMPT_LENGTH);
  const [cleanupGoal, setCleanupGoal] =
    useState<CleanupGoal>(DEFAULT_CLEANUP_GOAL);

  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [result, setResult] = useState<PromptLensResult | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const isLoading = status === "analyzing";

  useEffect(() => {
    setApiKey(loadApiKey(provider));
  }, [provider]);

  async function handleFileSelected(file: File) {
    try {
      setErrorMessage("");
      setErrorDetails("");
      setResult(null);
      setShowErrorDetails(false);

      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as typeof SUPPORTED_IMAGE_TYPES[number])) {
        setStatus("error");
        setErrorMessage("JPG, PNG, WebP 이미지만 지원합니다.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setStatus("error");
        setErrorMessage(`이미지는 ${MAX_IMAGE_SIZE_MB}MB 이하만 권장합니다.`);
        return;
      }

      const resized = await resizeImageToDataUrl(file);
      setImageDataUrl(resized.dataUrl);
      setImageMeta(resized.meta);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "이미지를 처리하는 중 문제가 발생했습니다."
      );
      setErrorDetails(formatErrorDetails(error));
    }
  }

  function handleClearImage() {
    setImageDataUrl("");
    setImageMeta(null);
    setResult(null);
    setErrorMessage("");
    setErrorDetails("");
    setShowErrorDetails(false);
    setStatus("idle");
  }

  async function handleAnalyze() {
    try {
      setErrorMessage("");
      setErrorDetails("");
      setShowErrorDetails(false);

      if (!apiKey.trim()) {
        setStatus("error");
        setErrorMessage("API 키를 입력해주세요.");
        return;
      }

      if (!imageDataUrl) {
        setStatus("error");
        setErrorMessage("분석할 이미지를 업로드해주세요.");
        return;
      }

      saveApiKey(provider, apiKey.trim(), storageMode);

      setStatus("analyzing");

      const analysis =
        provider === "openai"
          ? await analyzeWithOpenAI({
              apiKey: apiKey.trim(),
              imageDataUrl,
              detailMode,
              outputTarget,
              promptLength,
              cleanupGoal,
            })
          : await analyzeWithClaude({
              apiKey: apiKey.trim(),
              imageDataUrl,
              detailMode,
              outputTarget,
              promptLength,
              cleanupGoal,
            });

      setResult(analysis);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(getReadableErrorMessage(error, provider));
      setErrorDetails(formatErrorDetails(error));
    }
  }

  function handleClearKey() {
    clearApiKey(provider);
    setApiKey("");
  }

  function handleClearAllKeys() {
    clearAllApiKeys();
    setApiKey("");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-56 h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8 md:py-12">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <a href="#" className="text-xl font-black tracking-tight">
              PromptLens
            </a>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              {APP_VERSION}
            </span>
          </div>

          <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            BYOK · Browser-based · No server
          </div>
        </header>

        <section className="grid gap-10 py-8 lg:grid-cols-[1fr_420px] lg:items-center lg:py-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Image-to-cleanup-prompt builder · {APP_VERSION}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Turn any image into a sharper prompt.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              이미지를 업로드하면 PromptLens가 구도, 조명, 색감, 노이즈를 분석해
              GPT, Midjourney, Nano Banana Pro, Generic에 맞는 정리용 프롬프트를
              생성합니다. v0.2.0부터 길이와 정리 목적까지 선택할 수 있습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#builder"
                className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                이미지 분석 시작하기
              </a>
              <a
                href="#result"
                className="rounded-2xl border border-white/15 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                결과 예시 보기
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Prompt controls</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/5 px-4 py-3">Target: GPT / Midjourney / Nano Banana Pro / Generic</div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">Length: Short / Standard / Detailed</div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">Goal: Noise / Background / Texture / Overall</div>
              </div>
              <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                detail_level 1 · 2 · 3
              </div>
            </div>
          </div>
        </section>

        <FeatureGrid />

        <section
          id="builder"
          className="grid gap-6 lg:grid-cols-[420px_1fr]"
        >
          <ApiSettings
            provider={provider}
            apiKey={apiKey}
            storageMode={storageMode}
            onProviderChange={setProvider}
            onApiKeyChange={setApiKey}
            onStorageModeChange={setStorageMode}
            onClearKey={handleClearKey}
            onClearAllKeys={handleClearAllKeys}
          />

          <ImageUploader
            imageDataUrl={imageDataUrl}
            imageMeta={imageMeta}
            detailMode={detailMode}
            outputTarget={outputTarget}
            promptLength={promptLength}
            cleanupGoal={cleanupGoal}
            isLoading={isLoading}
            onDetailModeChange={setDetailMode}
            onOutputTargetChange={setOutputTarget}
            onPromptLengthChange={setPromptLength}
            onCleanupGoalChange={setCleanupGoal}
            onFileSelected={handleFileSelected}
            onClearImage={handleClearImage}
            onAnalyze={handleAnalyze}
          />
        </section>

        {errorMessage && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <p>{errorMessage}</p>
              <div className="flex shrink-0 flex-wrap gap-2">
                {imageDataUrl && apiKey && (
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="rounded-xl border border-red-200/20 bg-red-100/10 px-3 py-2 text-xs font-semibold text-red-50 transition hover:bg-red-100/20 disabled:opacity-60"
                  >
                    다시 시도
                  </button>
                )}
                {errorDetails && (
                  <button
                    type="button"
                    onClick={() => setShowErrorDetails((value) => !value)}
                    className="rounded-xl border border-red-200/20 bg-red-100/10 px-3 py-2 text-xs font-semibold text-red-50 transition hover:bg-red-100/20"
                  >
                    {showErrorDetails ? "상세 닫기" : "상세 보기"}
                  </button>
                )}
              </div>
            </div>

            {showErrorDetails && errorDetails && (
              <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-black/30 p-4 text-xs leading-6 text-red-50">
                {errorDetails}
              </pre>
            )}
          </div>
        )}

        <ResultPanel
          result={result}
          outputTarget={outputTarget}
          isLoading={isLoading}
          onRetry={handleAnalyze}
        />

        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <h2 className="text-2xl font-bold">보안 안내</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
            PromptLens는 개인용·개발자용 BYOK 도구입니다. 입력한 API 키는 선택한
            저장 방식에 따라 이 브라우저에만 보관됩니다. 이미지 분석 시 업로드한
            이미지는 선택한 API 제공자(OpenAI 또는 Claude)로 직접 전송됩니다.
            공용 컴퓨터에서는 “저장하지 않음”을 선택하세요.
          </p>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-500">
          PromptLens · Browser-based prompt refinement tool
        </footer>
      </div>
    </main>
  );
}

function formatErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return error.stack || error.message;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}
