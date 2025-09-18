/**
 * Auth renders Supabase authentication flows (password, magic link, GitHub,
 * Apple) and manages session refresh + deep links. Drop in on screens that
 * should require sign-in before showing content, like the profile tab.
 */
import React, { useState } from "react";
import { StyleSheet, View, AppState, Platform, ScrollView, Text } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Updates from "expo-updates";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabaseClient";

import Input from "./Input";
import PrimaryButton from "./Button";
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            <PrimaryButton
              title="Sign in"
              onPress={handleSubmit(onSubmit)}
              disabled={loading || !isFormValid}
            />

            <PrimaryButton
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
                <Text>Check your email for the magic link.</Text>
              </View>
            ) : (
              <PrimaryButton
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
            <PrimaryButton
              onPress={async () => {
                setUsePassword(false);
              }}
              title="Sign In with Magic Link"
              variant="secondary"
            />
          ) : (
            <PrimaryButton
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
          <Text style={styles.orText}>
            Or
          </Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.bottomButtons}>
          <PrimaryButton
            onPress={() => performOAuth("github")}
            title="Sign in with Github"
            variant="tertiary"
          />

          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={8}
              style={styles.appleButton}
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  // Sign in via Supabase Auth.
                  if (credential.identityToken) {
                    const {
                      error,
                      data: { user },
                    } = await supabase.auth.signInWithIdToken({
                      provider: "apple",
                      token: credential.identityToken,
                    });
                    console.log(JSON.stringify({ error, user }, null, 2));
                    if (!error) {
                      // User is signed in.
                    }
                  } else {
                    throw new Error("No identityToken.");
                  }
                } catch (e: any) {
                  if (e.code === "ERR_REQUEST_CANCELED") {
                    // handle that the user canceled the sign-in flow
                    console.log(e);
                  } else {
                    // handle other errors
                    console.log(e);
                  }
                }
              }}
            />
          )}
        </View>
      </View>
      <View style={styles.versionContainer}>
        <Text>Runtime Version: {Updates.runtimeVersion}</Text>
      </View>
      <View style={styles.versionContainer}>
        <Text>Update Id: {Updates.updateId}</Text>
      </View>
    </ScrollView>
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
    justifyContent: "center",
  },
  appleButton: {
    width: "100%",
    height: 48,
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
  versionContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
});
