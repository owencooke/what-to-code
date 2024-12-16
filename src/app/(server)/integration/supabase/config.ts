import { createClient } from "@supabase/supabase-js";

// NOTE: use this for non-DB related functions like storage
// DB related functions should be done via Drizzle ORM (better SQL client)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);
