// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "npm:zod";
import { streamObject } from "npm:ai";
import { createOpenAI } from "npm:@ai-sdk/openai";
// Gemini 2.5 Image Gen (official JS SDK)
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.7.0";

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
});
type Guide = z.infer<typeof GuideSchema>;
type Step = z.infer<typeof StepSchema>;

// ENV
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_ORG = Deno.env.get("OPENAI_ORGANIZATION_ID") ?? undefined;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const ENABLE_IMAGE_GEN =
  (Deno.env.get("ENABLE_IMAGE_GEN") ?? "true").toLowerCase() === "true";
const GEMINI_IMAGE_MODEL = Deno.env.get("GEMINI_IMAGE_MODEL") ??
  "gemini-2.5-flash-image-preview";
const PUBLIC_SUPABASE_URL = Deno.env.get("PUBLIC_SUPABASE_URL") ||
  Deno.env.get("EXTERNAL_SUPABASE_URL") || undefined;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Providers
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG,
});
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Helpers
function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function genGeminiPng(prompt: string) {
  const res: any = await genAI.models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const b64 = p?.inlineData?.data || p?.inline_data?.data;
    if (b64) return b64ToBytes(b64);
  }
  throw new Error("Gemini: no inline image data");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const authHeader = req.headers.get("Authorization") ?? ""; // from client
    // User-scoped client for RLS-valid writes
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    // Service client for Storage + trusted patches
    const svc = createClient(SUPABASE_URL, SUPABASE_SERVICE);

    const body = await req.json().catch(() => ({}));
    const query: string = String(body?.query ?? "").trim();
    const sessionId: string = String(body?.sessionId ?? crypto.randomUUID());
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing 'query'." }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Identify user (for created_by)
    const { data: userData } = await supabase.auth.getUser();
    const createdBy = userData?.user?.id ?? null;

    // Tag hinting
    const { data: existingTags = [] } = await supabase.from("tags").select(
      "id,name",
    );
    const tagMap: Record<string, number> = Object.fromEntries(
      (existingTags || []).map((t: any) => [t.name, t.id]),
    );
    const tagHint = Object.keys(tagMap).length
      ? `Use existing tags where applicable: ${Object.keys(tagMap).join(", ")}.`
      : `Create concise, meaningful tags (no "diy").`;

    const result = streamObject({
      model: openai("gpt-5-nano"),
      schemaName: "DIYGuide",
      schema: GuideSchema,
      prompt: [
        "You write high-quality DIY guides. Return strictly JSON that matches the schema.",
        "Title: short, imperative (avoid 'How to').",
        "Each step includes materials (with measurements) and tools.",
        "Also include overall materials & tools, concise tips, and useful tags.",
        "Do NOT include `image_url` keys in steps. Only include `image_prompt` (optional).",
        tagHint,
        "",
        `Topic: ${query}`,
      ].join("\n"),

      // Persist AFTER the stream finishes so the user doesn't wait
      async onFinish({ object, error }) {
        if (!object) {
          console.error("Validation error:", error);
          return;
        }

        try {
          // 1) Upsert new tags
          const newTags = object.tags.filter((t) => !tagMap[t]);
          if (newTags.length) {
            const { data: inserted, error: insErr } = await supabase
              .from("tags")
              .insert(newTags.map((name) => ({ name })))
              .select("id,name");
            if (!insErr) {
              for (const t of inserted ?? []) tagMap[t.name] = t.id;
            } else {
              console.log(
                "Insert tags (RLS) failed, trying with service role:",
                insErr,
              );
              const { data: insertedSrv, error: insSrvErr } = await svc
                .from("tags")
                .insert(newTags.map((name) => ({ name })))
                .select("id,name");
              if (!insSrvErr) {
                for (const t of insertedSrv ?? []) tagMap[t.name] = t.id;
              }
            }
          }

          // 2) Insert the base guide (user-scoped if possible)
          let guideId: number | null = null;
          {
            const { data: saved, error: saveErr } = await supabase
              .from("guides")
              .insert([{
                title: object.title,
                content: object.content,
                steps: object.steps,
                tools: object.tools,
                materials: object.materials,
                tips: object.tips,
                created_by: createdBy,
                session_id: sessionId,
              }])
              .select("id")
              .single();

            if (saveErr) {
              console.log(
                "Insert guide (RLS) failed, retrying with service role:",
                saveErr,
              );
              const { data: savedSrv, error: saveSrvErr } = await svc
                .from("guides")
                .insert([{
                  title: object.title,
                  content: object.content,
                  steps: object.steps,
                  tools: object.tools,
                  materials: object.materials,
                  tips: object.tips,
                  created_by: createdBy,
                  session_id: sessionId,
                }])
                .select("id")
                .single();
              if (saveSrvErr) throw saveSrvErr;
              guideId = savedSrv!.id;
            } else {
              guideId = saved!.id;
            }
          }

          // 3) Link tags
          if (object.tags.length && guideId) {
            const pairs = object.tags
              .filter((t) => tagMap[t])
              .map((t) => ({ guide_id: guideId!, tag_id: tagMap[t] }));
            const { error: linkErr } = await svc.from("guide_tags").insert(
              pairs,
            );
            if (linkErr) console.error("Link tags failed:", linkErr);
          }

          // 4) (Optional) Generate per-step images with Gemini and patch
          if (ENABLE_IMAGE_GEN && guideId) {
            const bucket = svc.storage.from("guide-images");
            const folder = crypto.randomUUID();

            const mkPrompt = (s: Step) =>
              `Create a clear, instructional illustration for this DIY step.
Step: ${s.description}
Materials: ${s.materials?.join(", ") || "none"}
Tools: ${s.tools?.join(", ") || "none"}
Style: clean, minimal, neutral background, high-contrast, no text. Output: PNG.`;

            const updated: Step[] = [];
            for (const s of object.steps) {
              try {
                const bytes = await genGeminiPng(mkPrompt(s));
                const storagePath =
                  `guide-images/${folder}/guide-${guideId}-step-${s.step}.png`
                    .replace(
                      /^guide-images\//,
                      "",
                    );
                const { error: upErr } = await bucket.upload(
                  storagePath,
                  new Blob([bytes], { type: "image/png" }),
                  { upsert: true, contentType: "image/png" },
                );
                if (upErr) throw upErr;

                const { data: pub } = bucket.getPublicUrl(storagePath);
                let url = pub.publicUrl as string;
                if (PUBLIC_SUPABASE_URL) {
                  try {
                    const u = new URL(url), b = new URL(PUBLIC_SUPABASE_URL);
                    u.protocol = b.protocol;
                    u.hostname = b.hostname;
                    if (b.port) u.port = b.port;
                    url = u.toString();
                  } catch {}
                }
                updated.push({
                  ...s,
                  image_url: url,
                  image_prompt: mkPrompt(s),
                });
              } catch (e) {
                console.log(
                  "Image gen/upload failed for step",
                  s.step,
                  (e as any)?.message ?? e,
                );
                updated.push(s);
              }
            }

            const { error: patchErr } = await svc
              .from("guides")
              .update({ steps: updated })
              .eq("id", guideId);
            if (patchErr) {
              console.error("Patch steps with images failed:", patchErr);
            }
          }
        } catch (persistErr) {
          console.error("Persisting failed:", persistErr);
        }
      },
    });

    return result.toTextStreamResponse({
      headers: { ...cors, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: (e as any)?.message ?? String(e) }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      },
    );
  }
});
