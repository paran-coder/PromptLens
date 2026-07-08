import {
  IMAGE_OUTPUT_QUALITY,
  IMAGE_OUTPUT_TYPE,
  RESIZE_MAX_EDGE,
} from "./constants";
import { estimateDataUrlBytes } from "./dataUrl";
import type { ImageMeta } from "../types/analysis";

export type ResizeImageResult = {
  dataUrl: string;
  meta: ImageMeta;
};

export async function resizeImageToDataUrl(file: File): Promise<ResizeImageResult> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    RESIZE_MAX_EDGE / Math.max(bitmap.width, bitmap.height)
  );

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("이미지 변환을 위한 Canvas 컨텍스트를 만들 수 없습니다.");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  const dataUrl = canvas.toDataURL(IMAGE_OUTPUT_TYPE, IMAGE_OUTPUT_QUALITY);

  bitmap.close?.();

  return {
    dataUrl,
    meta: {
      fileName: file.name,
      originalBytes: file.size,
      outputBytes: estimateDataUrlBytes(dataUrl),
      width,
      height,
      mimeType: IMAGE_OUTPUT_TYPE,
    },
  };
}
