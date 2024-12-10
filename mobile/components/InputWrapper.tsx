import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useThemeColor } from "./Themed";
import Colors from "@/constants/Colors";
import { Button } from "./Button";

const InputWrapper = ({
  search,
  handleSearch,
  guides,
  handleGenerate,
  generating,
}: {
  search: string;
  handleSearch: (text: string) => void;
  guides: { notfound?: boolean };
  handleGenerate: () => void;
  generating: boolean;
}) => {
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.inputBackground,
      dark: Colors.dark.inputBackground,
    },
    "inputBackground"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  return (
    <BlurView intensity={20} style={[styles.inputWrapper, { backgroundColor }]}>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Search for guides.."
        value={search || ""}
        onChangeText={(e) => handleSearch(e)}
        returnKeyLabel="Generate"
        returnKeyType="done"
        onSubmitEditing={handleGenerate}
      />
      {guides.notfound && (
        <Button
          title="Generate"
          size="medium"
          onPress={handleGenerate}
          disabled={generating}
        />
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
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
});

export default InputWrapper;
