import type {
  CleanupGoal,
  OutputTarget,
  PromptLength,
  Provider,
  StorageMode,
} from "../types/analysis";

export const APP_VERSION = "v0.2.1";

export const DEFAULT_PROVIDER: Provider = "openai";

export const DEFAULT_STORAGE_MODE: StorageMode = "local";

export const DEFAULT_OUTPUT_TARGET: OutputTarget = "gpt";

export const DEFAULT_PROMPT_LENGTH: PromptLength = "standard";

export const DEFAULT_CLEANUP_GOAL: CleanupGoal = "auto";

export const OPENAI_MODEL = "gpt-5.4-mini";

export const CLAUDE_MODEL = "claude-sonnet-4-6";

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_MB = 10;

export const RESIZE_MAX_EDGE = 1600;

export const IMAGE_OUTPUT_TYPE = "image/webp";

export const IMAGE_OUTPUT_QUALITY = 0.9;
