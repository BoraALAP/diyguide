import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { SecondaryText, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { useThemeColor } from "./Themed";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
}: InputProps) => {
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

  const borderColor = error
    ? Colors.light.error
    : useThemeColor(
        { light: Colors.light.border, dark: Colors.dark.border },
        "border"
      );

  return (
    <View style={styles.container}>
      {label && <SecondaryText style={styles.label}>{label}</SecondaryText>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.tabIconDefault}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

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
