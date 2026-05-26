import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            paddingTop: 8,
          },
          default: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            paddingTop: 8,
            height: 60,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Календар',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar.badge.clock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Всі події',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}
