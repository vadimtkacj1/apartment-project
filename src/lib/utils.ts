export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict-resolution (shadcn convention).
 * Backwards-compatible with the previous varargs signature: clsx accepts the
 * same `(...strings | false | null | undefined)` plus objects/arrays.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
