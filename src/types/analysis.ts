export type Provider = "openai" | "claude";

export type StorageMode = "local" | "session" | "none";

export type DetailMode = "auto" | "clean" | "balanced" | "rich";

export type OutputTarget = "gpt" | "midjourney" | "nano_banana_pro" | "generic";

export type PromptLength = "short" | "standard" | "detailed";

export type CleanupGoal =
  | "auto"
  | "noise"
  | "background"
  | "texture"
  | "overall";

export type AppStatus = "idle" | "ready" | "analyzing" | "success" | "error";

export type ImageMeta = {
  fileName: string;
  originalBytes: number;
  outputBytes: number;
  width: number;
  height: number;
  mimeType: string;
};

export type PromptLensResult = {
  image_type: string;
  summary: string;
  preserve: string[];
  reduce: string[];
  recommended_detail_level: 1 | 2 | 3;
  prompt_ko: string;
  prompt_en: string;
  negative_prompt: string;
  target_notes: string;
};
