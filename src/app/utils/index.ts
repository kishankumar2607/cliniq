// src/app/utils.ts or src/app/utils/index.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }