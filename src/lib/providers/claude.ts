import Anthropic from "@anthropic-ai/sdk";
import type {
  CleanupGoal,
  DetailMode,
  OutputTarget,
  PromptLength,
  PromptLensResult,
} from "../../types/analysis";
import { CLAUDE_MODEL } from "../constants";
import { splitDataUrl } from "../dataUrl";
import { extractJsonObject, validatePromptLensResult } from "../json";
import { buildAnalysisInstruction } from "../prompt";

type ClaudeSupportedMimeType = "image/jpeg" | "image/png" | "image/webp";

export async function analyzeWithClaude(params: {
  apiKey: string;
  imageDataUrl: string;
  detailMode: DetailMode;
  outputTarget: OutputTarget;
  promptLength: PromptLength;
  cleanupGoal: CleanupGoal;
}): Promise<PromptLensResult> {
  const client = new Anthropic({
    apiKey: params.apiKey,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "anthropic-dangerous-direct-browser-access": "true",
    },
  });

  const { mimeType, base64 } = splitDataUrl(params.imageDataUrl);

  if (!isClaudeSupportedMimeType(mimeType)) {
    throw new Error("Claude 분석은 JPG, PNG, WebP 이미지만 지원합니다.");
  }

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: base64,
            },
          },
          {
            type: "text",
            text: buildAnalysisInstruction({
              detailMode: params.detailMode,
              outputTarget: params.outputTarget,
              promptLength: params.promptLength,
              cleanupGoal: params.cleanupGoal,
            }),
          },
        ],
      },
    ],
  });

  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude 응답이 비어 있습니다.");
  }

  return validatePromptLensResult(extractJsonObject(text));
}

function isClaudeSupportedMimeType(value: string): value is ClaudeSupportedMimeType {
  return ["image/jpeg", "image/png", "image/webp"].includes(value);
}
