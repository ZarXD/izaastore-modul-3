import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './components/navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { PromoProvider } from './context/PromoContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PromoProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </PromoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
