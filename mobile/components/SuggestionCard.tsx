
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SuggestionCard = ({ guide, onPress }: { guide: any; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} >
      <Text style={styles.title}>{guide.title}</Text>
      <View style={styles.tagWrapper}>

      {guide.tags.map((tag: string) => {
        return(
          
          <Text style={styles.tag} key={tag}>{tag}</Text>
        )
      })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, marginVertical: 10, borderWidth: 1, borderColor:"#f5f5f5", backgroundColor:"#f8f8f8", borderRadius: 8, width: "48%", elevation: 2, boxShadow: "1px 4px 10px 5px rgba(0,0,0,0.1)"},
  title: { fontWeight: 'bold', marginBottom: 5,  },
  tagWrapper:{flexDirection: 'row', flexWrap:"wrap", alignItems:"flex-start", gap: 4, marginTop:6},
  tag: {fontSize: 12, backgroundColor:"white", borderRadius:24, paddingVertical: 4, paddingHorizontal:8, textTransform:"capitalize", color:"#303030"}
});

export default SuggestionCard;