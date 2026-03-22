import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 100000000) {
    const eok = Math.floor(price / 100000000);
    const man = Math.floor((price % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만` : `${eok}억`;
  }
  if (price >= 10000) {
    return `${Math.floor(price / 10000).toLocaleString()}만`;
  }
  return price.toLocaleString();
}

export function formatArea(pyeong: number): string {
  const sqm = pyeong * 3.306;
  return `${pyeong.toLocaleString()}평 (${sqm.toFixed(0)}m²)`;
}
