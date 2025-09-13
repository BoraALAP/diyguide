import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { SplashScreen } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabaseClient";
import { Provider, Session } from "@supabase/supabase-js";

import { User } from "@/types/custom";

// Prevents the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Completes the auth session for web
WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();
console.log("redirectTo", redirectTo);

// Define the context type for Supabase
type SupabaseContextType = {
  profile: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  performOAuth: (provider: Provider) => Promise<void>;
  sendMagicLink: (email: string) => Promise<boolean>;
  setSession: (session: Session | null) => void;
  getProfile: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  removeToken: () => Promise<void>;
  createSessionFromUrl: (url: string) => Promise<Session | null | undefined>;
  deleteUser: () => Promise<void>;
};

// Create a context for Supabase
export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

// Custom hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

// Hook to manage Supabase provider state and functions
const useSupabaseProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) getProfile(session.user.id);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Creates a session from the URL after OAuth redirect
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

  // Fetches the user profile from Supabase
  const getProfile = async (id: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select(`*`)
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Updates the user profile in Supabase
  const updateProfile = async (updates: Partial<User>) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const updatedData = {
        ...updates,
        tokens: (profile?.tokens || 0) + (updates.tokens || 0),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", session.user.id)
        .select("*")
        .single();
      if (error) throw error;

      setProfile(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Decrements the user's token count
  const removeToken = async () => {
    if (!session?.user || !profile?.tokens || profile.tokens === 0) return;
    setLoading(true);
    try {
      const updatedData = {
        tokens: profile.tokens - 1,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", session.user.id)
        .select("*");

      console.log("remove token", data);

      if (error) throw error;
      setProfile(data[0]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Signs in the user with email and password
  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Signs up a new user with email and password
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectTo}(tabs)/profile`,
        },
      });
      if (error) throw error;
      console.log("session", data);

      if (data.user && !data.session) {
        Alert.alert("Confirmation sent to email", "Please check your email", [
          {
            text: "OK",
          },
        ]);
      }

      // setSession(data);
      return !!data;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Performs OAuth authentication with a provider
  const performOAuth = async (provider: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${redirectTo}(tabs)/profile`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
      );

      if (res.type === "success") {
        const { url } = res;
        if (url.includes("error=")) {
          const errorParams = QueryParams.getQueryParams(url);
          throw new Error(
            `Authentication failed: ${errorParams.params.error_description}`
          );
        }
        await createSessionFromUrl(url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Authentication Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sends a magic link to the user's email for authentication
  const sendMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectTo}(tabs)/profile`,
        },
      });

      if (error) throw error;

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);

        Alert.alert(error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signs out the current user
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setProfile(null);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Return the context value with all state and functions
  return {
    profile,
    session,
    loading,
    signInWithPassword,
    signUp,
    updateProfile,
    performOAuth,
    sendMagicLink,
    setSession,
    getProfile,
    signOut,
    removeToken,
    createSessionFromUrl,
    deleteUser,
  };
};

// SupabaseProvider component that provides the context to its children
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const supabase = useSupabaseProvider();

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};
