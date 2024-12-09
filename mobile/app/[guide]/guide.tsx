import React, { Suspense, useState, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabaseClient";
import {
  PageTitle,
  ScrollViewT,
  SecondaryText,
  TextT,
} from "@/components/Themed";
import Colors from "@/constants/Colors";
import Loading from "@/components/Loading";

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
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
    },
    materials: {
      rowGap: 8,
      padding: 24,
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
    },
    tools: {
      rowGap: 8,
      padding: 24,
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
    },
    stepMaterials: {
      rowGap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
    },
    stepTools: {
      rowGap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
    },
    tips: {
      rowGap: 8,
      marginHorizontal: 24,
      borderRadius: 12,
      backgroundColor: Colors[colorScheme ?? "light"].sectionBackground,
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

export default function GuidePage() {
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

  const styles = getThemedStyles(colorScheme ?? "light");

  return (
    <Suspense fallback={<Loading />}>
      <ScrollViewT contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <PageTitle>{info?.title}</PageTitle>
          <TextT>{info?.content}</TextT>
        </View>
        <View></View>

        {info?.materials !== null && (
          <View style={styles.materials}>
            <TextT style={styles.subTitle}>Materials</TextT>
            {info?.materials.map((material: string) => {
              return <SecondaryText key={material}>{material}</SecondaryText>;
            })}
          </View>
        )}
        {info?.tools !== null && (
          <View style={styles.tools}>
            <TextT style={styles.subTitle}>Tools</TextT>
            {info?.tools.map((tool: string) => {
              return <SecondaryText key={tool}>{tool}</SecondaryText>;
            })}
          </View>
        )}
        <View style={styles.steps}>
          <TextT style={styles.subTitle}>Steps</TextT>
          {info?.steps.map((step: any) => {
            return (
              <View key={step.step} style={styles.stepContainer}>
                <View style={styles.step}>
                  <TextT style={styles.stepNumber}>{step.step}.</TextT>
                  <TextT style={styles.steptitle}>{step.description}</TextT>
                </View>
                {step.materials.length > 0 && (
                  <View style={styles.stepMaterials}>
                    <TextT style={styles.stepsSubTitle}>Materials</TextT>
                    {step.materials.map((material: string) => {
                      return (
                        <SecondaryText key={material}>{material}</SecondaryText>
                      );
                    })}
                  </View>
                )}
                {step.tools.length > 0 && (
                  <View style={styles.stepTools}>
                    <TextT style={styles.stepsSubTitle}>Tools</TextT>
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
            <TextT style={styles.subTitle}>Tips</TextT>
            {info?.tips?.map((tip: string) => {
              return <SecondaryText key={tip}>{tip}</SecondaryText>;
            })}
          </View>
        )}
      </ScrollViewT>
    </Suspense>
  );
}
