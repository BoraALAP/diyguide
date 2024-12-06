import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { User } from "@/types/custom";

interface AuthContextType {
  session: Session | null;
  profile: User | null;
  loading: boolean;
  getProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  removeToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Session management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Profile management
  useEffect(() => {
    if (session) getProfile();
    else setProfile(null);
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("user")
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
      if (!session?.user) throw new Error("No user on the session!");

      const updatedData = {
        ...updates,
        tokens: (profile?.tokens || 0) + (updates.tokens || 0),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user")
        .update(updatedData)
        .eq("id", session?.user.id)
        .select("*");

      if (error) throw error;

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
        .from("user")
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

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        getProfile,
        updateProfile,
        removeToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
