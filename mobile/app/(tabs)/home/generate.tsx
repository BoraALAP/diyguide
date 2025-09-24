// app/generate.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, useColorScheme, ActivityIndicator, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import * as Crypto from "expo-crypto";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useSupabase } from "@/utils/SupabaseProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { RealtimeChannel } from "@supabase/supabase-js";

import Colors from "@/constants/Colors";
import GuideHeader from "@/components/GuideHeader";
import GuideStep from "@/components/GuideStep";
import ResourceSection from "@/components/ResourceSection";
import Typography from "@/components/Typography";
import { ScrollPageContainer } from "@/components/ScrollPageContainer";


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

  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const { removeToken, profile } = useSupabase();

  const [navigated, setNavigated] = useState(false);
  const [guideId, setGuideId] = useState<number | null>(null);
  const [stepImages, setStepImages] = useState<Record<number, string>>({});
  const sessionIdRef = useRef(Crypto.randomUUID());
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasSubscribedRef = useRef(false);

  const updateStepImages = useCallback((incoming: any[] | undefined) => {
    if (!Array.isArray(incoming) || incoming.length === 0) return;

    setStepImages((prev) => {
      let changed = false;
      const next = { ...prev };

      incoming.forEach((step, index) => {
        const key = step?.step ?? index + 1;
        const imageUrl = step?.image_url;
        if (imageUrl && next[key] !== imageUrl) {
          next[key] = imageUrl;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, []);

  // Redirect users without tokens to the paywall and prevent generation.
  useEffect(() => {
    if (!profile || (profile.tokens ?? 0) <= 0) {
      router.replace("/profile/paywall");
    }
  }, [profile]);

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

      if (id) {
        setGuideId(id);
        const { data: savedGuide } = await supabase
          .from("guides")
          .select("steps")
          .eq("id", id)
          .maybeSingle();

        updateStepImages(savedGuide?.steps);
      }

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

  // Whenever the topic changes, reset local state and close any existing subscription.
  useEffect(() => {
    setGuideId(null);
    setStepImages({});
    setNavigated(false);
    hasSubscribedRef.current = false;
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [topic]);

  // Subscribe to realtime updates for the generated guide so images apply in-place.
  useEffect(() => {
    if (!guideId || hasSubscribedRef.current) return;

    const channel = supabase
      .channel(`guide-${guideId}-updates`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "guides",
          filter: `id=eq.${guideId}`,
        },
        (payload) => {
          updateStepImages((payload.new as any)?.steps);
        }
      )
      .subscribe();

    hasSubscribedRef.current = true;
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
      hasSubscribedRef.current = false;
    };
  }, [guideId, updateStepImages]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      hasSubscribedRef.current = false;
    };
  }, []);

  // Start generation when we have both topic and headers
  useEffect(() => {
    const q = (topic ?? "").trim();
    if (!q || !authHeader) return;
    if (!profile || (profile.tokens ?? 0) <= 0) return;
    submit({ query: q, sessionId: sessionIdRef.current } as any);
  }, [topic, authHeader, profile]);

  // Format tags for GuideHeader categories
  const categories = object?.tags?.filter((tag): tag is string => !!tag).map((tag: string) => ({
    name: tag,
    color: colors.tint,
  })) || [];

  const streamingSteps = object?.steps ?? [];
  const awaitingImages = streamingSteps.some((step: any, index: number) => {
    const key = step?.step ?? index + 1;
    return !(step?.image_url || stepImages[key]);
  });

  const GenerationNotice = () => (
    <View
      style={[
        styles.noticeCard,
        { backgroundColor: colors.cardBackground },
      ]}
    >
      <Typography variant="body" color={colors.secondaryText}>
        It might take a few minutes to generate everything completely.
      </Typography>
    </View>
  );

  if (!object && !error) {
    return (
      <View
        style={[
          styles.loadingContainer
        ]}
      >
        <GenerationNotice />
        <ActivityIndicator size="large" color={colors.tint} />
        <Typography variant="body" color={colors.secondaryText}>
          Generating You Guide...
        </Typography>
      </View>
    );
  }

  return (
    <ScrollPageContainer header>
      <GenerationNotice />
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
      {streamingSteps.length > 0 && (
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
            {streamingSteps.map((step: any, index: number) => {
              const key = step?.step ?? index + 1;
              const imageUrl = step?.image_url ?? stepImages[key];

              return (
                <GuideStep
                  key={`step-${key}`}
                  stepNumber={step.step || index + 1}
                  title={`Step ${step.step || index + 1}`}
                  description={step.description || "Loading step..."}
                  imageUrl={imageUrl}
                  loadingImage={!imageUrl && awaitingImages}
                  materials={step.materials || []}
                  tools={step.tools || []}
                />
              );
            })}
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
    </ScrollPageContainer>
  );
}

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,

  },
  noticeCard: {
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
