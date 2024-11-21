import React, { Suspense, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "@/utils/supabaseClient";

const page = () => {
  const { guide } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [info, setInfo] = useState<any>(null);

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

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{info?.title}</Text>
          <Text style={styles.description}>{info?.content}</Text>
        </View>
        <View>
          {/* {info?.tags !== null &&
            info?.tags.map((tag: string) => {
              return <Text key={tag}>{tag}</Text>;
            })} */}
        </View>
        {info?.materials !== null && (
          <View style={styles.materials}>
            <Text style={styles.subTitle}>Materials</Text>
            {info?.materials.map((material: string) => {
              return (
                <Text style={styles.smalltext} key={material}>
                  {material}
                </Text>
              );
            })}
          </View>
        )}
        {info?.tools !== null && (
          <View style={styles.tools}>
            <Text style={styles.subTitle}>Tools</Text>
            {info?.tools.map((tool: string) => {
              return (
                <Text style={styles.smalltext} key={tool}>
                  {tool}
                </Text>
              );
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
                        <Text style={styles.smalltext} key={material}>
                          {material}
                        </Text>
                      );
                    })}
                  </View>
                )}
                {step.tools.length > 0 && (
                  <View style={styles.stepTools}>
                    <Text style={styles.stepsSubTitle}>Tools</Text>
                    {step.tools.map((tool: string) => {
                      return (
                        <Text style={styles.smalltext} key={tool}>
                          {tool}
                        </Text>
                      );
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
              return (
                <Text style={styles.smalltext} key={tip}>
                  {tip}
                </Text>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Suspense>
  );
};

export default page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    rowGap: 16,
    paddingBottom: 60,
  },
  header: {
    rowGap: 8,
    padding: 24,
    backgroundColor: "#f2f2f2",
    paddingTop: 120,
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
  materials: {
    rowGap: 8,
    padding: 24,
    backgroundColor: "#f8f8f8",
  },
  tools: {
    rowGap: 8,
    padding: 24,
    backgroundColor: "#f8f8f8",
  },
  text: {
    fontSize: 16,
  },
  smalltext: {
    fontSize: 14,
    color: "#3b3b3b",
  },
  steptitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
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
    borderBottomWidth: 1,
    borderBottomColor: "#cacaca",
    paddingBottom: 16,
  },
  stepMaterials: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "#f4f4f4",
  },
  stepTools: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "#f4f4f4",
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
  tips: {
    rowGap: 8,
    marginHorizontal: 24,
    backgroundColor: "#f6f6f6",

    padding: 24,
  },
});
