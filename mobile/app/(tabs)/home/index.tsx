import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";




import { supabase } from "@/lib/supabaseClient";
import GuideSection from "@/components/GuideSection";
import Loading from "@/components/Loading";
import SearchField from "@/components/SearchField";

import { useSupabase } from "@/utils/SupabaseProvider";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

interface Guide {
  id: string;
  name: string;
  category?: string;
  tags?: { name: string; hex?: string }[];
  steps: number;
  selected?: boolean;
  colorIndicator?: string;
}

export default function HomeScreen() {
  const { profile } = useSupabase();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [loading, setLoading] = useState(false);
  const [latestGuides, setLatestGuides] = useState<Guide[]>([]);
  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const insets = useSafeAreaInsets();



  const fetchLatestGuides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guides")
        .select("id, title, steps, guide_tags(tags(id,name,hex_code))")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedGuides: Guide[] = (data ?? []).map((guide: any, index: number) => {
        const tagsArr = Array.isArray(guide?.guide_tags)
          ? guide.guide_tags
            .map((gt: any) => gt?.tags)
            .filter(Boolean)
            .map((t: any) => ({
              name: String(t.name),
              hex: t.hex_code ? `#${String(t.hex_code).replace(/^#/, "")}` : undefined,
            }))
          : [];
        const firstTag = tagsArr[0] || null;
        const category = firstTag?.name || undefined;
        const hex = firstTag?.hex;
        return {
          id: String(guide.id),
          name: String(guide.title),
          category,
          tags: tagsArr,
          steps: Array.isArray(guide.steps) ? guide.steps.length : 0,
          selected: index < 6,
          colorIndicator: hex,
        } as Guide;
      });

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
        .select("id, title, steps, guide_tags(tags(id,name,hex_code))")
        .order("title", { ascending: true })
        .range(10, 25); // Skip first 10, get next 16

      if (error) throw error;

      const formattedGuides: Guide[] = (data ?? []).map((guide: any) => {
        const tagsArr = Array.isArray(guide?.guide_tags)
          ? guide.guide_tags
            .map((gt: any) => gt?.tags)
            .filter(Boolean)
            .map((t: any) => ({
              name: String(t.name),
              hex: t.hex_code ? `#${String(t.hex_code).replace(/^#/, "")}` : undefined,
            }))
          : [];
        const firstTag = tagsArr[0] || null;
        const category = firstTag?.name || undefined;
        const hex = firstTag?.hex;
        return {
          id: String(guide.id),
          name: String(guide.title),
          category,
          tags: tagsArr,
          steps: Array.isArray(guide.steps) ? guide.steps.length : 0,
          colorIndicator: hex,
        } as Guide;
      });

      setAllGuides(formattedGuides);
    } catch (error: any) {
      console.error("Error fetching all guides:", error.message);
    }
  };

  // Colors are now read from the first associated tag's hex_code

  useEffect(() => {
    fetchLatestGuides();
    fetchAllGuides();
  }, []);

  const onRefresh = async () => {
    await Promise.all([fetchLatestGuides(), fetchAllGuides()]);
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleGenerate = (text?: string) => {
    const query = (text ?? searchQuery).trim();
    if (query) {
      router.push({ pathname: "/home/generate", params: { topic: query } });
    } else {
      router.push("/home/generate");
    }
  };

  const filteredLatestGuides = searchQuery
    ? latestGuides.filter(guide =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : latestGuides;

  const filteredAllGuides = searchQuery
    ? allGuides.filter(guide =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : allGuides;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    // keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView

          contentContainerStyle={[
            styles.scrollView,
            { paddingBottom: insets.bottom } // Account for search bar height + safe area
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          <GuideSection
            title="Latest Guides"
            subtitle="Previously generated guides by other users."
            guides={filteredLatestGuides}
            onGuidePress={handleGuidePress}
          />
          {/* {filteredAllGuides.length > 0 && (
            <GuideSection
              title="All Guides"
              subtitle="Browse through all available guides."
              guides={filteredAllGuides}
              onGuidePress={handleGuidePress}
            />
          )} */}
        </ScrollView>

        <View style={[
          styles.searchBarContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          }
        ]}>
          <SearchField
            value={searchQuery}
            onChangeText={handleSearch}
            onSearch={handleSearch}
            onGenerate={handleGenerate}
            placeholder="Search or Generate"
            showGenerateButton={true}

          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

});
