import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod/mod.ts";
import { zodResponseFormat } from "https://deno.land/x/openai@v4.69.0/helpers/zod.ts";
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

const openAiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const openAiOrganizationId = Deno.env.get("OPENAI_ORGANIZATION_ID");
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!openAiKey) {
    throw new Error("Missing environment variable OPENAI_KEY");
  }

  if (!supabaseUrl) {
    throw new Error("Missing environment variable SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable SUPABASE_ANON_KEY");
  }

  // const { data: { user }, error: userError } = await supabaseClient.auth
  //   .getUser();
  // if (userError || !user) {
  //   throw new Error("Unauthorized222");
  // }

  const requestData = await req.json();

  if (!requestData) {
    throw new Error("Missing request data");
  }

  const { query } = requestData;

  if (!query) {
    throw new Error("Missing query in request data");
  }

  // Intentionally log the query

  const sanitizedQuery = query.trim();
  console.log({ sanitizedQuery });

  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const openai = new OpenAI({
      apiKey: openAiKey,
      organization: openAiOrganizationId,
    });

    const { data: existingTags, error: fetchError } = await supabaseClient
      .from("tags")
      .select("id, name");

    if (fetchError) throw new Error("Error fetching existing tags");

    const existingTagMap = Object.fromEntries(
      existingTags.map((tag: any) => [tag.name, tag.id]),
    );

    const aiResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            `You are a specialist on writing a do it your self guides. You are given a topic and you need to write a detailed guide for it. You need to provide steps and tips. Include a list of materials and tools needed with their measurements for each step and for the whole guide. additionally, give tags for the guide, please avoid tags like diy and please put space between words. For the title, please don't say "How to ...". Keep it short and to the point. Include tags for the guide. Use existing tags where applicable: ${
              Object.keys(existingTagMap).join(", ")
            }.`,
        },
        {
          role: "user",
          content: sanitizedQuery,
        },
      ],
      response_format: zodResponseFormat(GuideSchema, "guide"),
      max_tokens: 2000,
    });

    const content = aiResponse.choices[0].message.parsed;

    if (!content) throw new Error("No content");

    const newTags = content.tags.filter((tag: any) => !existingTagMap[tag]);

    if (newTags.length > 0) {
      const { data: insertedTags, error: insertError } = await supabaseClient
        .from("tags")
        .insert(newTags.map((name: string) => ({ name })))
        .select("id, name");

      if (insertError) throw new Error("Error inserting new tags");

      insertedTags.forEach((tag: any) => {
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

    const guideTags = content.tags.map((tag: any) => ({
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
