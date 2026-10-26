import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Button from '../ui/Button';
import PressableScale from '../ui/PressableScale';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, type } from '../../theme';

const MENU = [
  {
    route: 'Manajemen Produk',
    icon: 'cube-outline',
    title: 'Manajemen produk',
    body: 'Tambah produk baru dan lihat daftar harga yang tersimpan.',
    tileBg: colors.accentSoft,
    tileFg: colors.accent,
  },
  {
    route: 'Manajemen Pelanggan',
    icon: 'people-outline',
    title: 'Manajemen pelanggan',
    body: 'Lihat member terdaftar beserta kategori dan emailnya.',
    tileBg: colors.tealSoft,
    tileFg: colors.teal,
  },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { userEmail, signOut } = useAuth();
  const displayName = (userEmail || 'Admin Izaa').split('@')[0];

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.overline}>Panel admin</Text>
      <Text style={styles.greeting}>Halo, {displayName}</Text>
      <Text style={styles.lead}>
        Kelola katalog dan pelanggan Izaa Store dari satu tempat.
      </Text>

      <View style={styles.menu}>
        {MENU.map((item) => (
          <PressableScale
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            accessibilityLabel={item.title}
            accessibilityHint={item.body}
            style={styles.card}
          >
            <View style={[styles.tile, { backgroundColor: item.tileBg }]}>
              <Ionicons name={item.icon} size={21} color={item.tileFg} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </PressableScale>
        ))}
      </View>

      <View style={styles.session}>
        <Text style={styles.sessionLabel}>Masuk sebagai</Text>
        <Text style={styles.sessionValue} numberOfLines={1}>
          {userEmail}
        </Text>
      </View>

      <Button
        title="Keluar dari mode admin"
        variant="secondary"
        icon="log-out-outline"
        onPress={signOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  overline: {
    ...type.overline,
    marginBottom: spacing.xs,
  },
  greeting: {
    ...type.display,
    fontSize: 28,
    lineHeight: 33,
  },
  lead: {
    ...type.body,
    marginTop: spacing.xs + 2,
    marginBottom: spacing.xl,
  },
  menu: {
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...type.section,
    marginBottom: 2,
  },
  cardBody: {
    ...type.caption,
  },
  session: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sessionLabel: {
    ...type.overline,
    marginBottom: 2,
  },
  sessionValue: {
    ...type.section,
    fontSize: 14,
  },
});
