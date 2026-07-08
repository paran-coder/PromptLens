import { useState } from "react";

type PromptCardProps = {
  title: string;
  text: string;
};

export function PromptCard({ title, text }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>
        <button
          type="button"
          onClick={copyText}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/20"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
        {text}
      </p>
    </div>
  );
}
