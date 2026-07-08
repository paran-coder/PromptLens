import OpenAI from "openai";
import type {
  CleanupGoal,
  DetailMode,
  OutputTarget,
  PromptLength,
  PromptLensResult,
} from "../../types/analysis";
import { OPENAI_MODEL } from "../constants";
import { extractJsonObject, validatePromptLensResult } from "../json";
import { buildAnalysisInstruction } from "../prompt";

export async function analyzeWithOpenAI(params: {
  apiKey: string;
  imageDataUrl: string;
  detailMode: DetailMode;
  outputTarget: OutputTarget;
  promptLength: PromptLength;
  cleanupGoal: CleanupGoal;
}): Promise<PromptLensResult> {
  const client = new OpenAI({
    apiKey: params.apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.responses.create({
    model: OPENAI_MODEL,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildAnalysisInstruction({
              detailMode: params.detailMode,
              outputTarget: params.outputTarget,
              promptLength: params.promptLength,
              cleanupGoal: params.cleanupGoal,
            }),
          },
          {
            type: "input_image",
            image_url: params.imageDataUrl,
            detail: "auto",
          },
        ],
      },
    ],
  });

  const text = response.output_text;

  if (!text) {
    throw new Error("OpenAI 응답이 비어 있습니다.");
  }

  return validatePromptLensResult(extractJsonObject(text));
}
