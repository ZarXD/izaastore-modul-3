import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import ScreenHeader from '../ui/ScreenHeader';
import SearchField from '../ui/SearchField';
import Chip from '../ui/Chip';
import Button from '../ui/Button';
import Banner from '../ui/Banner';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../config/supabase';
import { initials } from '../../utils/format';
import { colors, radius, shadow, spacing, type } from '../../theme';

const SEMUA = 'Semua';

const TILE_TONES = [
  { bg: colors.accentSoft, fg: colors.ink },
  { bg: colors.tealSoft, fg: colors.ink },
  { bg: colors.yellowSoft, fg: colors.ink },
];

export default function PelangganScreen({ navigation }) {
  const [pelanggan, setPelanggan] = useState([]);
  const [search, setSearch] = useState('');
  const [activeKategori, setActiveKategori] = useState(SEMUA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const fetchPelanggan = useCallback(async (mode = 'load') => {
    if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from('pelanggan')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setLoadError(error.message);
    } else {
      setLoadError('');
      setPelanggan(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPelanggan('load');
    }, [fetchPelanggan])
  );

  const kategoriList = Array.from(
    new Set(pelanggan.map((item) => item.kategori).filter(Boolean))
  );

  const query = search.trim().toLowerCase();
  const hasFilter = query.length > 0 || activeKategori !== SEMUA;

  const filtered = pelanggan.filter((item) => {
    const cocokKategori = activeKategori === SEMUA || item.kategori === activeKategori;
    const teks = `${item.nama ?? ''} ${item.email ?? ''}`.toLowerCase();
    const cocokCari = !query || teks.includes(query);
    return cocokKategori && cocokCari;
  });

  const resetFilter = () => {
    setSearch('');
    setActiveKategori(SEMUA);
  };

  const renderItem = ({ item, index }) => {
    const tone = TILE_TONES[index % TILE_TONES.length];

    return (
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
          <Text style={[styles.avatarText, { color: tone.fg }]}>{initials(item.nama)}</Text>
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.nama}
          </Text>
          <Text style={styles.rowEmail} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
        {item.kategori ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {item.kategori}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const empty = loading ? (
    <View style={styles.loadingWrap}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.loadingText}>Memuat pelanggan…</Text>
    </View>
  ) : loadError ? (
    <EmptyState
      icon="cloud-offline-outline"
      title="Daftar belum termuat"
      message={loadError}
      action={<Button variant="secondary" title="Coba lagi" onPress={() => fetchPelanggan('load')} />}
    />
  ) : hasFilter ? (
    <EmptyState
      icon="search-outline"
      title="Tidak ada yang cocok"
      message="Coba kata kunci lain atau kembali ke semua kategori."
      action={<Button variant="secondary" title="Hapus filter" onPress={resetFilter} />}
    />
  ) : (
    <EmptyState
      icon="people-outline"
      title="Belum ada pelanggan"
      message="Data pelanggan yang tersimpan di database akan muncul di sini."
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Admin"
        title="Manajemen Pelanggan"
        subtitle={
          loading && pelanggan.length === 0
            ? 'Memuat pelanggan…'
            : `${pelanggan.length} pelanggan terdaftar`
        }
        onBack={() => navigation.goBack()}
      />

      <View style={styles.controls}>
        <SearchField
          value={search}
          onChangeText={setSearch}
          placeholder="Cari nama atau email…"
        />

        {kategoriList.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.chips}
            style={styles.chipsScroll}
          >
            <Chip
              label={SEMUA}
              active={activeKategori === SEMUA}
              onPress={() => setActiveKategori(SEMUA)}
            />
            {kategoriList.map((kategori) => (
              <Chip
                key={kategori}
                label={kategori}
                active={activeKategori === kategori}
                onPress={() => setActiveKategori(kategori)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          loadError && pelanggan.length > 0 ? (
            <Banner
              type="error"
              message={`Gagal memperbarui data: ${loadError}`}
              style={styles.listBanner}
            />
          ) : null
        }
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPelanggan('refresh')}
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
  controls: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  chipsScroll: {
    marginTop: spacing.md,
    marginHorizontal: -spacing.xl,
  },
  chips: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  listBanner: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  rowBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  rowTitle: {
    ...type.body,
    fontWeight: '700',
    color: colors.ink,
  },
  rowEmail: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  badge: {
    maxWidth: 108,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
