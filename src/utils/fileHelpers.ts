/**
 * Formats bytes to human-readable size string (KB, MB, etc.).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Returns a human-friendly label for standard MIME types.
 */
export function getFriendlyFileType(mimeType: string, fileName?: string): string {
  if (mimeType === 'application/pdf' || fileName?.endsWith('.pdf')) {
    return 'PDF Document';
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName?.endsWith('.docx')
  ) {
    return 'Word Document';
  }
  if (mimeType.startsWith('image/')) {
    return `Image (${mimeType.split('/')[1].toUpperCase()})`;
  }
  return 'Document';
}
