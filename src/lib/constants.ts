import type { Provider, StorageMode, OutputTarget } from "../types/analysis";

export const DEFAULT_PROVIDER: Provider = "openai";

export const DEFAULT_STORAGE_MODE: StorageMode = "local";

export const APP_VERSION = "v0.1.7";

export const DEFAULT_OUTPUT_TARGET: OutputTarget = "gpt";

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
