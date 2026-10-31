import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import ProdukScreen from '../screens/ProdukScreen';
import PelangganScreen from '../screens/PelangganScreen';
import PemasaranScreen from '../screens/PemasaranScreen';
import PromoActiveScreen from '../screens/PromoActiveScreen';
import DashboardReportScreen from '../screens/DashboardReportScreen';
import DetailTransaksiScreen from '../screens/DetailTransaksiScreen';
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
        <Stack.Screen name="Pemasaran" component={PemasaranScreen} />
        <Stack.Screen name="Voucher Promo" component={PromoActiveScreen} />
        <Stack.Screen name="Laporan Penjualan" component={DashboardReportScreen} />
        <Stack.Screen name="Riwayat Transaksi" component={DetailTransaksiScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
