import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { SecondaryText, Text, useCardStyles } from "./Themed";

const CategorySuggestionCard = ({ guide }: { guide: any }) => {
  const cardStyles = useCardStyles();
  return (
    <Link
      href={{
        pathname: "/[guide]/guide",
        params: { guide: guide.id, title: guide.title },
      }}
      asChild
    >
      <Pressable style={{ ...styles.card, ...cardStyles.card }}>
        <Text style={styles.title}>{guide.title}</Text>
        <SecondaryText>{guide.steps.length} steps</SecondaryText>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: { maxWidth: 200 },
  title: { fontWeight: "bold", marginBottom: 5 },
});

export default CategorySuggestionCard;
