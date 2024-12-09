import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";

import { supabase } from "@/lib/supabaseClient";
import { Guides } from "../../../types/custom";
import SuggestionCard from "@/components/SuggestionCard";

import { PageTitle, ScrollViewT, TextT, ViewT } from "@/components/Themed";
import InputWrapper from "@/components/InputWrapper";

import { useSupabase } from "@/utils/SupabaseProvider";
import Loading from "@/components/Loading";

export default function HomeScreen() {
  const { profile, removeToken } = useSupabase();
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
  const [refreshing, setRefreshing] = useState(false);

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
    setRefreshing(false);
  };

  useEffect(() => {
    func();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    func();
  };

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
      // const apiKey = process.env.EXPO_PUBLIC_API_AUTH_KEY;
      // if (!apiKey) {
      //   console.error("API key is missing");
      //   return;
      // }

      // const response = await fetch(
      //   process.env.EXPO_PUBLIC_BACKEND_URL + "/api/generate-guide",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-api-key": apiKey,
      //     },
      //     body: JSON.stringify({
      //       query: search,
      //     }),
      //   }
      // );
      // const { data, error } = await response.json();
      // if (error) {
      //   console.log("error", error);

      //   setError(error);
      //   return;
      // }

      // setSuggestions((prev) => [data, ...prev.slice(0, 9)]);
      // setGuides({ guides: [], notfound: false });
      // setSearch(null);

      // if (await data.id) {
      //   await removeToken();
      //   router.push({
      //     pathname: "/[guide]/guide",
      //     params: { guide: await data.id },
      //   });
      // } else {
      //   setError("Something went wrong");
      // }

      const { data, error } = await supabase.functions.invoke<{ data: string }>(
        "openai",
        {
          body: { query: search },
        }
      );

      console.log("data", data);

      if (error) throw error;
      return data?.data; // The AI response
    }

    setLoading(false);
  };

  if (error) {
    return (
      <>
        <ScrollViewT
          style={styles.pageCenter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <TextT>Something is wrong,</TextT>
        </ScrollViewT>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ViewT style={styles.contentContainer}>
        {loading ? (
          <Loading />
        ) : search !== null && search !== "" ? (
          guides.notfound ? (
            <ViewT style={styles.pageCenter}>
              <TextT>No guides found</TextT>
            </ViewT>
          ) : (
            <ViewT style={styles.pageContainer}>
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
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </ViewT>
          )
        ) : (
          <ViewT style={styles.pageContainer}>
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
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </ViewT>
        )}
        <InputWrapper
          search={search || ""}
          handleSearch={handleSearch}
          guides={guides}
          handleGenerate={handleGenerate}
        />
      </ViewT>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: { gap: 16 },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 88,
  },
  flatlist: {
    paddingHorizontal: 8,
  },
  pageCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    gap: 16,
    paddingBottom: 120,
    paddingTop: 16,
  },
  title: {
    paddingHorizontal: 24,
  },
});
