import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function stripMdxSyntax(input: string): string {
  const withoutImports = input.replace(/^import\s+[^\n]+$/gm, ' ');
  let out = '';
  let i = 0;
  const len = withoutImports.length;

  while (i < len) {
    if (
      withoutImports[i] === '<' &&
      ((withoutImports[i + 1] >= 'A' && withoutImports[i + 1] <= 'Z') ||
        (withoutImports[i + 1] === '/' &&
          withoutImports[i + 2] >= 'A' &&
          withoutImports[i + 2] <= 'Z'))
    ) {
      let j = i + 1;
      let braceDepth = 0;
      let quote: string | null = null;
      while (j < len) {
        const ch = withoutImports[j];
        if (quote) {
          if (ch === '\\') {
            j += 2;
            continue;
          }
          if (ch === quote) quote = null;
        } else if (ch === '"' || ch === "'" || ch === '`') {
          quote = ch;
        } else if (ch === '{') {
          braceDepth += 1;
        } else if (ch === '}') {
          braceDepth = Math.max(0, braceDepth - 1);
        } else if (ch === '>' && braceDepth === 0) {
          j += 1;
          break;
        }
        j += 1;
      }
      out += ' ';
      i = j;
      continue;
    }
    out += withoutImports[i];
    i += 1;
  }

  return out;
}

export function readingTime(body: string): number {
  const text = stripMdxSyntax(
    body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')
  ).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isVisiblePost(entry: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}
