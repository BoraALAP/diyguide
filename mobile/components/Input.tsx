import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Colors from "@/constants/Colors";
import { TextT, useThemeColor } from "./Themed";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "border"
  );

  return (
    <View style={styles.container}>
      <TextT style={styles.label}>{label}</TextT>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor: error ? Colors.light.error : borderColor,
          },
        ]}
        placeholderTextColor={Colors.light.tabIconDefault}
        {...props}
      />
      {error ? <TextT style={styles.errorText}>{error}</TextT> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
