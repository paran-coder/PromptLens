import type { DetailMode, ImageMeta, OutputTarget } from "../types/analysis";
import { formatBytes } from "../lib/dataUrl";

type ImageUploaderProps = {
  imageDataUrl: string;
  imageMeta: ImageMeta | null;
  detailMode: DetailMode;
  outputTarget: OutputTarget;
  isLoading: boolean;
  onDetailModeChange: (mode: DetailMode) => void;
  onOutputTargetChange: (target: OutputTarget) => void;
  onFileSelected: (file: File) => void;
  onAnalyze: () => void;
};

export function ImageUploader({
  imageDataUrl,
  imageMeta,
  detailMode,
  outputTarget,
  isLoading,
  onDetailModeChange,
  onOutputTargetChange,
  onFileSelected,
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

      <label className="mt-5 block text-sm font-medium text-slate-300">
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

      <label className="mt-5 block text-sm font-medium text-slate-300">
        정리 강도
      </label>
      <select
        value={detailMode}
        onChange={(event) => onDetailModeChange(event.target.value as DetailMode)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
      >
        <option value="auto">자동 추천</option>
        <option value="clean">Clean - 강하게 단순화</option>
        <option value="balanced">Balanced - 자연스럽게 정리</option>
        <option value="rich">Rich - 디테일 유지</option>
      </select>

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
