const features = [
  {
    title: "BYOK",
    body: "본인의 OpenAI 또는 Claude API 키를 사용합니다. 서버 없이 브라우저에서 직접 호출합니다.",
  },
  {
    title: "Target-aware",
    body: "GPT, Midjourney, Nano Banana Pro, Generic 중 선택한 대상에 맞춰 프롬프트 스타일을 바꿉니다.",
  },
  {
    title: "Cleanup-focused",
    body: "원본의 핵심은 유지하고 점 노이즈, 과한 질감, 산만한 디테일을 줄이는 방향에 집중합니다.",
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
