import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function readingTime(body: string): number {
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isVisiblePost(entry: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}
