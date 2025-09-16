// app/generate.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, useColorScheme, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import * as Crypto from "expo-crypto";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useSupabase } from "@/utils/SupabaseProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import GuideHeader from "@/components/GuideHeader";
import GuideStep from "@/components/GuideStep";
import ResourceSection from "@/components/ResourceSection";
import Typography from "@/components/Typography";


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
  const colors = Colors[colorScheme];
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const insets = useSafeAreaInsets();
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
        // Navigate to the generated guide
        // router.replace({
        //   pathname: "/[guide]/guide",
        //   params: { guide: String(id) },
        // });
      }
    },
  });

  // Start generation when we have both topic and headers
  useEffect(() => {
    const q = (topic ?? "").trim();
    if (!q || !authHeader) return;
    submit({ query: q, sessionId: sessionIdRef.current } as any);
  }, [topic, authHeader]);

  // Format tags for GuideHeader categories
  const categories = object?.tags?.filter((tag): tag is string => !!tag).map((tag: string) => ({
    name: tag,
    color: colors.tint,
  })) || [];

  if (!object && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Typography variant="body" color={colors.secondaryText}>
          Generating You Guide...
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Bar with Back/Stop button */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={isLoading ? stop : () => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name={isLoading ? "stop-circle-outline" : "arrow-back"}
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Typography variant="h5" weight="semiBold" color={colors.text}>
          {isLoading ? "Creating Response..." : "Guide Generated"}
        </Typography>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Guide Header Section */}
        {object && (
          <View style={styles.section}>
            <GuideHeader
              title={object.title || "Generating..."}
              description={object.content || "Loading description..."}
              categories={categories}
            />

            {/* Materials and Tools Sections */}
            {((object.tools?.length ?? 0) > 0 || (object.materials?.length ?? 0) > 0) && (
              <View style={styles.resourcesContainer}>
                {(object.materials?.length ?? 0) > 0 && (
                  <ResourceSection
                    title="Materials"
                    items={object.materials?.filter((item): item is string => !!item) ?? []}
                  />
                )}
                {(object.tools?.length ?? 0) > 0 && (
                  <ResourceSection
                    title="Tools"
                    items={object.tools?.filter((item): item is string => !!item) ?? []}
                  />
                )}
              </View>
            )}
          </View>
        )}

        {/* Steps Section */}
        {(object?.steps?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography
                variant="h5"
                weight="semiBold"
                color={colors.text}
              >
                Steps
              </Typography>
            </View>

            <View style={styles.stepsContainer}>
              {object?.steps?.map((step: any, index: number) => (
                <GuideStep
                  key={step.step || index}
                  stepNumber={step.step || index + 1}
                  title={`Step ${step.step || index + 1}`}
                  description={step.description || "Loading step..."}
                  imageUrl={step.image_url}
                  materials={step.materials || []}
                  tools={step.tools || []}
                />
              ))}
            </View>
          </View>
        )}

        {/* Tips Section */}
        {(object?.tips?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography
                variant="h5"
                weight="semiBold"
                color={colors.text}
              >
                Tips
              </Typography>
            </View>
            <View style={styles.tipsContainer}>
              {object?.tips?.filter((tip): tip is string => !!tip).map((tip: string, index: number) => (
                <View key={index} style={styles.tipItem}>
                  <Typography variant="body" color={colors.secondaryText}>
                    • {tip}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Typography variant="body" color={colors.error}>
              {String(error)}
            </Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (mode: "light" | "dark") => {
  const colors = Colors[mode];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pageBackground,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      backgroundColor: colors.pageBackground,
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 4,
    },
    scrollContent: {
      gap: 32,
      paddingBottom: 24,
      paddingTop: 16,
    },
    section: {
      gap: 16,
    },
    sectionHeader: {
      paddingHorizontal: 16,
    },
    resourcesContainer: {
      paddingHorizontal: 16,
      gap: 8,
    },
    stepsContainer: {
      gap: 24,
      paddingHorizontal: 16,
    },
    tipsContainer: {
      paddingHorizontal: 16,
      gap: 8,
    },
    tipItem: {
      paddingVertical: 4,
    },
    errorContainer: {
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: 32,
    },
  });
};