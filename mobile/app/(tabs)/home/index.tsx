import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { supabase } from "../../../utils/supabaseClient";
import { Guides } from "../../../types/custom";
import SuggestionCard from "@/components/SuggestionCard";
import { Stack, router } from "expo-router";
import { BlurView } from "expo-blur";
import Colors from "@/constants/Colors";

const HomeScreen = ({ navigation }: { navigation: any }) => {
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

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .ilike("title", `%${search}%`);

    if (error) console.error(error);

    if (data?.length === 0) {
      console.log("no data");
      setGuides({ guides: [], notfound: true });
    } else setGuides({ guides: data as Guides[], notfound: false });
    setLoading(false);
  };

  const handleGenerate = async () => {
    const apiKey = process.env.EXPO_PUBLIC_API_AUTH_KEY;
    if (!apiKey) {
      console.error("API key is missing");
      return;
    }
    setLoading(true);

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
    setSuggestions((prev) => [data, ...prev.slice(0, 7)]);
    setGuides({ guides: [], notfound: false });
    setSearch(null);

    console.log(data, error);

    if (await data.id) {
      console.log("id true", data.id);

      router.push({
        pathname: "/[guide]/guide",
        params: { guide: await data.id },
      });
    } else {
      setError(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  if (error) {
    return (
      <View style={styles.loading}>
        <Text>{error}</Text>
      </View>
    );
  }
  console.log(guides.notfound);

  return (
    <View style={styles.container}>
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
            <Text style={styles.suggestionsTitle}>Search results</Text>
            <FlatList
              style={styles.flatlist}
              contentContainerStyle={styles.content}
              data={guides.guides}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.cardContainer}>
                    <SuggestionCard guide={item} />
                  </View>
                );
              }}
              numColumns={2}
            />
          </View>
        )
      ) : (
        <View style={styles.pageContainer}>
          <Text style={styles.suggestionsTitle}>Latest guides</Text>
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

      <BlurView intensity={20} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search for guides.."
          value={search || ""}
          onChangeText={setSearch}
        />
        {guides.notfound ? (
          <Pressable style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.buttonText}>Generate</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.defaultbutton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
        )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 88,
  },
  content: { paddingBottom: 80 },
  flatlist: {
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    height: "100%",
  },
  cardContainer: {},
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    backgroundColor: "rgba(255,255,255, 0.75)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    flex: 1,
    borderColor: "#8c8c8c",
  },
  pageContainer: { gap: 16 },
  suggestionsTitle: {
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: "bold",
    color: "#303030",
  },
  defaultbutton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
  },
  generateButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
  },
  buttonText: { color: "white" },
});

export default HomeScreen;
