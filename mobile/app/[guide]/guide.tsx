import React, { Suspense, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, useColorScheme, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabaseClient";

import Colors from "@/constants/Colors";
import Loading from "@/components/Loading";
import GuideHeader from "@/components/GuideHeader";
import GuideStep from "@/components/GuideStep";
import ResourceSection from "@/components/ResourceSection";
import Typography from "@/components/Typography";
import { getDefaultStackOptions } from "@/utils/navigationOptions";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";



export default function GuidePage() {
  const { guide } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [info, setInfo] = useState<any>(null);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("guides")
        .select("*, guide_tags!inner(*, tags!inner(*))")
        .eq("id", guide)
        .single();

      console.log(data);


      setInfo(data);
      setError(error);
      setLoading(false);
    };
    func();
  }, []);


  const headerOptions = useMemo(
    () => getDefaultStackOptions(colorScheme),
    [colorScheme]
  );

  const fixImageUrl = (uri: string | undefined | null) => {
    if (!uri) return uri;
    try {
      const u = new URL(uri);
      // Replace internal hosts like 'kong' with our public base
      const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!base) return uri;
      const b = new URL(base);
      // If uri host is different from base or missing expected port, align origin
      if (u.hostname !== b.hostname || (b.port && u.port !== b.port)) {
        u.protocol = b.protocol;
        u.hostname = b.hostname;
        u.port = b.port; // may be empty for 80/443, which is fine for HTTPS in prod
        return u.toString();
      }
      return uri;
    } catch {
      return uri;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !info) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Typography variant="body" color={Colors[colorScheme ?? "light"].text}>
          {error ? "Error loading guide" : "Guide not found"}
        </Typography>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen options={headerOptions} />
      <Suspense fallback={<Loading />}>
        <SafeAreaView style={styles.container}>
          <ScrollView style={{ paddingTop: insets.top }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Guide Header */}
            <View style={styles.section}>
              <GuideHeader
                title={info.title || "Guide Title"}
                description={info.content || "Guide description"}
                categories={info.guide_tags.tags}
              />

              {/* Materials and Tools Sections */}
              {(info.tools.length > 0 || info.materials.length > 0) && (
                <View style={styles.resourcesContainer}>
                  {info.materials.length > 0 && (
                    <ResourceSection
                      title="Materials"
                      items={info.materials || []}
                    />
                  )}
                  {info.tools.length > 0 && (
                    <ResourceSection
                      title="Tools"
                      items={info.tools || []}
                    />
                  )}
                </View>
              )}
            </View>

            {/* Steps Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Typography
                  variant="h5"
                  weight="semiBold"
                  color={Colors[colorScheme ?? "light"].text}
                >
                  Steps
                </Typography>
              </View>

              <View style={styles.stepsContainer}>
                {info.steps?.map((step: any, index: number) => (
                  <GuideStep
                    key={step.step || index}
                    stepNumber={step.step || index + 1}
                    title={step.title || "Title of the step"}
                    description={step.description || "Step description"}
                    imageUrl={fixImageUrl(step.image_url)}
                    materials={step.materials || []}
                    tools={step.tools || []}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

        </SafeAreaView>
      </Suspense>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
  },
  stepsContainer: {
    gap: 24,
    paddingHorizontal: 16,
  },
  resourcesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
});