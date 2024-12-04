import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { supabase } from "@/lib/supabaseClient";
import { Guides } from "../../../types/custom";
import SuggestionCard from "@/components/SuggestionCard";

import { PageTitle, Text } from "@/components/Themed";
import InputWrapper from "@/components/InputWrapper";

import { useAuth } from "@/utils/AuthProvider";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [guides, setGuides] = useState<{ guides: Guides[]; notfound: boolean }>(
    {
      guides: [],
      notfound: false,
    }
  );
  const [suggestions, setSuggestions] = useState<Guides[]>([]);

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("guides")
        .select("id,title,steps")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.log("error", error);

        setError(error);
      }
      if (data) {
        setSuggestions(data as Guides[]);
      }
      setLoading(false);
    };
    func();
  }, []);

  const handleSearch = async (e: any) => {
    setLoading(true);
    setSearch(e);
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .ilike("title", `%${e}%`);

    if (error) console.error(error);

    if (data?.length === 0) {
      setGuides({ guides: [], notfound: true });
    } else setGuides({ guides: data as Guides[], notfound: false });
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    if (!profile) {
      Alert.alert(
        "Please login first",
        "You need to be logged in to generate a guide",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            style: "default",
            onPress: async () => {
              router.push("/profile");
            },
          },
        ]
      );
    } else if (profile?.tokens === 0) {
      Alert.alert(
        "You don't have enough tokens",
        "You need to buy more tokens to generate a guide",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Buy tokens",
            style: "default",
            onPress: async () => {
              router.push("/profile");
            },
          },
        ]
      );
    } else {
      const apiKey = process.env.EXPO_PUBLIC_API_AUTH_KEY;
      if (!apiKey) {
        console.error("API key is missing");
        return;
      }

      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/api/generate-guide",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            query: search,
          }),
        }
      );
      const { data, error } = await response.json();
      setSuggestions((prev) => [data, ...prev.slice(0, 9)]);
      setGuides({ guides: [], notfound: false });
      setSearch(null);

      if (await data.id) {
        console.log("id true", data.id);

        router.push({
          pathname: "/[guide]/guide",
          params: { guide: await data.id },
        });
      } else {
        setError("Something went wrong");
      }
    }

    setLoading(false);
  };

  if (error) {
    return (
      <View style={styles.loading}>
        <Text>Something is wrong</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : search !== null && search !== "" ? (
          guides.notfound ? (
            <View style={styles.loading}>
              <Text>No guides found</Text>
            </View>
          ) : (
            <View style={styles.pageContainer}>
              <PageTitle style={styles.title}>Search results</PageTitle>
              <FlatList
                style={styles.flatlist}
                contentContainerStyle={styles.content}
                data={guides.guides}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return <SuggestionCard guide={item} />;
                }}
                numColumns={2}
              />
            </View>
          )
        ) : (
          <View style={styles.pageContainer}>
            <PageTitle style={styles.title}>Latest guides</PageTitle>
            <FlatList
              style={styles.flatlist}
              contentContainerStyle={styles.content}
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return <SuggestionCard guide={item} />;
              }}
              numColumns={2}
            />
          </View>
        )}
        <InputWrapper
          search={search || ""}
          handleSearch={handleSearch}
          guides={guides}
          handleGenerate={handleGenerate}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 88,
  },
  flatlist: {
    height: "100%",
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    gap: 16,
    paddingBottom: 88,
    paddingTop: 16,
  },

  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  pageContainer: { gap: 16 },
  title: {
    paddingHorizontal: 24,
  },
});

export default HomeScreen;
