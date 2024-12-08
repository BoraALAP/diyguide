import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { SecondaryText, TextT, useCardStyles } from "./Themed";

const SuggestionCard = ({ guide }: { guide: any }) => {
  const cardStyles = useCardStyles();
  return (
    <Link
      href={{
        pathname: "/[guide]/guide",
        params: { guide: guide.id, title: guide.title },
      }}
      asChild
    >
      <Pressable style={cardStyles.card}>
        <TextT style={styles.title}>{guide.title}</TextT>

        <SecondaryText>{guide.steps.length} steps</SecondaryText>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "bold", marginBottom: 5 },
});

export default SuggestionCard;
