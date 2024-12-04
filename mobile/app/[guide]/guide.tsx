import React, { Suspense, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabaseClient";
import {
  PageTitle,
  ScrollView,
  SecondaryText,
  Text,
} from "@/components/Themed";
import Colors from "@/constants/Colors";

const getThemedStyles = (colorScheme: "light" | "dark" | null) => {
  return StyleSheet.create({
    content: {
      rowGap: 16,
      paddingBottom: 60,
    },
    header: {
      rowGap: 8,
      padding: 24,
      paddingTop: 120,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
    },
    materials: {
      rowGap: 8,
      padding: 24,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
    },
    tools: {
      rowGap: 8,
      padding: 24,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
    },
    stepMaterials: {
      rowGap: 8,
      padding: 12,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
    },
    stepTools: {
      rowGap: 8,
      padding: 12,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
    },
    tips: {
      rowGap: 8,
      marginHorizontal: 24,
      backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
      padding: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    description: {
      fontSize: 16,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    text: {
      fontSize: 16,
    },

    steptitle: {
      fontSize: 16,
      fontWeight: "bold",

      flex: 1,
    },
    steps: {
      rowGap: 16,
      marginHorizontal: 24,
    },
    step: {
      rowGap: 8,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    stepContainer: {
      rowGap: 8,

      paddingBottom: 16,
    },
    stepsSubTitle: {
      fontSize: 12,
      fontWeight: "bold",
    },
    stepNumber: {
      fontSize: 14,
      marginTop: 1,
      fontWeight: "bold",
    },
  });
};

const page = () => {
  const { guide } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [info, setInfo] = useState<any>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("id", guide)
        .single();

      setInfo(data);
      setError(error);
      setLoading(false);
    };
    func();
  }, []);

  console.log(info);

  const styles = getThemedStyles(colorScheme ?? "light");

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <PageTitle>{info?.title}</PageTitle>
          <Text>{info?.content}</Text>
        </View>
        <View></View>

        {info?.materials !== null && (
          <View style={styles.materials}>
            <Text style={styles.subTitle}>Materials</Text>
            {info?.materials.map((material: string) => {
              return <SecondaryText key={material}>{material}</SecondaryText>;
            })}
          </View>
        )}
        {info?.tools !== null && (
          <View style={styles.tools}>
            <Text style={styles.subTitle}>Tools</Text>
            {info?.tools.map((tool: string) => {
              return <SecondaryText key={tool}>{tool}</SecondaryText>;
            })}
          </View>
        )}
        <View style={styles.steps}>
          <Text style={styles.subTitle}>Steps</Text>
          {info?.steps.map((step: any) => {
            return (
              <View key={step.step} style={styles.stepContainer}>
                <View style={styles.step}>
                  <Text style={styles.stepNumber}>{step.step}.</Text>
                  <Text style={styles.steptitle}>{step.description}</Text>
                </View>
                {step.materials.length > 0 && (
                  <View style={styles.stepMaterials}>
                    <Text style={styles.stepsSubTitle}>Materials</Text>
                    {step.materials.map((material: string) => {
                      return (
                        <SecondaryText key={material}>{material}</SecondaryText>
                      );
                    })}
                  </View>
                )}
                {step.tools.length > 0 && (
                  <View style={styles.stepTools}>
                    <Text style={styles.stepsSubTitle}>Tools</Text>
                    {step.tools.map((tool: string) => {
                      return <SecondaryText key={tool}>{tool}</SecondaryText>;
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        {info?.tips !== null && (
          <View style={styles.tips}>
            <Text style={styles.subTitle}>Tips</Text>
            {info?.tips?.map((tip: string) => {
              return <SecondaryText key={tip}>{tip}</SecondaryText>;
            })}
          </View>
        )}
      </ScrollView>
    </Suspense>
  );
};

export default page;
