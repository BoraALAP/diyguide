import { Image } from "react-native";
import { router } from "expo-router";
import * as Updates from "expo-updates";
import { StyleSheet, View } from "react-native";

import Auth from "@/components/Auth";
import { Button } from "@/components/Button";
import {
  ViewT,
  PageTitle,
  SecondaryText,
  ScrollViewT,
} from "@/components/Themed";
import PurchaseButton from "@/components/PurchaseButton";
import { useSupabase } from "@/utils/SupabaseProvider";

export default function ProfileScreen() {
  const { profile, loading, signOut } = useSupabase();

  return (
    <>
      {!profile ? (
        <Auth />
      ) : (
        <ViewT style={styles.profileContainer}>
          <ViewT style={styles.avatarContainer}>
            <Image
              source={
                profile?.avatar_url
                  ? { uri: profile.avatar_url }
                  : {
                    uri: `https://avatar.vercel.sh/${profile?.full_name ? profile?.full_name : "rauchg"
                      }`,
                  }
              }
              style={styles.avatar}
            />
            <ViewT style={styles.userInfo}>
              <PageTitle>{profile?.full_name || "Add your name"}</PageTitle>
              <SecondaryText>Available Tokens: {profile.tokens}</SecondaryText>
            </ViewT>
          </ViewT>
          {/* <PurchaseButton /> */}

          <ViewT style={styles.buttonContainer}>
            <Button
              onPress={() => router.push("/profile/editmodal")}
              title="Edit Profile"
              variant="secondary"
              size="large"
            />
            <Button
              onPress={signOut}
              disabled={loading}
              title={"Sign Out"}
              variant="secondary"
              size="large"
            />
          </ViewT>
        </ViewT>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    gap: 24,
    paddingHorizontal: 24,
    flex: 1,
    paddingTop: 100,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    gap: 4,
  },
  buttonContainer: {
    gap: 12,
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  versionContainer: {
    marginTop: 24,
    gap: 4,
    alignItems: "center",
  },
});
