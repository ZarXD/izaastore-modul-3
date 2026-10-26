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

import ScreenHeader from '../ui/ScreenHeader';
import Card from '../ui/Card';
import Field from '../ui/Field';
import Button from '../ui/Button';
import Banner from '../ui/Banner';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../config/supabase';
import { formatRupiah, initials } from '../../utils/format';
import { colors, radius, shadow, spacing, type } from '../../theme';

const TILE_TONES = [
  { bg: colors.accentSoft, fg: colors.ink },
  { bg: colors.tealSoft, fg: colors.ink },
  { bg: colors.yellowSoft, fg: colors.ink },
];

export default function ProdukScreen({ navigation }) {
  const [produk, setProduk] = useState([]);
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaProduk, setHargaProduk] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });

  const fetchProduk = useCallback(async () => {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setFeedback({ type: 'error', message: `Gagal memuat produk: ${error.message}` });
    } else {
      setProduk(data || []);
      setFeedback((prev) => (prev.type === 'error' ? { type: 'info', message: '' } : prev));
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProduk();
    }, [fetchProduk])
  );

  const handleTambahProduk = async () => {
    const nama = namaProduk.trim();
    const harga = parseInt(hargaProduk, 10);

    if (!nama || !hargaProduk) {
      setFormError('Isi nama komponen dan harganya dulu ya.');
      return;
    }

    if (!Number.isFinite(harga) || harga <= 0) {
      setFormError('Harga harus angka dan lebih dari 0.');
      return;
    }

    setFormError('');
    setSaving(true);

    const { error } = await supabase.from('produk').insert([{ nama, harga }]);

    setSaving(false);

    if (error) {
      setFeedback({ type: 'error', message: `Gagal menyimpan produk: ${error.message}` });
      return;
    }

    setFeedback({ type: 'success', message: `${nama} sudah masuk ke daftar produk.` });
    setNamaProduk('');
    setHargaProduk('');
    fetchProduk();
  };

  const header = (
    <View>
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>Tambah produk</Text>
        <Text style={styles.cardHint}>
          Produk yang disimpan di sini langsung tampil di katalog pelanggan.
        </Text>

        <Field
          label="Nama komponen"
          icon="cube-outline"
          placeholder="Contoh: SSD NVMe 1TB"
          value={namaProduk}
          onChangeText={(text) => {
            setNamaProduk(text);
            if (formError) setFormError('');
          }}
          autoCapitalize="words"
          returnKeyType="next"
          style={styles.field}
        />

        <Field
          label="Harga"
          icon="pricetag-outline"
          placeholder="Contoh: 1250000"
          value={hargaProduk}
          onChangeText={(text) => {
            setHargaProduk(text.replace(/\D/g, ''));
            if (formError) setFormError('');
          }}
          keyboardType="number-pad"
          hint={
            hargaProduk
              ? formatRupiah(parseInt(hargaProduk, 10))
              : 'Angka saja, tanpa titik atau Rp.'
          }
          error={formError}
          style={styles.field}
        />

        <Button
          title="Simpan produk"
          icon="add-circle-outline"
          onPress={handleTambahProduk}
          loading={saving}
          disabled={saving}
        />

        {feedback.message ? (
          <Banner type={feedback.type} message={feedback.message} style={styles.banner} />
        ) : null}
      </Card>

      <Text style={styles.listLabel}>Daftar produk</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const tone = TILE_TONES[index % TILE_TONES.length];

    return (
      <View style={styles.row}>
        <View style={[styles.tile, { backgroundColor: tone.bg }]}>
          <Text style={[styles.tileText, { color: tone.fg }]}>{initials(item.nama)}</Text>
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {item.nama}
          </Text>
          <Text style={styles.rowMeta}>ID #{item.id}</Text>
        </View>
        <Text style={styles.rowPrice}>{formatRupiah(item.harga)}</Text>
      </View>
    );
  };

  const empty = loading ? (
    <View style={styles.loadingWrap}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.loadingText}>Memuat produk…</Text>
    </View>
  ) : (
    <EmptyState
      icon="cube-outline"
      title="Belum ada produk"
      message="Tambahkan komponen pertama lewat formulir di atas. Daftar ini juga yang dipakai di katalog."
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Admin"
        title="Manajemen Produk"
        subtitle={
          loading ? 'Memuat produk…' : `${produk.length} produk terdaftar`
        }
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={produk}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && produk.length > 0}
            onRefresh={fetchProduk}
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
  formCard: {
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...type.section,
    color: colors.ink,
  },
  cardHint: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  banner: {
    marginTop: spacing.md,
  },
  listLabel: {
    ...type.overline,
    color: colors.inkMuted,
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
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tileText: {
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
  rowMeta: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  rowPrice: {
    ...type.body,
    fontWeight: '800',
    color: colors.accent,
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
