/**
 * 将内存大小（以字节为单位）格式化为可读形式
 * @param bytes 内存大小（字节）
 * @returns 格式化后的字符串
 */
export function formatMemorySize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * 格式化时间
 * @param milliseconds 毫秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds} ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)} 秒`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
    return `${minutes} 分 ${seconds} 秒`;
  }
} 