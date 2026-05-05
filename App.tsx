import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { registerForPushNotificationsAsync } from './src/utils/notifications';

const AppInner = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    registerForPushNotificationsAsync().catch(console.warn);
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ThemeProvider>
  );
}
