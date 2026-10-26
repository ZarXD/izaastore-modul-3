import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import ScreenHeader from '../ui/ScreenHeader';
import SearchField from '../ui/SearchField';
import EmptyState from '../ui/EmptyState';
import Banner from '../ui/Banner';
import Button from '../ui/Button';
import PressableScale from '../ui/PressableScale';
import { supabase } from '../../config/supabase';
import { formatRupiah, initials } from '../../utils/format';
import { colors, radius, shadow, spacing, type } from '../../theme';

const TILE_TONES = [
  { bg: colors.accentSoft, fg: colors.ink },
  { bg: colors.tealSoft, fg: colors.ink },
  { bg: colors.yellowSoft, fg: colors.ink },
];

export default function KatalogScreen() {
  const insets = useSafeAreaInsets();

  const [produkList, setProdukList] = useState([]);
  const [keranjang, setKeranjang] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const loadedOnce = useRef(false);

  const fetchProduk = useCallback(async () => {
    const silent = loadedOnce.current;
    try {
      if (!silent) setLoading(true);
      setLoadError('');
      const { data, error } = await supabase
        .from('produk')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      setProdukList(data || []);
    } catch (err) {
      setLoadError(
        err?.message ? `Gagal memuat produk: ${err.message}` : 'Gagal memuat produk.'
      );
    } finally {
      loadedOnce.current = true;
      if (!silent) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProduk();
    }, [fetchProduk])
  );

  const filteredData = produkList.filter((item) =>
    String(item.nama ?? '')
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const tambahKeKeranjang = (produk) => {
    setKeranjang((prev) => {
      const index = prev.findIndex((item) => item.id === produk.id);
      if (index === -1) return [...prev, { ...produk, qty: 1 }];
      return prev.map((item, i) => (i === index ? { ...item, qty: item.qty + 1 } : item));
    });
  };

  const tambahQty = (produkId) => {
    setKeranjang((prev) =>
      prev.map((item) => (item.id === produkId ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const kurangiQty = (produkId) => {
    setKeranjang((prev) =>
      prev
        .map((item) => (item.id === produkId ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const totalItem = keranjang.reduce((acc, item) => acc + item.qty, 0);
  const totalHarga = keranjang.reduce((acc, item) => acc + item.harga * item.qty, 0);

  const openSheet = () => {
    setCheckoutError('');
    setModalVisible(true);
  };

  const closeSheet = () => {
    setModalVisible(false);
    setCheckoutError('');
  };

  const handleCheckout = async () => {
    if (keranjang.length === 0 || checkingOut) return;

    try {
      setCheckingOut(true);
      setCheckoutError('');

      const { data: trxData, error: trxError } = await supabase
        .from('transaksi')
        .insert([{ total_harga: totalHarga }])
        .select()
        .single();
      if (trxError) throw trxError;

      const detailPayload = keranjang.map((item) => ({
        transaksi_id: trxData.id,
        produk_id: item.id,
        jumlah: item.qty,
        subtotal: item.harga * item.qty,
      }));

      const { error: detailError } = await supabase
        .from('detail_transaksi')
        .insert(detailPayload);
      if (detailError) throw detailError;

      setReceipt({ id: trxData.id, total: totalHarga, items: totalItem });
      setKeranjang([]);
      closeSheet();
    } catch (err) {
      setCheckoutError(
        err?.message ? `Checkout gagal: ${err.message}` : 'Checkout gagal. Coba lagi.'
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const renderProduk = ({ item, index }) => {
    const tone = TILE_TONES[index % TILE_TONES.length];
    const inCart = keranjang.find((entry) => entry.id === item.id);

    return (
      <PressableScale
        onPress={() => tambahKeKeranjang(item)}
        accessibilityLabel={`Tambah ${item.nama} ke keranjang`}
        accessibilityHint="Menambah satu barang"
        style={styles.product}
      >
        <View style={[styles.productTile, { backgroundColor: tone.bg }]}>
          <Text style={[styles.productTileText, { color: tone.fg }]}>
            {initials(item.nama)}
          </Text>
        </View>

        <View style={styles.productTexts}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.nama}
          </Text>
          <View style={styles.productMeta}>
            <Text style={styles.productPrice}>{formatRupiah(item.harga)}</Text>
            {inCart ? (
              <View style={styles.inCart}>
                <Text style={styles.inCartText}>{inCart.qty} di keranjang</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.addButton}>
          <Ionicons name="add" size={20} color={colors.accent} />
        </View>
      </PressableScale>
    );
  };

  const listHeader = (
    <>
      {loadError ? (
        <Banner type="error" message={loadError} style={styles.headerBlock} />
      ) : null}

      {receipt ? (
        <View style={styles.receipt}>
          <View style={styles.receiptIcon}>
            <Ionicons name="checkmark" size={16} color={colors.white} />
          </View>
          <View style={styles.receiptTexts}>
            <Text style={styles.receiptTitle}>Pesanan tercatat</Text>
            <Text style={styles.receiptBody}>
              #INV-{receipt.id} · {receipt.items} barang · {formatRupiah(receipt.total)}
            </Text>
          </View>
          <PressableScale
            onPress={() => setReceipt(null)}
            accessibilityLabel="Tutup nota"
            hitSlop={8}
            style={styles.receiptClose}
          >
            <Ionicons name="close" size={15} color={colors.teal} />
          </PressableScale>
        </View>
      ) : null}
    </>
  );

  const listEmpty = loadError ? (
    <EmptyState
      icon="cloud-offline-outline"
      title="Produk belum termuat"
      message="Periksa koneksi, lalu coba muat ulang."
      action={<Button title="Coba lagi" variant="secondary" icon="refresh" onPress={fetchProduk} />}
    />
  ) : search.trim() ? (
    <EmptyState
      icon="search-outline"
      title="Tidak ada yang cocok"
      message={`Tidak ada produk dengan kata "${search.trim()}".`}
      action={
        <Button
          title="Hapus pencarian"
          variant="secondary"
          icon="close"
          onPress={() => setSearch('')}
        />
      }
    />
  ) : (
    <EmptyState
      icon="cube-outline"
      title="Belum ada produk"
      message="Produk yang ditambahkan admin lewat tab Akun akan muncul di sini."
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Izaa Store"
        title="Katalog"
        subtitle={loading ? 'Memuat produk…' : `${produkList.length} produk tersedia`}
      />

      <View style={styles.searchWrap}>
        <SearchField
          value={search}
          onChangeText={setSearch}
          placeholder="Cari produk…"
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.loadingText}>Memuat produk…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduk}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <View style={styles.cartBar}>
        <View style={styles.cartBarTexts}>
          <Text style={styles.cartBarLabel}>{totalItem} barang</Text>
          <Text style={styles.cartBarTotal}>{formatRupiah(totalHarga)}</Text>
        </View>
        <PressableScale
          onPress={openSheet}
          disabled={totalItem === 0}
          accessibilityRole="button"
          accessibilityLabel={`Buka keranjang, ${totalItem} barang, ${formatRupiah(totalHarga)}`}
          accessibilityState={{ disabled: totalItem === 0 }}
          style={[styles.cartBarButton, totalItem === 0 && styles.cartBarButtonDisabled]}
        >
          <Ionicons name="cart-outline" size={17} color={colors.white} />
          <Text style={styles.cartBarButtonText}>Keranjang</Text>
        </PressableScale>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeSheet}
            accessibilityLabel="Tutup keranjang"
          />

          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleWrap}>
                <Text style={styles.sheetTitle}>Keranjang</Text>
                <Text style={styles.sheetSubtitle}>
                  {totalItem} barang · {formatRupiah(totalHarga)}
                </Text>
              </View>
              <PressableScale
                onPress={closeSheet}
                accessibilityLabel="Tutup keranjang"
                hitSlop={8}
                style={styles.sheetClose}
              >
                <Ionicons name="close" size={18} color={colors.ink} />
              </PressableScale>
            </View>

            {checkoutError ? (
              <Banner type="error" message={checkoutError} style={styles.sheetBanner} />
            ) : null}

            {keranjang.length === 0 ? (
              <EmptyState
                icon="cart-outline"
                title="Keranjang masih kosong"
                message="Tambahkan produk dari katalog untuk mulai checkout."
                style={styles.sheetEmpty}
              />
            ) : (
              <ScrollView
                style={styles.sheetList}
                contentContainerStyle={styles.sheetListContent}
                showsVerticalScrollIndicator={false}
              >
                {keranjang.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.cartItemTexts}>
                      <Text style={styles.cartItemName} numberOfLines={2}>
                        {item.nama}
                      </Text>
                      <Text style={styles.cartItemMeta}>
                        {formatRupiah(item.harga)} × {item.qty} ={' '}
                        {formatRupiah(item.harga * item.qty)}
                      </Text>
                    </View>

                    <View style={styles.stepper}>
                      <PressableScale
                        onPress={() => kurangiQty(item.id)}
                        accessibilityLabel={
                          item.qty === 1 ? `Hapus ${item.nama}` : `Kurangi ${item.nama}`
                        }
                        hitSlop={6}
                        style={styles.stepButton}
                      >
                        <Ionicons
                          name={item.qty === 1 ? 'trash-outline' : 'remove'}
                          size={16}
                          color={colors.ink}
                        />
                      </PressableScale>
                      <Text style={styles.stepQty}>{item.qty}</Text>
                      <PressableScale
                        onPress={() => tambahQty(item.id)}
                        accessibilityLabel={`Tambah ${item.nama}`}
                        hitSlop={6}
                        style={styles.stepButton}
                      >
                        <Ionicons name="add" size={16} color={colors.ink} />
                      </PressableScale>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.sheetFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatRupiah(totalHarga)}</Text>
              </View>
              <Button
                title="Checkout"
                icon="checkmark-circle-outline"
                loading={checkingOut}
                disabled={keranjang.length === 0}
                onPress={handleCheckout}
              />
              <Text style={styles.sheetNote}>
                Checkout menyimpan transaksi baru ke database toko.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxxl,
  },
  loadingText: {
    ...type.caption,
    marginTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerBlock: {
    marginBottom: spacing.md,
  },
  receipt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  receiptIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  receiptTexts: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.teal,
    letterSpacing: -0.2,
  },
  receiptBody: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.teal,
    marginTop: 1,
  },
  receiptClose: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  productTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productTileText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  productTexts: {
    flex: 1,
    paddingRight: spacing.md,
  },
  productName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 3,
  },
  productPrice: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.accent,
  },
  inCart: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  inCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.yellow,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    ...shadow.lifted,
  },
  cartBarTexts: {
    flex: 1,
  },
  cartBarLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.ink,
  },
  cartBarTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.3,
    marginTop: 1,
  },
  cartBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.lg,
  },
  cartBarButtonDisabled: {
    opacity: 0.5,
  },
  cartBarButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
    marginLeft: spacing.xs + 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(32, 26, 23, 0.42)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    maxHeight: '88%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  sheetTitleWrap: {
    flex: 1,
  },
  sheetTitle: {
    ...type.title,
  },
  sheetSubtitle: {
    ...type.caption,
    marginTop: 2,
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBanner: {
    marginBottom: spacing.md,
  },
  sheetEmpty: {
    paddingVertical: spacing.xl,
  },
  sheetList: {
    flexShrink: 1,
  },
  sheetListContent: {
    paddingBottom: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartItemTexts: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  cartItemMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkMuted,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 3,
  },
  stepButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQty: {
    minWidth: 26,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  sheetFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkMuted,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  sheetNote: {
    ...type.caption,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
