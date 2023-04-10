import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseApiUrl = "https://ympyxgbyyltbvljdxild.supabase.co";
const { SUPABASE_KEY } = process.env;
if (!SUPABASE_KEY) throw new Error("ERROR WHILE CONNECTING TO SUPABASE");
export const supabase = createClient(supabaseApiUrl, SUPABASE_KEY);
