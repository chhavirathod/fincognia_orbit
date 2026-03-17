import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  console.error("Supabase URL is missing or invalid:", supabaseUrl);
  throw new Error("Invalid Supabase URL. Must start with http or https.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
