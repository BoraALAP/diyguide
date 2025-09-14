import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabaseClient";
import GuideSection from "@/components/GuideSection";
import Loading from "@/components/Loading";
import { ViewT } from "@/components/Themed";

import { useSupabase } from "@/utils/SupabaseProvider";

interface Guide {
  id: string;
  name: string;
  // category: string;
  steps: number;
  selected?: boolean;
  colorIndicator?: string;
}

export default function HomeScreen() {
  const { profile } = useSupabase();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [latestGuides, setLatestGuides] = useState<Guide[]>([]);
  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchLatestGuides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guides")
        .select("id, title, steps")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedGuides: Guide[] = data?.map((guide, index) => ({
        id: guide.id.toString(),
        name: guide.title,
        // category: guide.category || "General",
        steps: Array.isArray(guide.steps) ? guide.steps.length : 0,
        selected: index < 6, // First 6 items are "selected" for visual variety
        colorIndicator: getColorIndicator(index),
      })) || [];

      setLatestGuides(formattedGuides);
    } catch (error: any) {
      console.error("Error fetching latest guides:", error.message);
      Alert.alert("Error", "Failed to load latest guides");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGuides = async () => {
    try {
      const { data, error } = await supabase
        .from("guides")
        .select("id, title, steps")
        .order("title", { ascending: true })
        .range(10, 25); // Skip first 10, get next 16

      if (error) throw error;

      const formattedGuides: Guide[] = data?.map((guide) => ({
        id: guide.id.toString(),
        name: guide.title,
        // category: guide.category || "General",
        steps: Array.isArray(guide.steps) ? guide.steps.length : 0,
      })) || [];

      setAllGuides(formattedGuides);
    } catch (error: any) {
      console.error("Error fetching all guides:", error.message);
    }
  };

  const getColorIndicator = (index: number): string => {
    const colors = ["#ff00bb", "#0080ff", "#ffa100", "#cc0055", "#00cc88", "#8800cc"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchLatestGuides();
    fetchAllGuides();
  }, []);

  const onRefresh = async () => {
    await Promise.all([fetchLatestGuides(), fetchAllGuides()]);
  };

  const handleSearch = async (text: string) => {
    setSearchValue(text);
    // For now, just store the search value
    // In a full implementation, you'd search and filter the guides
    console.log("Searching for:", text);
  };



  const handleGenerate = async () => {
    if (!profile) {
      return Alert.alert(
        "Please login first",
        "You need to be logged in to generate a guide",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", style: "default", onPress: () => router.push("/profile") },
        ]
      );
    }
    if (profile?.tokens === 0) {
      return Alert.alert(
        "You don't have enough tokens",
        "You need to buy more tokens to generate a guide",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy tokens", style: "default", onPress: () => router.push("/profile") },
        ]
      );
    }

    router.push({
      pathname: "/home/generate",
      params: { topic: searchValue || "" },
    });
  };

  if (loading && latestGuides.length === 0) {
    return <Loading />;
  }



  const handleGuidePress = (guide: Guide) => {
    router.push({
      pathname: "/[guide]/guide",
      params: { guide: guide.id },
    });
  };

  return (
    <ViewT
      style={[
        styles.container,
        {
          backgroundColor: "#f7f7f7", // BG/Page from Figma
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <ViewT style={styles.content}>
          <GuideSection
            title="Latest Guides"
            subtitle="Previously generated guides by other users."
            guides={latestGuides}
            onGuidePress={handleGuidePress}
          />

          <GuideSection
            title="Guides"
            subtitle="Previously generated guides by other users."
            guides={allGuides}
            onGuidePress={handleGuidePress}
          />
        </ViewT>

        {/* Extra bottom padding for bottom tab bar */}
        <ViewT style={styles.bottomPadding} />
      </ScrollView>

    </ViewT>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
    gap: 32,
  },
  bottomPadding: {
    height: 200, // Space for bottom tab bar + extra scroll space
  },
});
