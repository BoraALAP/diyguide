/**
 * PageTitle standardises screen headings with Literata titles and supporting
 * copy. Use at the top of new sections.
 */
import { View, StyleSheet } from "react-native"
import Typography from "./Typography"
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";


export const PageTitle = ({ title, description }: { title: string, description: string }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <View style={styles.header}>
      <Typography
        variant="h2"
        color={colors.text}
        style={styles.title}
      >
        {title}
      </Typography>
      <Typography
        variant="body"
        weight="regular"
        font="literata"
        color={colors.secondaryText}
        style={styles.subtitle}
      >
        {description}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16, // px-4 from Figma
    gap: 4, // gap-1 from Figma
  },
  title: {
    width: "100%",
  },
  subtitle: {
    width: "100%",
  },
})
