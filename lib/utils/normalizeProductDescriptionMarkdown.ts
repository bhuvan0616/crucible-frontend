/** Normalize product description markdown from Medusa admin before rendering. */
export function normalizeProductDescriptionMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    // Ensure lists are separate blocks when a blank line was lost in admin/API
    .replace(/([^\n-*])\n(-\s)/g, "$1\n\n$2")
    .replace(/([^\n])\n(\d+\.\s)/g, "$1\n\n$2")
    .trim();
}
