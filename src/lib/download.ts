import type { OutputTarget, PromptLensResult } from "../types/analysis";

export function downloadPromptResult(
  result: PromptLensResult,
  outputTarget: OutputTarget
) {
  const content = [
    "PromptLens Result",
    "",
    `Output Target: ${formatOutputTarget(outputTarget)}`,
    `Image Type: ${result.image_type}`,
    `Recommended detail_level: ${result.recommended_detail_level}`,
    "",
    "Summary",
    result.summary,
    "",
    "Preserve",
    ...result.preserve.map((item) => `- ${item}`),
    "",
    "Reduce",
    ...result.reduce.map((item) => `- ${item}`),
    "",
    "Korean Prompt",
    result.prompt_ko,
    "",
    "English Prompt",
    result.prompt_en,
    "",
    "Negative Prompt",
    result.negative_prompt,
    "",
    "Target Notes",
    result.target_notes,
    "",
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `PromptLens_${formatOutputTarget(outputTarget)}_result.txt`;
  anchor.click();

  URL.revokeObjectURL(url);
}

function formatOutputTarget(outputTarget: OutputTarget) {
  switch (outputTarget) {
    case "gpt":
      return "GPT";
    case "midjourney":
      return "Midjourney";
    case "nano_banana_pro":
      return "Nano_Banana_Pro";
    case "generic":
      return "Generic";
  }
}
