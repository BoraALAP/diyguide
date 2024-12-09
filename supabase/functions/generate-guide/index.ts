import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@3.11.6/mod.ts";
import { zodResponseFormat } from "https://deno.land/x/openai@v4.24.0/helpers/zod.ts";

// Define schemas
const StepSchema = z.object({
  step: z.number(),
  description: z.string(),
  materials: z.array(z.string()),
  tools: z.array(z.string()),
});

const GuideSchema = z.object({
  title: z.string(),
  content: z.string(),
  steps: z.array(StepSchema),
  tools: z.array(z.string()),
  materials: z.array(z.string()),
  tags: z.array(z.string()),
  tips: z.array(z.string()),
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    );

    const { data: { user }, error: userError } = await supabaseClient.auth
      .getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { query } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
      organization: Deno.env.get("OPENAI_ORGANIZATION_ID"),
    });

    const { data: existingTags, error: fetchError } = await supabaseClient
      .from("tags")
      .select("id, name");

    if (fetchError) throw new Error("Error fetching existing tags");

    const existingTagMap = Object.fromEntries(
      existingTags.map((tag) => [tag.name, tag.id]),
    );

    const aiResponse = await openai.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            `You are a specialist on writing a do it your self guides...`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      response_format: zodResponseFormat(GuideSchema, "guide"),
      max_tokens: 2000,
    });

    const content = aiResponse.choices[0].message.parsed;
    if (!content) throw new Error("No content");

    const newTags = content.tags.filter((tag) => !existingTagMap[tag]);

    if (newTags.length > 0) {
      const { data: insertedTags, error: insertError } = await supabaseClient
        .from("tags")
        .insert(newTags.map((name) => ({ name })))
        .select("id, name");

      if (insertError) throw new Error("Error inserting new tags");

      insertedTags.forEach((tag) => {
        existingTagMap[tag.name] = tag.id;
      });
    }

    const { data: guideData, error: guideError } = await supabaseClient
      .from("guides")
      .insert([{
        title: content.title,
        content: content.content,
        steps: content.steps,
        tools: content.tools,
        materials: content.materials,
        created_by: "AI",
        tips: content.tips,
      }])
      .select("id, title, content, steps, tips")
      .single();

    if (guideError) throw new Error("Error inserting guide");

    const guideId = guideData.id;

    const guideTags = content.tags.map((tag) => ({
      guide_id: guideId,
      tag_id: existingTagMap[tag],
    }));

    const { error: linkError } = await supabaseClient
      .from("guide_tags")
      .insert(guideTags);

    if (linkError) throw new Error("Error linking tags to guide");

    return new Response(JSON.stringify({ data: guideData, error: null }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message === "Unauthorized" ? 401 : 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
