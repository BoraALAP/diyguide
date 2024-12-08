import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.APP_ENV === "production"
//   ? "https://vixtnqangkibmfnhpily.supabase.co"
//   : process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.APP_ENV === "production"
//   ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeHRucWFuZ2tpYm1mbmhwaWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MjI3NjcsImV4cCI6MjA0NzM5ODc2N30.XO2dfua_AcZ_CSDACjuiPLvZ8nNVYoMFxIDlcH_YQ0M"
//   : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log("teste", supabaseAnonKey, supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("test", supabaseAnonKey, supabaseUrl);

  throw Error(`error ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
