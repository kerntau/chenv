/**
 * 轻量纯净的 Frontmatter 剥离工具
 * 不引入任何第三方大型库与 Polyfill，确保零依赖与极致 Tree Shaking
 */
export function stripFrontmatter(content: string): string {
  if (!content) return '';
  return content.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, '').trim();
}

export function stripDuplicateHeading(content: string, title?: string): string {
  if (!content) return '';
  const noFrontmatter = stripFrontmatter(content);
  const trimmed = noFrontmatter.trim();
  if (trimmed.startsWith('# ')) {
    const lines = trimmed.split('\n');
    const firstHeading = lines[0].replace(/^#\s+/, '').trim();
    if (
      !title ||
      firstHeading === title.trim() ||
      firstHeading.toLowerCase() === title.trim().toLowerCase()
    ) {
      return lines.slice(1).join('\n').trim();
    }
  }
  return trimmed;
}
