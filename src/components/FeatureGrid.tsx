const features = [
  {
    title: "Prompt quality",
    body: "프롬프트 길이와 정리 목적을 선택해 더 정확한 재생성 프롬프트를 만듭니다.",
  },
  {
    title: "Target-aware",
    body: "GPT, Midjourney, Nano Banana Pro, Generic 중 선택한 대상에 맞춰 문법과 톤을 조정합니다.",
  },
  {
    title: "Cleanup-focused",
    body: "원본의 핵심은 유지하고 노이즈, 과한 질감, 산만한 배경, 불안정한 디테일을 줄입니다.",
  },
];

export function FeatureGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
        >
          <h3 className="text-lg font-bold">{feature.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{feature.body}</p>
        </div>
      ))}
    </section>
  );
}
