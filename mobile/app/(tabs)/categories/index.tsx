import { supabase } from "../../../lib/supabaseClient";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";
import { Tags } from "@/types/custom";
import { Json } from "@/types/supabase";
import CategorySuggestionCard from "@/components/CategorySuggestionCard";
import { PageTitle, SecondaryText, Text, View } from "@/components/Themed";

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
      const { data, error } = await supabase.from("tags").select(`
          *,
          guide_tags!inner (
            *,
            guides!inner (
              id,
              title,
              steps
            )
          )
        `);

      if (error) {
        console.log("error", error);

        setError(error);
      }
      if (data) {
        setTags(
          (data as unknown as TagsType[]).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      }
      setLoading(false);
    };
    func();
  }, []);

  console.log(tags, error);

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={styles.content}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          <PageTitle style={styles.title}>Categories</PageTitle>
          {tags.map((tag: TagsType) => {
            return (
              <View key={tag.id} style={styles.tagContainer}>
                <SecondaryText style={styles.tagTitle}>
                  {tag.name}
                </SecondaryText>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatlistContent}
                  data={tag.guide_tags as GuideTagsWithGuides[]}
                  keyExtractor={(item) => item.guide_id!.toString()}
                  renderItem={({ item }) => (
                    <CategorySuggestionCard guide={item.guides} />
                  )}
                />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  pageContainer: { gap: 16 },
  content: { paddingTop: 88 },

  flatlistContent: { marginTop: 8, marginBottom: 4, paddingHorizontal: 8 },
  tagContainer: { gap: 4 },

  container: {
    gap: 24,
  },
  title: {
    paddingHorizontal: 24,
  },
  tagTitle: {
    paddingHorizontal: 24,
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
