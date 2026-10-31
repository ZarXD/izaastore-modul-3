import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Banner from '../ui/Banner';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Field from '../ui/Field';
import ScreenHeader from '../ui/ScreenHeader';
import { usePromo } from '../../context/PromoContext';
import { colors, spacing, type } from '../../theme';

export default function PemasaranScreen({ navigation }) {
  const { addPromo, error } = usePromo();

  const [kode, setKode] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [diskon, setDiskon] = useState('');
  const [formError, setFormError] = useState('');
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });
  const [saving, setSaving] = useState(false);

  const banner = feedback.message
    ? feedback
    : error
      ? { type: 'error', message: error }
      : { type: 'info', message: '' };

  const handleRilisVoucher = async () => {
    const nilaiDiskon = parseInt(diskon, 10);

    if (!kode.trim() || !deskripsi.trim() || !diskon.trim()) {
      setFormError('Isi kode, deskripsi, dan besar diskon dulu ya.');
      return;
    }

    if (!Number.isFinite(nilaiDiskon) || nilaiDiskon < 1 || nilaiDiskon > 100) {
      setFormError('Diskon harus angka 1 sampai 100.');
      return;
    }

    setFormError('');
    setSaving(true);

    const data = await addPromo({
      kode: kode.toUpperCase().trim(),
      deskripsi: deskripsi.trim(),
      diskon: nilaiDiskon,
      status: true,
    });

    setSaving(false);

    if (!data) {
      setFeedback({
        type: 'error',
        message: 'Voucher gagal dirilis. Periksa koneksi lalu coba lagi.',
      });
      return;
    }

    setKode('');
    setDeskripsi('');
    setDiskon('');
    setFeedback({
      type: 'success',
      message: `Voucher ${data.kode} sudah aktif di daftar promo.`,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        overline="Admin"
        title="Pemasaran"
        subtitle="Rilis voucher diskon untuk pelanggan."
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={styles.cardTitle}>Voucher baru</Text>
          <Text style={styles.cardHint}>
            Voucher yang dirilis di sini langsung tampil di daftar promo pelanggan.
          </Text>

          <Field
            label="Kode voucher"
            icon="pricetags-outline"
            placeholder="Contoh: IZAAHEMAT"
            value={kode}
            onChangeText={(text) => {
              setKode(text);
              if (formError) setFormError('');
            }}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.field}
          />

          <Field
            label="Deskripsi"
            icon="document-text-outline"
            placeholder="Contoh: Potongan untuk semua produk"
            value={deskripsi}
            onChangeText={(text) => {
              setDeskripsi(text);
              if (formError) setFormError('');
            }}
            multiline
            inputStyle={styles.multiline}
            style={styles.field}
          />

          <Field
            label="Besar diskon"
            icon="percent-outline"
            placeholder="Contoh: 10"
            value={diskon}
            onChangeText={(text) => {
              setDiskon(text.replace(/\D/g, ''));
              if (formError) setFormError('');
            }}
            keyboardType="number-pad"
            hint="Angka 1–100, tanpa tanda %."
            error={formError}
            style={styles.field}
          />

          <Button
            title="Rilis voucher"
            icon="megaphone-outline"
            onPress={handleRilisVoucher}
            loading={saving}
            disabled={saving}
          />

          {banner.message ? (
            <Banner type={banner.type} message={banner.message} style={styles.banner} />
          ) : null}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Lihat voucher aktif"
            variant="secondary"
            icon="pricetags-outline"
            onPress={() => navigation.navigate('Voucher Promo')}
          />
        </View>
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
  multiline: {
    height: 88,
    textAlignVertical: 'top',
  },
  banner: {
    marginTop: spacing.md,
  },
  actions: {
    marginTop: spacing.lg,
  },
});
