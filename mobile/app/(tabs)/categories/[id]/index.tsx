import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabaseClient";
import GuideListItem from "@/components/GuideListItem";
import Loading from "@/components/Loading";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { Card } from "@/components/Card";

interface Guide {
  id: string;
  title: string;
  steps: number;
}

export default function CategoryGuidesScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guide_tags")
        .select(`
          guides!inner (
            id,
            title,
            steps
          )
        `)
        .eq("tag_id", id);

      if (error) throw error;

      const formattedGuides: Guide[] = data?.map((item: any) => ({
        id: item.guides.id.toString(),
        title: item.guides.title,
        steps: Array.isArray(item.guides.steps) ? item.guides.steps.length : 0,
      })) || [];

      setGuides(formattedGuides);
    } catch (error: any) {
      console.error("Error fetching guides:", error.message);
      Alert.alert("Error", "Failed to load guides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGuides();
    }
  }, [id]);

  const onRefresh = async () => {
    await fetchGuides();
  };

  const handleGuidePress = (guide: Guide) => {
    router.push({
      pathname: "/[guide]/guide",
      params: { guide: guide.id },
    });
  };

  if (loading && guides.length === 0) {
    return <Loading />;
  }

  return (

    <ScrollView
      style={{ paddingTop: insets.top }}
      contentContainerStyle={
        styles.scrollView
      }

      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <Card>
        {guides.map((guide) => (
          <GuideListItem
            key={guide.id}
            title={guide.title}
            steps={guide.steps}
            onPress={() => handleGuidePress(guide)}
          />
        ))}
      </Card>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48, // Custom top padding
  },
});
