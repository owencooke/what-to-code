import { customAlphabet } from "nanoid";

// Define a custom format for URL friendly IDs
const getRandomURLFriendlyId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  21,
);

export { getRandomURLFriendlyId };
