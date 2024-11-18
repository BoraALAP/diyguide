import { Database } from "./supabase";

export type Guides = Database["public"]["Tables"]["guides"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
