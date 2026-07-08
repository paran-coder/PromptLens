import type { OutputTarget, PromptLensResult } from "../types/analysis";
import { downloadPromptResult } from "../lib/download";
import { PromptCard } from "./PromptCard";

type ResultPanelProps = {
  result: PromptLensResult | null;
  outputTarget: OutputTarget;
};

export function ResultPanel({ result, outputTarget }: ResultPanelProps) {
  return (
    <section
      id="result"
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-200">Step 3</p>
          <h2 className="mt-1 text-2xl font-bold">분석 결과</h2>
        </div>

        {result && (
          <button
            type="button"
            onClick={() => downloadPromptResult(result, outputTarget)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/20"
          >
            TXT 다운로드
          </button>
        )}
      </div>

      {!result ? (
        <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-8 text-center text-slate-400">
          이미지를 업로드하고 분석을 실행하면 결과가 여기에 표시됩니다.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">이미지 유형</p>
            <p className="mt-1 text-lg font-semibold">{result.image_type}</p>

            <p className="mt-5 text-sm text-slate-400">요약</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {result.summary}
            </p>

            <div className="mt-5">
              <p className="font-semibold">유지할 요소</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                {result.preserve.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="font-semibold">줄일 요소</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                {result.reduce.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
              추천 detail_level: {result.recommended_detail_level}
            </div>

            <div className="mt-4 rounded-2xl border border-violet-300/20 bg-violet-300/10 px-4 py-4 text-sm leading-6 text-violet-100">
              <p className="mb-2 font-semibold text-violet-50">Target Notes</p>
              <p>{result.target_notes || "선택한 출력 대상에 맞는 사용 팁이 생성되지 않았습니다."}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <PromptCard title="한국어 프롬프트" text={result.prompt_ko} />
            <PromptCard title="English Prompt" text={result.prompt_en} />
            <PromptCard
              title="Negative Prompt"
              text={
                result.negative_prompt ||
                "speckled noise, artifacts, excessive texture, cluttered background, over-sharpening, unstable rendering"
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
