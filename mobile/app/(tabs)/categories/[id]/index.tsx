import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabaseClient";
import { Guides } from "@/types/custom";
import SuggestionCard from "@/components/SuggestionCard";
import { PageTitle, TextT } from "@/components/Themed";
import Loading from "@/components/Loading";

export default function CategoryGuidesScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState<Partial<Guides>[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tags")
        .select("name, guide_tags( guides(id,title,steps))")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setError(error);
      } else {
        const list = data.guide_tags.map((item) => {
          return item.guides;
        });

        setGuides(list as Partial<Guides>[]);
      }
      setLoading(false);
    };

    if (id) {
      fetchGuides();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.pageCenter}>
        <TextT>Something went wrong</TextT>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <SuggestionCard guide={item} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
  },
  content: {
    gap: 16,
    paddingTop: 120,
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
});
