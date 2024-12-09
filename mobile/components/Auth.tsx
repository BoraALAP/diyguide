import React, { useState } from "react";
import { StyleSheet, View, AppState } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabaseClient";
import { ScrollViewT, TextT, ViewT } from "./Themed";
import Input from "./Input";
import { Button } from "./Button";
import { useSupabase } from "@/utils/SupabaseProvider";

// Define the schema using zod
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof schema>;

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const {
    signInWithPassword,
    signUp,
    loading,
    performOAuth,
    sendMagicLink,
    createSessionFromUrl,
  } = useSupabase();

  // this needs to in the auth component, if it is not it just loops the create session from url function

  const url = Linking.useURL();
  console.log("url", url);
  if (url) createSessionFromUrl(url);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Watch form values
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Validation check
  const isFormValid = isValid && emailValue && passwordValue?.length >= 6;

  const onSubmit = (data: FormData) => {
    signInWithPassword(data.email, data.password);
  };

  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [usePassword, setUsePassword] = useState(false);

  const onSendMagicLink = async (email: string) => {
    const res = await sendMagicLink(email);
    setMagicLinkSent(res);
  };

  return (
    <ScrollViewT contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.inputs}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                placeholder="email@address.com"
                autoCapitalize={"none"}
                error={errors.email?.message}
              />
            )}
          />

          {usePassword && (
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="default"
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={"none"}
                  error={errors.password?.message}
                />
              )}
            />
          )}
        </View>

        {usePassword && (
          <View style={styles.topButtons}>
            <Button
              title="Sign in"
              onPress={handleSubmit(onSubmit)}
              disabled={loading || !isFormValid}
            />

            <Button
              title="Sign up"
              disabled={loading || !isFormValid}
              variant="secondary"
              onPress={handleSubmit((data) =>
                signUp(data.email, data.password)
              )}
            />
          </View>
        )}

        {!usePassword && (
          <View style={styles.bottomButtons}>
            {magicLinkSent ? (
              <View style={styles.magicLinkSent}>
                <TextT bold>Check your email for the magic link.</TextT>
              </View>
            ) : (
              <Button
                onPress={async () => {
                  const email = getValues("email");
                  if (email) {
                    await onSendMagicLink(email);
                  }
                }}
                title="Continue with Magic Link"
                variant="primary"
                disabled={!emailValue || magicLinkSent}
              />
            )}
          </View>
        )}

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
        </View>

        <View style={styles.bottomButtons}>
          {usePassword ? (
            <Button
              onPress={async () => {
                setUsePassword(false);
              }}
              title="Sign In with Magic Link"
              variant="secondary"
            />
          ) : (
            <Button
              onPress={async () => {
                setUsePassword(true);
              }}
              title="Sign In with Password"
              variant="secondary"
            />
          )}
        </View>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <TextT bold style={styles.orText}>
            Or
          </TextT>
          <View style={styles.orLine} />
        </View>

        <View style={styles.bottomButtons}>
          <Button
            onPress={() => performOAuth("github")}
            title="Sign in with Github"
            variant="tertiary"
          />
        </View>
      </View>
    </ScrollViewT>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 40,
    padding: 24,
  },
  inputs: {
    flexDirection: "column",
    gap: 16,
  },
  topButtons: {
    flexDirection: "column",
    gap: 12,
  },
  bottomButtons: {
    gap: 16,
  },
  orText: {
    textAlign: "center",
  },
  magicLinkSent: {
    alignItems: "center",
    paddingVertical: 12,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
});
