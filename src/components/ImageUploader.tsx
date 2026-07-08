import type {
  CleanupGoal,
  DetailMode,
  ImageMeta,
  OutputTarget,
  PromptLength,
} from "../types/analysis";
import { formatBytes } from "../lib/dataUrl";

type ImageUploaderProps = {
  imageDataUrl: string;
  imageMeta: ImageMeta | null;
  detailMode: DetailMode;
  outputTarget: OutputTarget;
  promptLength: PromptLength;
  cleanupGoal: CleanupGoal;
  isLoading: boolean;
  onDetailModeChange: (mode: DetailMode) => void;
  onOutputTargetChange: (target: OutputTarget) => void;
  onPromptLengthChange: (length: PromptLength) => void;
  onCleanupGoalChange: (goal: CleanupGoal) => void;
  onFileSelected: (file: File) => void;
  onClearImage: () => void;
  onAnalyze: () => void;
};

export function ImageUploader({
  imageDataUrl,
  imageMeta,
  detailMode,
  outputTarget,
  promptLength,
  cleanupGoal,
  isLoading,
  onDetailModeChange,
  onOutputTargetChange,
  onPromptLengthChange,
  onCleanupGoalChange,
  onFileSelected,
  onClearImage,
  onAnalyze,
}: ImageUploaderProps) {
  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div>
        <p className="text-sm font-medium text-cyan-200">Step 2</p>
        <h2 className="mt-1 text-2xl font-bold">이미지 업로드</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          JPG, PNG, WebP 이미지를 업로드하세요. 분석 전에 브라우저에서 자동으로
          리사이즈됩니다.
        </p>
      </div>

      <label
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => event.preventDefault()}
        className="mt-6 flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/20 bg-slate-950/70 p-6 text-center transition hover:border-cyan-300/40 hover:bg-slate-900"
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Uploaded preview"
            className="max-h-96 rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
              ⬆
            </div>
            <p className="mt-5 text-lg font-semibold">
              이미지를 끌어다 놓거나 클릭해서 업로드하세요
            </p>
            <p className="mt-2 text-sm text-slate-400">JPG, PNG, WebP 지원</p>
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </label>

      {imageMeta && (
        <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300 md:grid-cols-2">
          <p>파일명: {imageMeta.fileName}</p>
          <p>크기: {imageMeta.width}×{imageMeta.height}</p>
          <p>원본: {formatBytes(imageMeta.originalBytes)}</p>
          <p>전송용: {formatBytes(imageMeta.outputBytes)}</p>
        </div>
      )}

      {imageDataUrl && (
        <button
          type="button"
          onClick={onClearImage}
          className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
        >
          이미지 초기화
        </button>
      )}

      <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-cyan-100">프롬프트 품질 설정</p>
          <p className="text-xs leading-5 text-slate-400">
            v0.2.x에서 추가된 옵션입니다. 출력 대상, 길이, 정리 목적, detail_level을 여기서 조정합니다.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              출력 대상
            </label>
            <select
              value={outputTarget}
              onChange={(event) => onOutputTargetChange(event.target.value as OutputTarget)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="gpt">GPT</option>
              <option value="midjourney">Midjourney</option>
              <option value="nano_banana_pro">Nano Banana Pro</option>
              <option value="generic">Generic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              프롬프트 길이
            </label>
            <select
              value={promptLength}
              onChange={(event) => onPromptLengthChange(event.target.value as PromptLength)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="short">짧게</option>
              <option value="standard">표준</option>
              <option value="detailed">자세히</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              정리 목적
            </label>
            <select
              value={cleanupGoal}
              onChange={(event) => onCleanupGoalChange(event.target.value as CleanupGoal)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="auto">자동 판단</option>
              <option value="noise">노이즈 제거</option>
              <option value="background">배경 정리</option>
              <option value="texture">질감 완화</option>
              <option value="overall">전체 정돈</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              정리 강도 / detail_level
            </label>
            <select
              value={detailMode}
              onChange={(event) => onDetailModeChange(event.target.value as DetailMode)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="auto">자동 추천</option>
              <option value="clean">Clean - detail_level 1 - 강하게 단순화</option>
              <option value="balanced">Balanced - detail_level 2 - 자연스럽게 정리</option>
              <option value="rich">Rich - detail_level 3 - 디테일 유지</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-xs leading-6 text-slate-400">
          detail_level 1은 강한 단순화, 2는 균형형 정리, 3은 디테일 보존 중심입니다.
        </div>

        <div className="mt-4 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4 text-xs leading-6 text-violet-100">
          현재 선택: {formatOutputTarget(outputTarget)} · {formatPromptLength(promptLength)} · {formatCleanupGoal(cleanupGoal)} · {formatDetailMode(detailMode)}
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isLoading}
        className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "분석 중..." : "프롬프트 생성하기"}
      </button>
    </div>
  );
}

function formatOutputTarget(target: OutputTarget) {
  switch (target) {
    case "gpt":
      return "GPT";
    case "midjourney":
      return "Midjourney";
    case "nano_banana_pro":
      return "Nano Banana Pro";
    case "generic":
      return "Generic";
  }
}

function formatPromptLength(length: PromptLength) {
  switch (length) {
    case "short":
      return "짧게";
    case "standard":
      return "표준";
    case "detailed":
      return "자세히";
  }
}

function formatCleanupGoal(goal: CleanupGoal) {
  switch (goal) {
    case "auto":
      return "자동 판단";
    case "noise":
      return "노이즈 제거";
    case "background":
      return "배경 정리";
    case "texture":
      return "질감 완화";
    case "overall":
      return "전체 정돈";
  }
}

function formatDetailMode(mode: DetailMode) {
  switch (mode) {
    case "auto":
      return "자동 추천";
    case "clean":
      return "Clean / detail_level 1";
    case "balanced":
      return "Balanced / detail_level 2";
    case "rich":
      return "Rich / detail_level 3";
  }
}
