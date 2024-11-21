import { supabase } from "../../../utils/supabaseClient";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Guides, GuideTags } from "@/types/custom";
import { useEffect, useState } from "react";
import { Tags } from "@/types/custom";
import SuggestionCard from "@/components/SuggestionCard";
import { Json } from "@/types/supabase";
import CategorySuggestionCard from "@/components/CategorySuggestionCard";

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
        setTags(data as unknown as TagsType[]);
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
          <Text style={styles.title}>Search results</Text>
          {tags.map((tag: TagsType) => {
            return (
              <View key={tag.id} style={styles.tagContainer}>
                <Text style={styles.tagTitle}>{tag.name}</Text>
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
  flatlistContent: { gap: 12 },
  tagContainer: { gap: 12 },
  title: {
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: "bold",
    color: "#303030",
  },
  container: {
    gap: 24,
  },
  tagTitle: {
    paddingHorizontal: 24,
    fontSize: 14,
    fontWeight: "600",
    color: "#5f5f5f",
    textTransform: "capitalize",
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
