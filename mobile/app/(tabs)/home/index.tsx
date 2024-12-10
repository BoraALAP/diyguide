import React, { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/Button";

import { useSupabase } from "@/utils/SupabaseProvider";
import Loading from "@/components/Loading";
import { FunctionsFetchError } from "@supabase/supabase-js";
import { FunctionsRelayError } from "@supabase/supabase-js";
import { FunctionsHttpError } from "@supabase/supabase-js";

export default function HomeScreen() {
  const { profile, removeToken } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchGuides = useCallback(
    async (page: number) => {
      setLoading(true);

      const { data, error } = await supabase
        .from("guides")
        .select("id,title,steps")
        .order("created_at", { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);

      if (error) {
        console.log("error", error);
        setError(error);
      }
      if (data) {
        setSuggestions((prev) => [...prev, ...data] as Guides[]);
      }
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    },
    [setSuggestions, setLoading, setLoadingMore, setRefreshing, setError]
  );

  useEffect(() => {
    fetchGuides(page);
  }, [page, fetchGuides]);

  useEffect(() => {
    console.log("Suggestions updated:", suggestions);
  }, [suggestions]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setSuggestions([]);
    fetchGuides(0);
  };

  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
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
      setGenerating(true);
      const {
        data: { data },
        error,
      } = await supabase.functions.invoke("openai", {
        body: { query: search },
      });

      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log("Function returned an error", errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.log("Relay error:", error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.log("Fetch error:", error.message);
      }

      console.log("data", data);
      setSuggestions((prev) => [data, ...prev.slice(0, 9)]);
      setGuides({ guides: [], notfound: false });
      setSearch(null);
      setGenerating(false);
      if (await data.id) {
        await removeToken();
        router.push({
          pathname: "/[guide]/guide",
          params: { guide: await data.id },
        });
      } else {
        setError("Something went wrong");
      }
      if (error) throw error;
      setLoading(false);
      return data?.data; // The AI response
    }
  };

  if (error) {
    return (
      <>
        <ScrollViewT
          style={styles.pageScrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ViewT style={styles.pageCenter}>
            <TextT>Something is wrong,</TextT>
          </ViewT>
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
              <TextT bold>Looks like we don't have a guide for that.</TextT>
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
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
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
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          </ViewT>
        )}
        <InputWrapper
          search={search || ""}
          handleSearch={handleSearch}
          guides={guides}
          handleGenerate={handleGenerate}
          generating={generating}
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
  pageScrollContainer: {
    flex: 1,
  },
  pageCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
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
