import { Tabs } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faSearch, faUtensils, faUser } from '@fortawesome/free-solid-svg-icons'

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useIsAuthenticated from '@/hooks/isAuthenticated';

import Login from '@/components/Login';

const isAuthenticated = useIsAuthenticated();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  if (true) {
    return (
      <ThemedView>
        <Login />
      </ThemedView>
    )
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarLabelStyle: { textAlign: 'center' },
        tabBarIconStyle: { alignItems: 'center', justifyContent: 'center' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesomeIcon icon={faHome} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meallogs"
        options={{
          title: 'Meal Logs',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesomeIcon icon={faUtensils} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesomeIcon icon={faSearch} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesomeIcon icon={faUser} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
