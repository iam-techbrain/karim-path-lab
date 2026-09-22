import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sfqzkvodulafamrhaxtg.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_YXyVCUlCk7OtjrinyY116w_1bw6ak8K";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
