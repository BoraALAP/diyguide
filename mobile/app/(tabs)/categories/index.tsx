import React, { useEffect, useState } from "react";
import { ScrollView, Alert, RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabaseClient";
import CategoryItem from "@/components/CategoryItem";

import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useSupabase } from "@/utils/SupabaseProvider";

interface Category {
  id: string;
  name: string;
  colorIndicator: string;
  guideCount: number;
}

export default function CategoriesScreen() {
  const { profile } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const categoryColors = [
    "#cc0055", // Electronics - Pink
    "#0029cc", // Clothing - Blue
    "#00cc44", // Home & Kitchen - Green
    "#9ccc00", // Beauty & Personal Care - Light Green
    "#7700cc", // Books - Purple
    "#cc9600", // Sports & Outdoors - Orange-Yellow
    "#cc4b00", // Automotive - Orange
    "#cc0000", // Toys & Games - Red
  ];

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tags")
        .select(`
          id,
          name,
          guide_tags!inner (
            guides!inner (id)
          )
        `)
        .order("name", { ascending: true });

      if (error) throw error;

      const formattedCategories: Category[] = data?.map((tag, index) => ({
        id: tag.id.toString(),
        name: capitalizeWords(tag.name),
        colorIndicator: categoryColors[index % categoryColors.length],
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

  const onRefresh = async () => {
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
    <ScrollView
      className="flex-1 pt-16"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 pt-8 gap-4">
        {/* Section Header */}
        <View className="px-4 gap-1">
          <Typography
            variant="h2"
            color={colors.text}
            className="w-full"
          >
            Categories
          </Typography>
          <Typography
            variant="body"
            weight="regular"
            font="literata"
            color={colors.secondaryText}
            className="w-full"
          >
            Previously generated guides by other users.
          </Typography>
        </View>

        {/* Categories List */}
        <View
          className="rounded-2xl px-4 py-3 gap-3"
          style={{ backgroundColor: colors.cardBackground }}
        >
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              categoryName={category.name}
              colorIndicator={category.colorIndicator}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </View>
      </View>

      {/* Extra bottom padding for bottom tab bar */}
      <View className="h-8" />
    </ScrollView>


  );
}


