import { supabase } from "../../../lib/supabaseClient";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

import { useEffect, useState } from "react";
import { Tags } from "@/types/custom";
import { Json } from "@/types/supabase";
import CategorySuggestionCard from "@/components/CategorySuggestionCard";
import { PageTitle, SecondaryText, TextT, ViewT } from "@/components/Themed";
import { router } from "expo-router";

import { InlineButton } from "@/components/Button";
import Loading from "@/components/Loading";

type TagsType = Tags & {
  guide_tags: GuideTagsWithGuides[];
};

type GuideTagsWithGuides = {
  created_at: string;
  guide_id: string | null;
  id: string;
  tag_id: string | null;
  guides: {
    content: string;
    created_at: string | null;
    created_by: string | null;
    id: string;
    materials: string[] | null;
    steps: Json[] | null;
    tips: string[] | null;
    title: string;
    tools: string[] | null;
  };
};

export default function CategoriesScreen() {
  const [tags, setTags] = useState<TagsType[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tags")
        .select(
          `
          *,
          guide_tags!inner (
            *,
            guides!inner (
              id,
              title,
              steps
            )
          )
        `
        )
        .order("name", { ascending: true });
      if (error) {
        setError(error);
      }
      if (data) {
        setTags(data);
      }
      setLoading(false);
    };
    func();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ViewT style={styles.container}>
        <PageTitle style={styles.title}>Categories</PageTitle>

        {tags.map((tag: TagsType) => {
          function capitalizeWords(name: string): string {
            return name.replace(/\b\w/g, (char) => char.toUpperCase());
          }

          return (
            <View key={tag.id} style={styles.tagContainer}>
              <View style={styles.tagHeader}>
                <SecondaryText style={styles.tagTitle}>
                  {capitalizeWords(tag.name)}
                </SecondaryText>
                {tag.guide_tags.length > 4 && (
                  <InlineButton
                    title="View All"
                    onPress={() =>
                      router.push({
                        pathname: "/categories/[id]",
                        params: {
                          id: tag.id,
                          title: capitalizeWords(tag.name),
                        },
                      })
                    }
                  />
                )}
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatlistContent}
                data={tag.guide_tags.slice(0, 4) as GuideTagsWithGuides[]}
                keyExtractor={(item) => item.guide_id!.toString()}
                renderItem={({ item }) => (
                  <CategorySuggestionCard guide={item.guides} />
                )}
              />
            </View>
          );
        })}
      </ViewT>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: { gap: 16 },

  content: { paddingTop: 88, paddingBottom: 32 },

  flatlistContent: { marginTop: 8, marginBottom: 4, paddingHorizontal: 8 },
  tagContainer: { gap: 4 },

  container: {
    gap: 24,
  },
  title: {
    paddingHorizontal: 24,
  },
  tagHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  tagTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
