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
import Loading from "@/components/Loading";
import SearchField from "@/components/SearchField";
import GuideThumbnailCard from "@/components/GuideThumbnailCard";
import Typography from "@/components/Typography";

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
  colorIndicator?: string;
  thumbnailUrl?: string;
  thumbnailPrompt?: string;
}

const normalizeSupabaseUrl = (uri?: string | null) => {
  if (!uri) return undefined;
  try {
    const parsed = new URL(uri);
    const publicBase = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (publicBase) {
      const base = new URL(publicBase);
      if (
        parsed.hostname !== base.hostname ||
        (base.port && parsed.port !== base.port)
      ) {
        parsed.protocol = base.protocol;
        parsed.hostname = base.hostname;
        parsed.port = base.port;
        return parsed.toString();
      }
    }
    return uri;
  } catch {
    return uri;
  }
};

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
        .select(
          "id, title, steps, thumbnail_url, thumbnail_prompt, guide_tags(tags(id,name,hex_code))",
        )
        .order("created_at", { ascending: false })
        .limit(10);

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
          thumbnailUrl: normalizeSupabaseUrl(guide.thumbnail_url),
          thumbnailPrompt: typeof guide.thumbnail_prompt === "string"
            ? guide.thumbnail_prompt
            : undefined,
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
        .select(
          "id, title, steps, thumbnail_url, thumbnail_prompt, guide_tags(tags(id,name,hex_code))",
        )
        .order("title", { ascending: true })
        .range(10, 25);

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
          thumbnailUrl: normalizeSupabaseUrl(guide.thumbnail_url),
          thumbnailPrompt: typeof guide.thumbnail_prompt === "string"
            ? guide.thumbnail_prompt
            : undefined,
        } as Guide;
      });

      setAllGuides(formattedGuides);
    } catch (error: any) {
      console.error("Error fetching all guides:", error.message);
    }
  };

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
    if (!profile || (profile.tokens ?? 0) <= 0) {
      router.push("/profile/paywall");
      return;
    }

    const query = (text ?? searchQuery).trim();
    if (query) {
      router.push({ pathname: "/home/generate", params: { topic: query } });
    } else {
      router.push("/home/generate");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLatestGuides = normalizedQuery
    ? latestGuides.filter((guide) =>
        guide.name.toLowerCase().includes(normalizedQuery) ||
        guide.category?.toLowerCase().includes(normalizedQuery) ||
        guide.tags?.some((tag) => tag.name.toLowerCase().includes(normalizedQuery)),
      )
    : latestGuides;

  const filteredAllGuides = normalizedQuery
    ? allGuides.filter((guide) =>
        guide.name.toLowerCase().includes(normalizedQuery) ||
        guide.category?.toLowerCase().includes(normalizedQuery) ||
        guide.tags?.some((tag) => tag.name.toLowerCase().includes(normalizedQuery)),
      )
    : allGuides;

  const hasSearch = normalizedQuery.length > 0;

  const featuredPool = hasSearch ? [] : filteredLatestGuides.slice(0, 4);
  const todaysPick = featuredPool[0];
  const featuredCarousel = todaysPick ? featuredPool.slice(1) : featuredPool;

  const excludedIds = new Set(featuredPool.map((guide) => guide.id));
  const popularGuides: Guide[] = [];
  if (!hasSearch) {
    const seen = new Set<string>();
    const addGuide = (guide: Guide) => {
      if (excludedIds.has(guide.id) || seen.has(guide.id)) return;
      seen.add(guide.id);
      popularGuides.push(guide);
    };

    filteredLatestGuides.slice(featuredPool.length).forEach(addGuide);
    filteredAllGuides.forEach(addGuide);
  }

  const searchResults = hasSearch
    ? Array.from(
        new Map(
          [...filteredLatestGuides, ...filteredAllGuides].map((guide) => [
            guide.id,
            guide,
          ]),
        ).values(),
      )
    : [];

  const noGuidesAvailable =
    !hasSearch && !loading && featuredPool.length === 0 && popularGuides.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollView,
            {
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 160,
            },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          {!hasSearch && (
            <>
              <View
                style={[
                  styles.heroContainer,
                  { backgroundColor: colors.sectionBackground },
                ]}
              >
                <View style={styles.heroText}>
                  <Typography
                    variant="h3"
                    weight="semiBold"
                    color={colors.text}
                  >
                    DIY Inspiration
                  </Typography>
                  <Typography
                    variant="body"
                    color={colors.secondaryText}
                  >
                    Explore fresh ideas, curated highlights, and guides hand-picked for makers like you.
                  </Typography>
                </View>

                {todaysPick && (
                  <View style={styles.heroCardWrapper}>
                    <GuideThumbnailCard
                      variant="featured"
                      title={todaysPick.name}
                      steps={todaysPick.steps}
                      tags={todaysPick.tags}
                      category={todaysPick.category}
                      thumbnailUrl={todaysPick.thumbnailUrl}
                      colorIndicator={todaysPick.colorIndicator}
                      onPress={() => handleGuidePress(todaysPick)}
                      style={styles.heroCard}
                    />
                    <Typography
                      variant="caption"
                      color={colors.secondaryText}
                      style={styles.heroBadge}
                    >
                      Today's Pick
                    </Typography>
                  </View>
                )}
              </View>

              {featuredCarousel.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Typography
                      variant="h4"
                      weight="semiBold"
                      color={colors.text}
                    >
                      Featured Projects
                    </Typography>
                    <Typography
                      variant="body"
                      color={colors.secondaryText}
                    >
                      Fresh builds and creative ideas generated by the community.
                    </Typography>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredList}
                  >
                    {featuredCarousel.map((guide, index) => (
                      <View
                        key={guide.id}
                        style={[
                          styles.featuredCardContainer,
                          index === featuredCarousel.length - 1
                            ? { marginRight: 0 }
                            : null,
                        ]}
                      >
                        <GuideThumbnailCard
                          variant="featured"
                          title={guide.name}
                          steps={guide.steps}
                          tags={guide.tags}
                          category={guide.category}
                          thumbnailUrl={guide.thumbnailUrl}
                          colorIndicator={guide.colorIndicator}
                          onPress={() => handleGuidePress(guide)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {popularGuides.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Typography
                      variant="h4"
                      weight="semiBold"
                      color={colors.text}
                    >
                      Popular Guides
                    </Typography>
                    <Typography
                      variant="body"
                      color={colors.secondaryText}
                    >
                      Tried-and-true builds other DIYers are exploring.
                    </Typography>
                  </View>
                  <View style={styles.gridList}>
                    {popularGuides.map((guide) => (
                      <View key={guide.id} style={styles.gridItem}>
                        <GuideThumbnailCard
                          variant="grid"
                          title={guide.name}
                          steps={guide.steps}
                          tags={guide.tags}
                          category={guide.category}
                          thumbnailUrl={guide.thumbnailUrl}
                          colorIndicator={guide.colorIndicator}
                          onPress={() => handleGuidePress(guide)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {noGuidesAvailable && (
                <View style={styles.section}>
                  <Typography
                    variant="body"
                    color={colors.secondaryText}
                    style={styles.emptyState}
                  >
                    No guides have been generated yet. Use the search bar below to create the first one!
                  </Typography>
                </View>
              )}
            </>
          )}

          {hasSearch && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Typography
                  variant="h4"
                  weight="semiBold"
                  color={colors.text}
                >
                  Search Results
                </Typography>
                <Typography
                  variant="body"
                  color={colors.secondaryText}
                >
                  {searchResults.length > 0
                    ? `Showing ${searchResults.length} guide${searchResults.length === 1 ? "" : "s"} for "${searchQuery.trim()}"`
                    : `No guides match "${searchQuery.trim()}" yet.`}
                </Typography>
              </View>

              {searchResults.length > 0 ? (
                <View style={styles.gridList}>
                  {searchResults.map((guide) => (
                    <View key={guide.id} style={styles.gridItem}>
                      <GuideThumbnailCard
                        variant="grid"
                        title={guide.name}
                        steps={guide.steps}
                        tags={guide.tags}
                        category={guide.category}
                        thumbnailUrl={guide.thumbnailUrl}
                        colorIndicator={guide.colorIndicator}
                        onPress={() => handleGuidePress(guide)}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <Typography
                  variant="body"
                  color={colors.secondaryText}
                  style={styles.emptyState}
                >
                  Try adjusting your keywords or tap Generate to craft a brand-new guide.
                </Typography>
              )}
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
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
  heroContainer: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  heroText: {
    flex: 1,
    minWidth: 220,
    gap: 12,
  },
  heroCardWrapper: {
    alignItems: "flex-end",
    gap: 8,
    minWidth: 200,
  },
  heroCard: {
    width: 220,
  },
  heroBadge: {
    paddingHorizontal: 8,
  },
  section: {
    marginTop: 32,
    gap: 16,
  },
  sectionHeader: {
    gap: 6,
  },
  featuredList: {
    paddingRight: 4,
  },
  featuredCardContainer: {
    marginRight: 16,
  },
  gridList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  emptyState: {
    textAlign: "center",
  },
  searchBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
