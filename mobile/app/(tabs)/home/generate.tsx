// app/generate.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Button, useColorScheme, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import * as Crypto from "expo-crypto";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useSupabase } from "@/utils/SupabaseProvider";
import { PageTitle, TextT, SecondaryText } from "@/components/Themed";
import Colors from "@/constants/Colors";


// helper: allow "", null, undefined; only validate when non-empty
const UrlField = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().url().optional()
);

const StepSchema = z.object({
  step: z.number(),
  description: z.string(),
  materials: z.array(z.string()),
  tools: z.array(z.string()),
  image_url: UrlField,              // <-- changed
  image_prompt: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().optional()
  ),
});

export const GuideSchema = z.object({
  title: z.string(),
  content: z.string(),
  steps: z.array(StepSchema),
  tools: z.array(z.string()),
  materials: z.array(z.string()),
  tags: z.array(z.string()),
  tips: z.array(z.string()),
});

function edgeUrl(fn: string) {
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")}/functions/v1/${fn}`;
}

async function waitForSavedId(sessionId: string, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { data, error } = await supabase
      .from("guides")
      .select("id")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!error && data?.id) return data.id as number;
    await new Promise((r) => setTimeout(r, 800));
  }
  return null;
}

export default function GenerateScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const { removeToken } = useSupabase();

  const [navigated, setNavigated] = useState(false);
  const sessionIdRef = useRef(Crypto.randomUUID());
  const [authHeader, setAuthHeader] = useState<string | null>(null);

  // Get the user's access token so the Edge Function can apply RLS as the user.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token;
      setAuthHeader(
        token
          ? `Bearer ${token}`
          : `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}` // fallback
      );
    });
  }, []);

  const { object, isLoading, error, submit, stop } = useObject({
    api: edgeUrl("generate-guide"), // 👈 your function name
    schema: GuideSchema,
    fetch: expoFetch as any, // streaming on device
    headers: {
      "Content-Type": "application/json",
      // Both headers are fine; Authorization is what the Edge Function reads.
      Authorization: authHeader ?? "",
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    },
    onFinish: async () => {
      // After streaming completes, the function inserts the row.
      const id = await waitForSavedId(sessionIdRef.current);
      if (id && !navigated) {
        setNavigated(true);
        await removeToken().catch(() => { });
      }
    },
  });

  // Start generation when we have both topic and headers
  useEffect(() => {
    const q = (topic ?? "").trim();
    if (!q || !authHeader) return;
    submit({ query: q, sessionId: sessionIdRef.current } as any);
  }, [topic, authHeader]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <PageTitle>Generating your guide…</PageTitle>
        {!!topic && <SecondaryText>Topic: “{topic}”</SecondaryText>}
        <View style={styles.actions}>
          {isLoading ? (
            <Button title="Stop" onPress={stop} />
          ) : (
            <Button title="Close" onPress={() => router.back()} />
          )}
        </View>
      </View>

      {!object && (
        <View style={styles.center}>
          <ActivityIndicator />
          <SecondaryText>Thinking…</SecondaryText>
        </View>
      )}

      {!!object && (
        <View style={styles.section}>
          <TextT style={styles.title}>{object.title || "…"}</TextT>
          <TextT style={styles.description}>{object.content || "…"}</TextT>

          {!!object.materials?.length && (
            <View style={styles.block}>
              <TextT style={styles.subTitle}>Materials</TextT>
              {object.materials.map((m, i) => (
                <SecondaryText key={`${m}-${i}`}>{m}</SecondaryText>
              ))}
            </View>
          )}

          {!!object.tools?.length && (
            <View style={styles.block}>
              <TextT style={styles.subTitle}>Tools</TextT>
              {object.tools.map((t, i) => (
                <SecondaryText key={`${t}-${i}`}>{t}</SecondaryText>
              ))}
            </View>
          )}

          {!!object.steps?.length && (
            <View style={styles.block}>
              <TextT style={styles.subTitle}>Steps</TextT>
              {object.steps.map((s, i) => (
                <View key={`step-${i}`} style={styles.step}>
                  <TextT style={styles.stepNumber}>{s?.step ?? i + 1}.</TextT>
                  <TextT style={styles.stepTitle}>{s?.description ?? "…"}</TextT>
                </View>
              ))}
            </View>
          )}

          {!!object.tips?.length && (
            <View style={styles.block}>
              <TextT style={styles.subTitle}>Tips</TextT>
              {object.tips.map((tip, i) => (
                <SecondaryText key={`${tip}-${i}`}>{tip}</SecondaryText>
              ))}
            </View>
          )}
        </View>
      )}

      {!!error && (
        <View style={styles.center}>
          <SecondaryText>Oops: {String(error)}</SecondaryText>
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (mode: "light" | "dark") =>
  StyleSheet.create({
    container: { rowGap: 16, paddingBottom: 60 },
    header: { rowGap: 8, padding: 24, paddingTop: 24, backgroundColor: Colors[mode].sectionBackground },
    actions: { flexDirection: "row", gap: 8, marginTop: 8 },
    center: { alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
    section: { rowGap: 12, paddingHorizontal: 24 },
    title: { fontSize: 20, fontWeight: "bold" },
    description: { fontSize: 16 },
    subTitle: { fontSize: 18, fontWeight: "bold" },
    block: { rowGap: 6, marginTop: 8 },
    step: { rowGap: 6, paddingVertical: 8, flexDirection: "row", gap: 8, alignItems: "flex-start" },
    stepNumber: { fontSize: 14, fontWeight: "bold" },
    stepTitle: { fontSize: 16, fontWeight: "bold", flex: 1 },
  });
