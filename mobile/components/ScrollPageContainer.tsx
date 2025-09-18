import { useSupabase } from "@/utils/SupabaseProvider"
import { RefreshControl, ScrollView, StyleSheet } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

interface Props {
  children: React.ReactNode
  onRefresh?: () => void
  header?: boolean
}


export const ScrollPageContainer: React.FC<Props> = ({ children, onRefresh, header = false }) => {
  const { loading } = useSupabase();
  const insets = useSafeAreaInsets()
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView style={{ paddingTop: header ? insets.top : 24 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 32,
    paddingHorizontal: 16,
    paddingBottom: 32,
  }
})