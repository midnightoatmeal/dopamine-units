import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { CircleDollarSign, History, Settings } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#4ade80', // Green-400
        tabBarInactiveTintColor: '#666666',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'The Bank',
          tabBarIcon: ({ color }) => <CircleDollarSign size={24} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          title: 'The Ledger',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'The Config',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tabs>
  );
}
