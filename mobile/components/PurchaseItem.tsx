/**
 * PurchaseItem displays a single token purchase with date, quantity, and
 * price. Use in purchase history lists.
 */
import React from "react";
import { View, StyleSheet, PressableProps, Pressable } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface PurchaseItemProps extends Omit<PressableProps, "style"> {
  date: string;
  tokens: number;
  price: string;
  style?: any;
}

const PurchaseItem: React.FC<PurchaseItemProps> = ({
  date,
  tokens,
  price,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Typography
            variant="label"
            weight="light"
            color={colors.secondaryText}
            style={styles.date}
          >
            {date}
          </Typography>
          <Typography
            variant="body"
            color={colors.text}
            style={styles.tokens}
          >
            {tokens} Tokens
          </Typography>
        </View>
        <Typography
          variant="h3"
          weight="bold"
          color={colors.secondaryText}
          style={styles.price}
        >
          {price}
        </Typography>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2

  },
  leftContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  date: {
    width: "100%",
  },
  tokens: {
    width: "100%",
  },
  price: {
    textAlign: "right",
  },
  pressed: {
    opacity: 0.7,
  },
});

export default PurchaseItem;