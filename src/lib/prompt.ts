import type { DetailMode, OutputTarget } from "../types/analysis";

export function buildAnalysisInstruction(
  detailMode: DetailMode,
  outputTarget: OutputTarget
) {
  return `
You are PromptLens, an image-to-cleanup-prompt analysis tool.

Analyze the uploaded image and generate cleanup-focused image regeneration prompts.

Important:
- Do not generate or edit the image.
- Your output is only a prompt for recreating the image more cleanly.
- Preserve the original subject, structure, composition, camera angle, lighting direction, color palette, and overall mood.
- Do not invent new objects, new people, new backgrounds, new clothing, or new styles unless they clearly exist in the image.
- Reduce visual noise, speckled artifacts, excessive micro-texture, cluttered details, unstable rendering, harsh highlights, muddy details, and distracting background elements.
- If the image is already clean, recommend subtle cleanup only.
- The Korean prompt should be natural and directly usable.
- The English prompt should be production-ready and adapted to the selected output target.
- Always provide a useful negative_prompt focused on what should be avoided.

Detail level guide:
- detail_level 1 = Clean: strongest simplification, cleaner surfaces, less visual density.
- detail_level 2 = Balanced: natural cleanup while preserving important detail.
- detail_level 3 = Rich: preserve most detail while reducing only distracting noise.

Output target:
${buildOutputTargetInstruction(outputTarget)}

User selected detail mode: ${detailMode}
User selected output target: ${outputTarget}

Return only valid JSON. Do not wrap it in markdown.

Required JSON shape:
{
  "image_type": "string",
  "summary": "string",
  "preserve": ["string"],
  "reduce": ["string"],
  "recommended_detail_level": 1,
  "prompt_ko": "string",
  "prompt_en": "string",
  "negative_prompt": "string",
  "target_notes": "string"
}
`.trim();
}

function buildOutputTargetInstruction(outputTarget: OutputTarget) {
  switch (outputTarget) {
    case "gpt":
      return `
GPT:
- Use clear natural-language instructions.
- Prefer imperative phrasing such as preserve, reduce, keep, do not change.
- Mention that the uploaded image should be used as the reference image.
- Avoid Midjourney-style parameters.
`.trim();

    case "midjourney":
      return `
Midjourney:
- Use a compact descriptive prompt with strong visual keywords.
- Prefer comma-separated visual descriptors.
- Include cleanup ideas such as clean detail, reduced noise, refined background, natural texture.
- Do not overuse command parameters.
- If helpful, add a minimal parameter such as --style raw, but avoid aspect ratio assumptions.
`.trim();

    case "nano_banana_pro":
      return `
Nano Banana Pro:
- Use a structured natural-language prompt for Gemini image generation or editing.
- Explicitly say to use the uploaded image as the reference.
- Clearly describe the goal, subject preservation, scene structure, style, cleanup intent, and constraints.
- Keep it faithful to the reference and avoid introducing new objects, people, clothing, or a different visual style.
`.trim();

    case "generic":
      return `
Generic:
- Use a balanced prompt that can work in most image generation tools.
- Avoid model-specific parameters.
- Make the prompt clear, descriptive, and cleanup-focused.
- Keep the negative prompt broadly compatible.
`.trim();
  }
}
