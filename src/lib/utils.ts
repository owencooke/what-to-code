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

export const shuffleArray = (array: Array<any>): Array<any> => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};
