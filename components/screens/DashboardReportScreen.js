import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import Banner from '../ui/Banner';
import Card from '../ui/Card';
import ScreenHeader from '../ui/ScreenHeader';
import { supabase } from '../../config/supabase';
import { formatRupiah } from '../../utils/format';
import { colors, radius, spacing, type } from '../../theme';

const EMPTY_METRICS = {
  totalPendapatan: 0,
  totalTransaksi: 0,
  rataRata: 0,
};

export default function DashboardReportScreen({ navigation }) {
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchLaporan = useCallback(async () => {
    const { data, error: fetchError } = await supabase.from('transaksi').select('*');

    if (fetchError) {
      setError(`Gagal memuat laporan: ${fetchError.message}`);
      return;
    }

    const rows = data ?? [];
    const totalPendapatan = rows.reduce(
      (sum, row) => sum + (Number(row.total_harga) || 0),
      0
    );
    const totalTransaksi = rows.length;

    setError('');
    setMetrics({
      totalPendapatan,
      totalTransaksi,
      rataRata: totalTransaksi > 0 ? totalPendapatan / totalTransaksi : 0,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchLaporan().finally(() => {
        if (active) setLoading(false);
      });

      return () => {
        active = false;
      };
    }, [fetchLaporan])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLaporan();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Admin"
        title="Laporan penjualan"
        subtitle="Ringkasan transaksi yang tersimpan."
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Menghitung laporan…</Text>
          </View>
        ) : (
          <>
            {error ? <Banner type="error" message={error} style={styles.banner} /> : null}

            <Card style={styles.hero}>
              <Text style={styles.heroOverline}>Total pendapatan</Text>
              <Text
                style={styles.heroValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatRupiah(metrics.totalPendapatan)}
              </Text>
              <Text style={styles.heroCaption}>
                Diperbarui setiap kali layar dibuka atau ditarik ke bawah.
              </Text>
            </Card>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statOverline}>Transaksi</Text>
                <Text style={styles.statValue}>{metrics.totalTransaksi}</Text>
                <Text style={styles.statCaption}>Pesanan tercatat</Text>
              </Card>

              <Card style={styles.statCard}>
                <Text style={[styles.statOverline, styles.statOverlineAccent]}>
                  Rata-rata
                </Text>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                  {formatRupiah(Math.round(metrics.rataRata))}
                </Text>
                <Text style={styles.statCaption}>Per transaksi</Text>
              </Card>
            </View>

            <View style={styles.note}>
              <Text style={styles.noteText}>
                Angka diambil langsung dari tabel transaksi di database toko. Laporan ini
                tidak menghitung pesanan yang belum checkout.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  banner: {
    marginBottom: spacing.md,
  },
  hero: {
    marginBottom: spacing.md,
  },
  heroOverline: {
    ...type.overline,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  heroValue: {
    ...type.display,
    fontSize: 30,
    lineHeight: 35,
    color: colors.ink,
  },
  heroCaption: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  statOverline: {
    ...type.overline,
    color: colors.teal,
    marginBottom: spacing.sm,
  },
  statOverlineAccent: {
    color: colors.accent,
  },
  statValue: {
    ...type.title,
    fontSize: 19,
    lineHeight: 24,
    color: colors.ink,
  },
  statCaption: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  note: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  noteText: {
    ...type.caption,
    fontWeight: '500',
    lineHeight: 19,
    color: colors.inkMuted,
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
