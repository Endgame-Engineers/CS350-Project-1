import { Image, StyleSheet, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText style={styles.title}>Home Page</ThemedText>
      <Image
      source={require('@/assets/images/splash.png')}
      style={{ width: 305, height: 159 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
