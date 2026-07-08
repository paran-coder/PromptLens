import type {
  CleanupGoal,
  DetailMode,
  OutputTarget,
  PromptLength,
} from "../types/analysis";

export function buildAnalysisInstruction(params: {
  detailMode: DetailMode;
  outputTarget: OutputTarget;
  promptLength: PromptLength;
  cleanupGoal: CleanupGoal;
}) {
  return `
You are PromptLens, an image-to-cleanup-prompt analysis tool.

Analyze the uploaded image and generate cleanup-focused image regeneration prompts.

Important:
- Do not generate or edit the image.
- Your output is only a prompt for recreating the image more cleanly.
- Preserve the original subject, structure, composition, camera angle, lighting direction, color palette, and overall mood.
- Do not invent new objects, new people, new backgrounds, new clothing, or new styles unless they clearly exist in the image.
- Reduce visual noise, speckled artifacts, excessive micro-texture, cluttered details, unstable rendering, harsh highlights, muddy details, distracting background elements, and over-sharpening.
- If the image is already clean, recommend subtle cleanup only.
- The Korean prompt should be natural and directly usable.
- The English prompt should be production-ready and adapted to the selected output target.
- Always provide a useful negative_prompt focused on what should be avoided.
- Always provide target_notes explaining how to use the generated prompt for the selected output target.
- The negative_prompt and target_notes fields must never be empty.

Detail level guide:
- detail_level 1 = Clean: strongest simplification, cleaner surfaces, less visual density.
- detail_level 2 = Balanced: natural cleanup while preserving important detail.
- detail_level 3 = Rich: preserve most detail while reducing only distracting noise.
${buildDetailModeInstruction(params.detailMode)}

Cleanup goal:
${buildCleanupGoalInstruction(params.cleanupGoal)}

Prompt length:
${buildPromptLengthInstruction(params.promptLength, params.outputTarget)}

Output target:
${buildOutputTargetInstruction(params.outputTarget)}

User selected detail mode: ${params.detailMode}
User selected cleanup goal: ${params.cleanupGoal}
User selected prompt length: ${params.promptLength}
User selected output target: ${params.outputTarget}

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

function buildDetailModeInstruction(detailMode: DetailMode) {
  switch (detailMode) {
    case "auto":
      return "- The user selected auto. Inspect the image and choose detail_level 1, 2, or 3 based on how much cleanup is needed.";
    case "clean":
      return "- The user selected Clean. Prefer recommended_detail_level 1 and make the prompt strongly reduce visual density while preserving the original subject and composition.";
    case "balanced":
      return "- The user selected Balanced. Prefer recommended_detail_level 2 and make the prompt naturally clean the image without losing important detail.";
    case "rich":
      return "- The user selected Rich. Prefer recommended_detail_level 3 and make the prompt preserve most visual detail while reducing only distracting artifacts.";
  }
}

function buildCleanupGoalInstruction(cleanupGoal: CleanupGoal) {
  switch (cleanupGoal) {
    case "auto":
      return `
Auto:
- Identify the most important cleanup need in the image.
- Balance noise reduction, background clarity, texture control, and overall coherence.
`.trim();

    case "noise":
      return `
Noise removal:
- Prioritize reducing speckled noise, compression artifacts, grain, unstable edges, and muddy low-level detail.
- Preserve the subject identity, lighting, and composition.
`.trim();

    case "background":
      return `
Background cleanup:
- Prioritize reducing clutter, distracting background micro-detail, messy edges, and visual competition around the subject.
- Keep the original background structure and mood recognizable.
`.trim();

    case "texture":
      return `
Texture softening:
- Prioritize reducing excessive micro-texture, over-sharpening, harsh surface detail, crunchy skin or material texture, and unnatural contrast.
- Keep realistic texture and avoid plastic smoothing.
`.trim();

    case "overall":
      return `
Overall refinement:
- Create a complete cleanup prompt that improves noise, texture, lighting balance, background clarity, and visual coherence together.
- Keep the result faithful to the original image.
`.trim();
  }
}

function buildPromptLengthInstruction(
  promptLength: PromptLength,
  outputTarget: OutputTarget
) {
  const midjourneySuffix =
    outputTarget === "midjourney"
      ? " For Midjourney, keep the final prompt compact and keyword-oriented even when detailed is selected."
      : "";

  switch (promptLength) {
    case "short":
      return `Short:
- Make prompt_ko and prompt_en concise and immediately usable.
- Avoid long explanations.
- Keep the core preservation and cleanup instructions only.${midjourneySuffix}`;

    case "standard":
      return `Standard:
- Make prompt_ko and prompt_en practical and complete.
- Include subject preservation, composition, lighting, cleanup focus, and constraints.
- Avoid unnecessary verbosity.${midjourneySuffix}`;

    case "detailed":
      return `Detailed:
- Make prompt_ko and prompt_en more structured and specific.
- Include preservation targets, cleanup targets, style constraints, and fidelity constraints.
- Do not add invented image content.${midjourneySuffix}`;
  }
}

function buildOutputTargetInstruction(outputTarget: OutputTarget) {
  switch (outputTarget) {
    case "gpt":
      return `
GPT:
- Use clear natural-language instructions.
- Prefer imperative phrasing such as preserve, reduce, keep, do not change.
- Mention that the uploaded image should be used as the reference image.
- Use explicit constraints: do not change identity, composition, camera angle, lighting direction, or overall mood.
- Avoid Midjourney-style parameters.
`.trim();

    case "midjourney":
      return `
Midjourney:
- Use a compact descriptive prompt with strong visual keywords.
- Prefer comma-separated visual descriptors.
- Include cleanup ideas such as clean detail, reduced noise, refined background, natural texture, balanced contrast, and faithful composition.
- Do not overuse command parameters.
- If helpful, add a minimal parameter such as --style raw, but avoid aspect ratio assumptions.
- Keep the negative_prompt as a separate comma-separated list, not as Midjourney --no syntax unless clearly useful.
`.trim();

    case "nano_banana_pro":
      return `
Nano Banana Pro:
- Use a structured natural-language prompt for Gemini image generation or editing.
- Explicitly say to use the uploaded image as the reference.
- Clearly describe the goal, subject preservation, scene structure, style, cleanup intent, and constraints.
- Keep it faithful to the reference and avoid introducing new objects, people, clothing, or a different visual style.
- Make the editing intent clear: clean up the reference image, not reinterpret it.
`.trim();

    case "generic":
      return `
Generic:
- Use a balanced prompt that can work in most image generation tools.
- Avoid model-specific parameters.
- Make the prompt clear, descriptive, and cleanup-focused.
- Keep the negative prompt broadly compatible.
- Use wording that works for both text-to-image and image-to-image workflows.
`.trim();
  }
}
