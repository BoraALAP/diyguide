
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GuideCard = ({ guide, onPress }: { guide: any; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{guide.title}</Text>
      <Text numberOfLines={2}>{guide.content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 10, borderWidth: 1, borderRadius: 8 },
  title: { fontWeight: 'bold', marginBottom: 5 },
});

export default GuideCard;