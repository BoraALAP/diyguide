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
import CategoryItem from "./CategoryItem";
import BottomTabBar from "./BottomTabBar";
import Loading from "./Loading";
import { ViewT } from "./Themed";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface Category {
  id: string;
  name: string;
  colorIndicator: string;
  guideCount: number;
}

interface CategoriesPageProps {
  onTabPress?: (tab: "home" | "categories" | "profile") => void;
  onSearch?: (text: string) => void;
  onGenerate?: () => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onTabPress,
  onSearch,
  onGenerate,
}) => {
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

  const handleSearch = async (text: string) => {
    setSearchValue(text);
    onSearch?.(text);
  };

  if (loading && categories.length === 0) {
    return <Loading />;
  }

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
          {/* Section Header */}
          <ViewT style={styles.header}>
            <Typography
              variant="h2"
              color={colors.text}
              style={styles.title}
            >
              Categories
            </Typography>
            <Typography
              variant="body"
              weight="regular"
              font="literata"
              color="#4b4b4b"
              style={styles.subtitle}
            >
              Previously generated guides by other users.
            </Typography>
          </ViewT>

          {/* Categories List */}
          <ViewT
            style={[
              styles.categoriesContainer,
              {
                backgroundColor: colors.cardBackground,
              },
            ]}
          >
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                categoryName={category.name}
                colorIndicator={category.colorIndicator}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </ViewT>
        </ViewT>

        {/* Extra bottom padding for bottom tab bar */}
        <ViewT style={styles.bottomPadding} />
      </ScrollView>

      <BottomTabBar
        activeTab="categories"
        onTabPress={onTabPress}
        onSearch={handleSearch}
        onGenerate={onGenerate}
        searchValue={searchValue}
      />
    </ViewT>
  );
};

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
    gap: 16,
  },
  header: {
    paddingHorizontal: 16,
    gap: 4,
  },
  title: {
    width: "100%",
  },
  subtitle: {
    width: "100%",
  },
  categoriesContainer: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    overflow: "hidden",
  },
  bottomPadding: {
    height: 200, // Space for bottom tab bar + extra scroll space
  },
});

export default CategoriesPage;