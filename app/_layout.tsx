import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { EventProvider } from '@/src/context/EventContext';
import { AppThemeProvider } from '@/src/context/ThemeContext';
import { useAppTheme } from '@/src/hooks/useAppTheme';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background }
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ presentation: 'modal', headerShown: true, title: 'Деталі події' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppThemeProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AppThemeProvider>
  );
}
