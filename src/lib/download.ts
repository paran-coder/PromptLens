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

  downloadTextFile(
    content,
    `PromptLens_${formatOutputTarget(outputTarget)}_result.txt`,
    "text/plain;charset=utf-8"
  );
}

export function downloadPromptResultJson(
  result: PromptLensResult,
  outputTarget: OutputTarget
) {
  const content = JSON.stringify(
    {
      output_target: outputTarget,
      exported_at: new Date().toISOString(),
      result,
    },
    null,
    2
  );

  downloadTextFile(
    content,
    `PromptLens_${formatOutputTarget(outputTarget)}_result.json`,
    "application/json;charset=utf-8"
  );
}

function downloadTextFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
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
