import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../ui/ScreenHeader';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

export default function AkunScreen() {
  const { userEmail } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Izaa Store"
        title="Akun"
        subtitle={userEmail ? 'Mode admin aktif' : 'Masuk untuk mengelola toko'}
      />
      <View style={styles.body}>
        {userEmail ? <DashboardScreen /> : <LoginScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
  },
});
