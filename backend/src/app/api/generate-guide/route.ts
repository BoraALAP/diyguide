"use server";

import OpenAI from "openai";

import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

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

export async function POST(req: NextRequest) {
  console.log("generating guide");

  // Verify API key for endpoint security
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_AUTH_KEY) {
    return NextResponse.json({
      message: `Unauthorized, ${apiKey}, ${process.env.API_AUTH_KEY}`,
    }, { status: 401 });
  }

  const { query } = await req.json();

  try {
    const supabase = await createClient();

    const { data: existingTags, error: fetchError } = await supabase
      .from("tags")
      .select("id, name");

    if (fetchError) throw new Error("Error fetching existing tags");

    const existingTagMap = Object.fromEntries(
      existingTags.map((tag) => [tag.name, tag.id]),
    );

    const aiResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [{
        role: "system",
        content:
          `You are a specialist on writing a do it your self guides. You are given a topic and you need to write a detailed guide for it. You need to provide steps and tips. Include a list of materials and tools needed with their measurements for each step and for the whole guide. additionally, give tags for the guide, please avoid tags like diy and please put space between words. Include tags for the guide. Use existing tags where applicable: ${
            Object.keys(existingTagMap).join(", ")
          }.`,
      }, {
        role: "user",
        content: query,
      }],
      response_format: zodResponseFormat(GuideSchema, "guide"),
      max_tokens: 2000,
    });

    const content = aiResponse.choices[0].message.parsed;

    if (!content) throw new Error("No content");
    const newTags = content.tags.filter((tag) => !existingTagMap[tag]);

    if (newTags.length > 0) {
      const { data: insertedTags, error: insertError } = await supabase
        .from("tags")
        .insert(newTags.map((name) => ({ name })))
        .select("id, name");

      if (insertError) throw new Error("Error inserting new tags");

      // Add new tags to the existingTagMap
      insertedTags.forEach((tag) => {
        existingTagMap[tag.name] = tag.id;
      });
    }

    const { data: guideData, error: guideError } = await supabase
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

    if (guideError) {
      console.log(guideError);

      throw new Error("Error inserting guide");
    }

    const guideId = guideData.id;

    // Step 5: Link tags to the guide in the `guide_tags` table
    const guideTags = content.tags.map((tag) => ({
      guide_id: guideId,
      tag_id: existingTagMap[tag],
    }));

    console.log(guideTags);

    const { error: linkError } = await supabase
      .from("guide_tags")
      .insert(guideTags);

    if (linkError) throw new Error("Error linking tags to guide");

    return NextResponse.json({ data: guideData, error: null });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
