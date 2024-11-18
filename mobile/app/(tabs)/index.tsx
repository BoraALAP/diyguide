import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { supabase } from "../../utils/supabaseClient";
import GuideCard from "../../components/GuideCard";
import { Guides } from "../types/custom";
import { createClient } from "@supabase/supabase-js";
import { Searchbar } from "react-native-paper";
import SuggestionCard from "@/components/SuggestionCard";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const [guides, setGuides] = useState<Guides[]>([]);
  const [suggestions, setSuggestions] = useState<Guides[]>([
    {
      id: "12312312322",
      title: "Building a Simple Bookshelf",
      content:
        "Steps:\n1. Gather Materials: Obtain wood planks, screws, nails, a saw, and a drill.\n2. Measure and Cut: Measure the wood for the desired shelf dimensions and cut them to size.\n3. Assemble the Frame: Nail or screw the side planks to the top and bottom pieces to form a rectangular frame.\n4. Add Shelves: Attach horizontal planks inside the frame at equal distances.\n5. Sand and Finish: Sand all surfaces for smoothness and apply paint or varnish.\n\nTips:\n- Use a level to ensure the shelves are straight.\n- Pre-drill holes to prevent the wood from splitting.\n- Choose a stain or paint color that matches your room decor.",
      tags: ["woodworking", "furniture", "home improvement"],
      created_by: "AI",
      created_at: `${Date.now()}`,
    },

    {
      id: "12312312311",
      title: "Fixing a Squeaky Door",
      content:
        "Steps:\n1. Identify the Noise: Open and close the door to locate the squeaky hinge.\n2. Apply Lubricant: Use WD-40 or petroleum jelly on the hinges.\n3. Move the Door: Open and close the door several times to spread the lubricant evenly.\n4. Tighten Screws: Check hinge screws and tighten them with a screwdriver.\n\nTips:\n- If the squeak persists, remove the hinge pin and clean it with steel wool before re-lubricating.\n- Avoid using cooking oil as it can attract dust.",
      tags: ["home maintenance", "doors", "repairs"],
      created_by: "AI",
      created_at: `${Date.now()}`,
    },

    {
      id: "12312312333",
      title: "Painting a Room Like a Pro",
      content:
        "Steps:\n1. Prepare the Room: Move furniture, cover the floor with a drop cloth, and tape edges with painter’s tape.\n2. Clean the Walls: Wipe down the walls with a damp cloth to remove dust and grease.\n3. Apply Primer: Roll primer evenly across the walls and let it dry completely.\n4. Paint the Walls: Use a roller for large areas and a brush for corners. Apply two coats for even coverage.\n5. Clean Up: Remove tape carefully before the paint dries completely.\n\nTips:\n- Use a high-quality roller to avoid streaks.\n- Start painting from the ceiling and work your way down.",
      tags: ["painting", "home decor", "improvement"],
      created_by: "AI",
      created_at: `${Date.now()}`,
    },

    {
      id: "12312312344",
      title: "Installing a Ceiling Fan",
      content:
        "Steps:\n1. Turn Off Power: Shut off electricity at the circuit breaker.\n2. Remove Old Fixture: Unscrew and detach the existing light fixture, if applicable.\n3. Assemble the Fan: Follow the instructions to assemble the fan components.\n4. Mount the Bracket: Install the mounting bracket to the ceiling electrical box.\n5. Wire the Fan: Connect the wires from the fan to the corresponding wires in the ceiling box.\n6. Attach the Fan: Secure the fan to the bracket and attach the blades.\n7. Turn On Power: Restore power and test the fan.\n\nTips:\n- Ensure the electrical box is rated for ceiling fan installation.\n- Use a helper to hold the fan while wiring.",
      tags: ["electrical", "home improvement", "fans"],
      created_by: "AI",
      created_at: `${Date.now()}`,
    },

    {
      id: "12312312355",
      title: "Repairing a Cracked Smartphone Screen",
      content:
        "Steps:\n1. Buy a Screen Repair Kit: Purchase a kit that matches your phone model.\n2. Power Off the Phone: Turn off your device and remove the SIM card.\n3. Heat the Screen Edges: Use a hairdryer to soften the adhesive around the edges of the screen.\n4. Remove the Broken Screen: Gently pry the cracked screen off using the tools from the kit.\n5. Install the New Screen: Attach the new screen and secure it with the adhesive provided.\n6. Test the Phone: Turn it on to ensure the screen is functioning properly.\n\nTips:\n- Work on a clean, flat surface to avoid losing small screws.\n- Be gentle with connectors to avoid further damage.",
      tags: ["electronics", "phone repair", "DIY"],
      created_by: "AI",
      created_at: `${Date.now()}`,
    },
  ]);

  useEffect(() => {
    console.log("useEffect");

    const func = async () => {
      const { data, error } = await supabase.from("guides").select("id");

      if (error) {
        console.log("error", error);

        setError(error);
      }
      console.log("data", data);

      // setSuggestions([...data])
    };
    func();
  }, []);

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .ilike("title", `%${search}%`);

    if (error) console.error(error);
    else setGuides(data);
  };
  // if (error) {
  //   return ( <View>{error}</View>)

  // }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SuggestionCard
            guide={item}
            onPress={() => navigation.navigate("Guide", { guide: item })}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search for guides..ssss."
          value={search}
          onChangeText={setSearch}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text>Search</Text>
        </Pressable>
      </View>
      {/* <Searchbar value={search}  onChangeText={setSearch}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white", height: "100%" },
  flatlist: { padding: 24 },
  inputWrapper: {
    flex: 1,
    position: "fixed",
    bottom: 20,
    height: "auto",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, height: 40 },
  button: {
    flex: 1,
  },
});

export default HomeScreen;
