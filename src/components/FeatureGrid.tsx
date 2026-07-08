const features = [
  {
    title: "GPT-first",
    body: "기본 목적은 GPT Images의 노이즈·과한 디테일을 줄이는 cleanup prompt 생성입니다.",
  },
  {
    title: "Format templates",
    body: "Nano Banana Pro, Midjourney-style, Generic은 직접 실행 지원이 아니라 붙여넣기용 프롬프트 형식 변환입니다.",
  },
  {
    title: "BYOK",
    body: "본인의 OpenAI 또는 Claude API 키를 사용합니다. 서버 없이 브라우저에서 직접 호출합니다.",
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
