import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "https://esm.sh/@google/genai";
import { z } from "https://deno.land/x/zod/mod.ts";
// Define schemas
const StepSchema = z.object({
  step: z.number(),
  description: z.string(),
  materials: z.array(z.string()),
  tools: z.array(z.string()),
  image_url: z.string().url().optional(),
  image_prompt: z.string().optional(),
});

const GuideSchema = z.object({
  title: z.string(),
  content: z.string(),
  steps: z.array(StepSchema),
  tools: z.array(z.string()),
  materials: z.array(z.string()),
  tags: z.array(z.string()),
  tips: z.array(z.string()),
  thumbnail_prompt: z.string().optional(),
});

// Support both OPENAI_API_KEY and OPENAI_KEY for flexibility
const openAiKey = Deno.env.get("OPENAI_API_KEY") ?? Deno.env.get("OPENAI_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const openAiOrganizationId = Deno.env.get("OPENAI_ORGANIZATION_ID");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
const enableImageGen =
  (Deno.env.get("ENABLE_IMAGE_GEN") ?? "false").toLowerCase() === "true";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS
  // Avoid logging secrets. Log presence only for debugging.
  console.log("OPENAI key present:", Boolean(openAiKey));
  console.log(supabaseUrl);
  console.log("Supabase anon present:", Boolean(supabaseAnonKey));
  console.log("OPENAI org present:", Boolean(openAiOrganizationId));
  console.log("Image gen enabled:", enableImageGen);
  console.log("Gemini key present:", Boolean(geminiApiKey));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!openAiKey) {
    throw new Error(
      "Missing environment variable: set OPENAI_API_KEY (preferred) or OPENAI_KEY",
    );
  }

  if (!supabaseUrl) {
    throw new Error("Missing environment variable SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable SUPABASE_ANON_KEY");
  }

  // A service role key is only required when image generation & storage upload is enabled
  if (enableImageGen && !supabaseServiceRoleKey) {
    throw new Error(
      "ENABLE_IMAGE_GEN is true but SUPABASE_SERVICE_ROLE_KEY is not set",
    );
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

  try {
    // Determine an external origin to use for public URLs
    const fwdProto = req.headers.get("x-forwarded-proto") ?? undefined;
    const fwdHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? undefined;
    const forwardedOrigin = fwdHost && (fwdProto ? `${fwdProto}://${fwdHost}` : `http://${fwdHost}`);
    const publicBaseOverride = Deno.env.get("PUBLIC_SUPABASE_URL") ||
      Deno.env.get("EXTERNAL_SUPABASE_URL") ||
      forwardedOrigin ||
      undefined;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseServiceClient = enableImageGen && supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey)
      : null;

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

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `You are a specialist on writing a do it your self guides. You are given a topic and you need to write a detailed guide for it. You need to provide steps and tips. Include a list of materials and tools needed with their measurements for each step and for the whole guide. additionally, give tags for the guide, please avoid tags like diy and please put space between words. For the title, please don't say "How to ...". Keep it short and to the point. Include tags for the guide. Use existing tags where applicable: ${
              Object.keys(existingTagMap).join(", ")
            }. Return a single JSON object with keys: title, content, steps (array of {step:number, description:string, materials:string[], tools:string[]}), tools (string[]), materials (string[]), tags (string[]), tips (string[]), thumbnail_prompt (string). The thumbnail_prompt must describe a single hero image of the finished project, highlight key materials, use clean studio lighting, and explicitly forbid any text, labels, or watermarks. Respond with ONLY valid JSON. Do not include backticks or any non-JSON text.`,
        },
        {
          role: "user",
          content: sanitizedQuery,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    // Robustly extract JSON string content
    let raw = (aiResponse as any)?.choices?.[0]?.message?.content ?? "";
    if (Array.isArray(raw)) {
      raw = raw
        .map((p: any) => (typeof p === "string" ? p : p?.text ?? ""))
        .join("");
    }
    let contentText = String(raw ?? "").trim();
    if (contentText.startsWith("```")) {
      const start = contentText.indexOf("\n");
      const end = contentText.lastIndexOf("```");
      if (start !== -1 && end !== -1) {
        contentText = contentText.slice(start + 1, end).trim();
      }
    }
    let content: any;
    try {
      content = JSON.parse(contentText);
    } catch (e) {
      console.log("AI JSON parse failed. Snippet:", contentText.slice(0, 400));
      return new Response(
        JSON.stringify({ error: "AI did not return valid JSON", snippet: contentText.slice(0, 400) }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } },
      );
    }

    // Validate shape using Zod
    const parsed = GuideSchema.safeParse(content);
    if (!parsed.success) {
      throw new Error("AI response failed schema validation");
    }
    content = parsed.data;

    const openAiThumbnailPrompt = content.thumbnail_prompt?.trim();
    const materialsPreview = Array.isArray(content.materials)
      ? content.materials.filter(Boolean).slice(0, 3).join(", ")
      : "versatile DIY materials";
    const fallbackThumbnailPrompt = `Photo-realistic hero image of the finished project \"${content.title}\". Highlight key materials (${materialsPreview || "common household tools"}), use clean neutral background, soft natural lighting, no hands, people, or overlaid text.`;
    const usedThumbnailPrompt = openAiThumbnailPrompt && openAiThumbnailPrompt.length > 0
      ? openAiThumbnailPrompt
      : fallbackThumbnailPrompt;
    content.thumbnail_prompt = usedThumbnailPrompt;
    let guideThumbnailUrl: string | null = null;

    // Optionally generate step images with Gemini and upload to Supabase Storage
    if (enableImageGen && geminiApiKey && supabaseServiceClient) {
      const sessionId = crypto.randomUUID();

      const generatePrompt = (step: any) =>
        `Create a clear, instructional illustration for this DIY step.
Step: ${step.description}
Materials: ${step.materials?.join(", ") || "none"}
Tools: ${step.tools?.join(", ") || "none"}
Style: clean, minimal, neutral background, high-contrast, easy to understand, no text labels.
Output: single PNG image.`;

      // Helper to decode base64 to Uint8Array in Deno
      const b64ToBytes = (b64: string) => {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
      };

      // Call Gemini image generation using the @google/genai SDK via esm.sh (Deno-friendly)
      const generateImage = async (prompt: string) => {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey! });
        const response: any = await ai.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: prompt,
          generationConfig: { responseMimeType: "image/png" },
        });

        const parts = response?.candidates?.[0]?.content?.parts ?? [];
        let b64: string | undefined;
        for (const part of parts) {
          if (part?.inlineData?.data) {
            b64 = part.inlineData.data;
            break;
          }
          if (part?.inline_data?.data) {
            b64 = part.inline_data.data;
            break;
          }
        }
        if (!b64) throw new Error("Gemini response missing image data");
        return b64ToBytes(b64);
      };

      if (usedThumbnailPrompt) {
        try {
          const bytes = await generateImage(usedThumbnailPrompt);
          const path = `guide-images/${sessionId}/thumbnail.png`;
          const blob = new Blob([bytes], { type: "image/png" });
          const { error: thumbErr } = await supabaseServiceClient
            .storage
            .from("guide-images")
            .upload(path.replace(/^guide-images\//, ""), blob, {
              contentType: "image/png",
              upsert: true,
            });
          if (thumbErr) throw thumbErr;
          const { data: thumbPub } = supabaseServiceClient
            .storage
            .from("guide-images")
            .getPublicUrl(path.replace(/^guide-images\//, ""));
          let publicThumbUrl = thumbPub.publicUrl as string;
          if (publicBaseOverride) {
            try {
              const u = new URL(publicThumbUrl);
              const b = new URL(publicBaseOverride);
              u.protocol = b.protocol;
              u.hostname = b.hostname;
              if (b.port && b.port.length > 0) {
                u.port = b.port;
              } else {
                try {
                  const envBase = new URL(supabaseUrl);
                  if (envBase.port) u.port = envBase.port;
                } catch (_) {
                  // ignore override errors
                }
              }
              publicThumbUrl = u.toString();
            } catch (_) {
              // ignore overrides
            }
          }
          guideThumbnailUrl = publicThumbUrl;
        } catch (e) {
          console.log(
            "Thumbnail generation failed:",
            (e as any)?.message ?? e,
          );
        }
      }

      for (let i = 0; i < content.steps.length; i++) {
        const step = content.steps[i];
        try {
          const prompt = generatePrompt(step);
          const bytes = await generateImage(prompt);
          const path = `guide-images/${sessionId}/step-${step.step}.png`;
          const blob = new Blob([bytes], { type: "image/png" });
          const { error: upErr } = await supabaseServiceClient
            .storage
            .from("guide-images")
            .upload(path.replace(/^guide-images\//, ""), blob, {
              contentType: "image/png",
              upsert: true,
            });
          if (upErr) throw upErr;
          const { data: pub } = supabaseServiceClient
            .storage
            .from("guide-images")
            .getPublicUrl(path.replace(/^guide-images\//, ""));
          let publicUrl = pub.publicUrl as string;
          if (publicBaseOverride) {
            try {
              const u = new URL(publicUrl);
              const b = new URL(publicBaseOverride);
              // Replace origin (protocol + host + port)
              u.protocol = b.protocol;
              u.hostname = b.hostname;
              // If override has an explicit port, use it; otherwise, try to keep a sensible port
              if (b.port && b.port.length > 0) {
                u.port = b.port;
              } else {
                try {
                  const envBase = new URL(supabaseUrl);
                  if (envBase.port) u.port = envBase.port;
                } catch (_) {
                  // leave as-is (may default to 80/443)
                }
              }
              publicUrl = u.toString();
            } catch (_) {
              // ignore override errors
            }
          }
          content.steps[i] = {
            ...step,
            image_url: publicUrl,
            image_prompt: prompt,
          };
        } catch (e) {
          console.log(
            "Step image generation failed:",
            (e as any)?.message ?? e,
          );
        }
      }
    }

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
      .insert([
        {
          title: content.title,
          content: content.content,
          steps: content.steps,
          tools: content.tools,
          materials: content.materials,
          created_by: "AI",
          tips: content.tips,
          thumbnail_prompt: content.thumbnail_prompt,
          thumbnail_url: guideThumbnailUrl,
        },
      ])
      .select("id, title, content, steps, tips, thumbnail_url, thumbnail_prompt")
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
    return new Response(JSON.stringify({ error: (error as any).message }), {
      status: (error as any).message === "Unauthorized" ? 401 : 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
