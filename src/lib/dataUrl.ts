export function splitDataUrl(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/^data:(.*);base64$/);

  if (!base64 || !mimeMatch?.[1]) {
    throw new Error("이미지 데이터 형식이 올바르지 않습니다.");
  }

  return {
    mimeType: mimeMatch[1],
    base64,
  };
}

export function estimateDataUrlBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
