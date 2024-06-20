import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const selectRandom = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const toAlphaLowerCase = (str: string) =>
  str.replace(/[^a-zA-Z]/g, "").toLowerCase();
