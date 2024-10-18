import { createClient } from "@supabase/supabase-js";

// Check if environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error(
    "Environment variables for Supabase client must be set: SUPABASE_URL, SUPABASE_KEY",
  );
}

// Create Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export { supabase };
