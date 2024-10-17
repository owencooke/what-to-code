import { createClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";

// Create Superbase connection
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? "",
);

// Define a custom ID format for URL friendly chars
const alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 21);

export { supabase, generateId };
