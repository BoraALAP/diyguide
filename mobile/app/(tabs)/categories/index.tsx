import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  useColorScheme
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabaseClient";
import CategoryItem from "@/components/CategoryItem";

import Loading from "@/components/Loading";
import Colors from "@/constants/Colors";
import { PageTitle } from "@/components/PageTitle";
import { Card } from "@/components/Card";
import { ScrollPageContainer } from "@/components/ScrollPageContainer";

interface Category {
  id: string;
  name: string;
  colorIndicator: string;
  guideCount: number;
}

export default function CategoriesScreen() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];


  const fetchCategories = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from("tags")
        .select(`
          id,
          name,
          hex_code,
          guide_tags!inner (
            guides!inner (id)
          )
        `)
        .order("name", { ascending: true });

      if (error) throw error;

      const formattedCategories: Category[] = data?.map((tag: any, index: number) => ({
        id: tag.id.toString(),
        name: capitalizeWords(tag.name),
        colorIndicator: `#${String(tag.hex_code).replace(/^#/, "")}`,
        guideCount: tag.guide_tags?.length || 0,
      })) || [];

      setCategories(formattedCategories);
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const capitalizeWords = (name: string): string => {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = async () => {
    await fetchCategories();
  };

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: "/categories/[id]",
      params: {
        id: category.id,
        title: category.name,
      },
    });
  };

  if (loading && categories.length === 0) {
    return <Loading />;
  }

  return (
    <ScrollPageContainer onRefresh={handleRefresh} >

      {/* Page Title */}
      <PageTitle title="Categories" description="Previously generated guides by other users." />

      {/* Categories List */}
      <Card>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            categoryName={category.name}
            colorIndicator={category.colorIndicator}
            onPress={() => handleCategoryPress(category)}
          />
        ))}
      </Card>
    </ScrollPageContainer>
  );
}


