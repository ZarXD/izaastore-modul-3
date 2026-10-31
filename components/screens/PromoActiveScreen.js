import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Banner from '../ui/Banner';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import PressableScale from '../ui/PressableScale';
import ScreenHeader from '../ui/ScreenHeader';
import { usePromo } from '../../context/PromoContext';
import { colors, radius, spacing, type } from '../../theme';

export default function PromoActiveScreen({ navigation }) {
  const { promos, loading, error, fetchPromos } = usePromo();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchPromos();
    }, [fetchPromos])
  );

  const activePromos = promos.filter((promo) => promo.status === true);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPromos();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.kode} numberOfLines={1}>
          {item.kode}
        </Text>
        <View style={styles.diskonPill}>
          <Text style={styles.diskonText}>Diskon {item.diskon}%</Text>
        </View>
      </View>
      <Text style={styles.deskripsi}>{item.deskripsi}</Text>
    </Card>
  );

  const empty = loading && !refreshing ? (
    <View style={styles.loadingWrap}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.loadingText}>Memuat voucher…</Text>
    </View>
  ) : (
    <EmptyState
      icon="pricetags-outline"
      title="Belum ada voucher aktif"
      message="Voucher yang dirilis lewat menu Pemasaran akan muncul di sini."
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Voucher promo"
        subtitle="Daftar voucher yang sedang aktif."
        onBack={() => navigation.goBack()}
        right={
          <PressableScale
            onPress={handleRefresh}
            accessibilityLabel="Muat ulang voucher"
            style={styles.refreshButton}
          >
            <Ionicons name="refresh" size={19} color={colors.ink} />
          </PressableScale>
        }
      />

      <FlatList
        data={activePromos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          error ? <Banner type="error" message={error} style={styles.banner} /> : null
        }
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  banner: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  kode: {
    ...type.section,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
    color: colors.ink,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  diskonPill: {
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  diskonText: {
    ...type.caption,
    fontWeight: '800',
    color: colors.ink,
  },
  deskripsi: {
    ...type.body,
    color: colors.inkMuted,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
});
