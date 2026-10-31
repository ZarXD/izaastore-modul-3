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
import { useFocusEffect } from '@react-navigation/native';

import Banner from '../ui/Banner';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import ScreenHeader from '../ui/ScreenHeader';
import { supabase } from '../../config/supabase';
import { formatDateTime, formatRupiah } from '../../utils/format';
import { colors, spacing, type } from '../../theme';

export default function DetailTransaksiScreen({ navigation }) {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchTransaksi = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('transaksi')
      .select('*')
      .order('id', { ascending: false });

    if (fetchError) {
      setError(`Gagal memuat transaksi: ${fetchError.message}`);
      return;
    }

    setError('');
    setTransaksi(data ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchTransaksi().finally(() => {
        if (active) setLoading(false);
      });

      return () => {
        active = false;
      };
    }, [fetchTransaksi])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransaksi();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>Transaksi #{item.id}</Text>
        <Text style={styles.cardTime}>{formatDateTime(item.created_at)}</Text>
      </View>
      <Text style={styles.cardTotal}>{formatRupiah(item.total_harga)}</Text>
    </Card>
  );

  const empty = loading && !refreshing ? (
    <View style={styles.loadingWrap}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.loadingText}>Memuat transaksi…</Text>
    </View>
  ) : (
    <EmptyState
      icon="receipt-outline"
      title="Belum ada transaksi"
      message="Transaksi dari checkout katalog akan tercatat di sini."
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Admin"
        title="Riwayat transaksi"
        subtitle="Semua pesanan yang sudah checkout."
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={transaksi}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cardTitle: {
    ...type.section,
    marginBottom: 2,
  },
  cardTime: {
    ...type.caption,
    color: colors.inkMuted,
  },
  cardTotal: {
    ...type.section,
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.ink,
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
