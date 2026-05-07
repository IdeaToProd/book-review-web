import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 채도 낮은 6색 팔레트 — 라이트/다크 양쪽에서 자연스러운 아바타 배경색 */
const AVATAR_TONES = [
  "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
] as const;

/**
 * 시드 문자열(이메일)에서 결정론적으로 아바타 색상 클래스를 반환
 * 같은 이메일은 항상 같은 색상
 */
export function getAvatarTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash += seed.charCodeAt(i);
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}
