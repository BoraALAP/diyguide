import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Provider, Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { User } from "@/types/custom";
import { SplashScreen } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";

SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();
console.log("redirectTo", redirectTo);

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

type SupabaseContextType = {
  profile: User | null;
  session: Session | null;
  loading: boolean;
  initialized?: boolean;
  getProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  performOAuth: (provider: Provider) => Promise<void>;
  sendMagicLink: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  removeToken: () => Promise<void>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextType>({
  profile: null,
  session: null,
  loading: false,
  initialized: false,
  getProfile: async () => {},
  updateProfile: async (updates: Partial<User>) => {},
  signInWithPassword: async (email: string, password: string) => {},
  signUp: async (email: string, password: string) => false,
  performOAuth: async (provider: Provider) => {},
  sendMagicLink: async (email: string) => false,
  signOut: async () => {},
  removeToken: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Session management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Profile management
  useEffect(() => {
    if (session?.user) getProfile();
    else setProfile(null);
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      console.log("session", session);
      if (!session?.user) throw new Error("No user on the sessionnnn!");

      const { data, error, status } = await supabase
        .from("users")
        .select(`*`)
        .eq("id", session?.user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<User>) {
    try {
      setLoading(true);
      if (!session?.user) {
        Alert.alert("No user on the session!");
        throw new Error("No user on the session!");
      }

      const updatedData = {
        ...updates,
        tokens: (profile?.tokens || 0) + (updates.tokens || 0),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", session?.user.id)
        .select("*");

      if (error) {
        Alert.alert(error.message);
        throw error;
      }

      setProfile(data[0]); // Access first element since data is an array
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function removeToken() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      if (!profile?.tokens || profile.tokens <= 0)
        throw new Error("No tokens available!");

      const updatedData = {
        tokens: profile.tokens - 1,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", session?.user.id)
        .select("*");

      if (error) throw error;

      setProfile(data[0]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signInWithPassword(email: string, password: string) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    console.log("error", error);
    setLoading(false);
  }

  async function signUp(email: string, password: string) {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      console.log("signup error", error);
      return false;
    }
    if (!session) {
      return false;
    }
    setLoading(false);
    return true;
  }

  const performOAuth = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${redirectTo}(tabs)/profile`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      console.log("data", data, error);

      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
      );

      console.log("res", res);

      if (res.type === "success") {
        const { url } = res;
        // Check if the URL contains an error
        if (url.includes("error=")) {
          const errorParams = QueryParams.getQueryParams(url);
          throw new Error(
            `Authentication failed: ${errorParams.params.error_description}`
          );
        }
        await createSessionFromUrl(url);
      }
    } catch (error) {
      console.error("OAuth error:", error);
      Alert.alert(
        "Authentication Error",
        "Failed to sign in with GitHub. Please try again."
      );
    }
  };

  const sendMagicLink = async (email: string) => {
    console.log("sendMagicLink", email);

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    console.log("data", data, error);

    if (error) throw error;
    // Email sent.
    return true;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) return;

    /* HACK: Something must be rendered when determining the initial auth state... 
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [initialized, session]);

  return (
    <SupabaseContext.Provider
      value={{
        profile,
        session,
        loading,
        initialized,
        getProfile,
        updateProfile,
        signInWithPassword,
        signUp,
        performOAuth,
        sendMagicLink,
        signOut,
        removeToken,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
