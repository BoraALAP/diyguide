import { Database } from "./supabase";

export type Guides = Database["public"]["Tables"]["guides"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type Tags = Database["public"]["Tables"]["tags"]["Row"];
export type GuideTags = Database["public"]["Tables"]["guide_tags"]["Row"];
