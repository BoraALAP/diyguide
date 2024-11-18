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
  tags: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  // Verify API key for endpoint security
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_AUTH_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { query } = await req.json();

  console.log(query);

  try {
    const supabase = await createClient();

    const aiResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [{
        role: "system",
        content:
          "You are a specialist on writing a do it your self guides. You are given a topic and you need to write a detailed guide for it. You need to provide steps and tips. also generate a list of materials and tools needed. additionally, give tags for the guide.",
      }, {
        role: "user",
        content: query,
      }],
      response_format: zodResponseFormat(GuideSchema, "guide"),
      max_tokens: 500,
    });

    const content = aiResponse.choices[0].message.parsed;

    console.log(content);
    if (!content) throw new Error("No content");
    const { data, error } = await supabase
      .from("guides")
      .insert([{
        title: content.title,
        content: content.content,
        steps: content.steps,
        created_by: "AI",
        tags: content.tags,
      }])
      .select("id, title");

    console.log(data);

    if (error) throw error;

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
