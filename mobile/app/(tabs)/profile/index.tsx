import Button from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { Session } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabaseClient";
import Auth from "@/components/Auth";

const ProfileScreen = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Session:", session?.user);

  return (
    <View style={styles.container}>
      {!session ? (
        <Auth />
      ) : (
        <>
          <Text>{session.user?.id || "No User ID"}</Text>
          <Button
            onPress={handleSignOut}
            disabled={loading}
            title={loading ? "Signing out..." : "Sign Out"}
          />
        </>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
