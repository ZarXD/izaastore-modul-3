import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import ProdukScreen from '../screens/ProdukScreen';
import PelangganScreen from '../screens/PelangganScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Manajemen Produk" component={ProdukScreen} />
        <Stack.Screen name="Manajemen Pelanggan" component={PelangganScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
