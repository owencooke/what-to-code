export const selectRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const toAlphaLowerCase = (str: string): string =>
  str.replace(/[^a-zA-Z]/g, "").toLowerCase();

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};
