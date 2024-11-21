import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

const SuggestionCard = ({ guide }: { guide: any }) => {
  return (
    <Link
      href={{
        pathname: "/[guide]/guide",
        params: { guide: guide.id, title: guide.title },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <Text style={styles.title}>{guide.title}</Text>
        <View style={styles.tagWrapper}>
          <Text style={styles.step}>{guide.steps.length} steps</Text>
          {/* {guide.tags.map((tag: string) => {
            return (
              <Text style={styles.tag} key={tag}>
                {tag}
              </Text>
            );
          })} */}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    width: "50%",
  },
  title: { fontWeight: "bold", marginBottom: 5 },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 6,
  },
  tag: {
    fontSize: 12,
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textTransform: "capitalize",
    color: "#303030",
  },
  step: {
    fontSize: 12,
    color: "#303030",
  },
});

export default SuggestionCard;
