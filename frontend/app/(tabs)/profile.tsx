import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, Image, Platform } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Profile() {
  return (
    <ThemedView>
      <ThemedText style={styles.title}>Explore</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});