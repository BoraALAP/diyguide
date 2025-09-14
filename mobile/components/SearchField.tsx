import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "./Typography";
import PrimaryButton from "./PrimaryButton";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface SearchFieldProps extends Omit<TextInputProps, "style"> {
  onSearch?: (text: string) => void;
  onGenerate?: () => void;
  style?: any;
  showGenerateButton?: boolean;
}

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = "Search or Generate",
  value,
  onChangeText,
  onSearch,
  onGenerate,
  style,
  showGenerateButton = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleTextChange = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  const isActive = isFocused || inputValue.length > 0;

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.searchContainer,
        {
          backgroundColor: colors.searchBarBackground,
        }
      ]}>
        <Ionicons
          name="search"
          size={16}
          color={colors.icon}
          style={styles.searchIcon}
        />
        <TextInput
          {...props}
          value={inputValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.lightText}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={[
            styles.textInput,
            {
              color: colors.text,
              fontFamily: "Lexend_400Regular",
            }
          ]}
        />
      </View>

      {isActive && (
        <PrimaryButton
          title="Generate"
          onPress={onGenerate}
          style={styles.generateButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    minHeight: 22,
  },
  generateButton: {
    minWidth: 77,
  },
});

export default SearchField;