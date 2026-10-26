import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import Button from '../ui/Button';
import PressableScale from '../ui/PressableScale';
import { colors, radius, spacing, type } from '../../theme';

const SHORTCUTS = [
  {
    route: 'Katalog',
    icon: 'pricetags-outline',
    title: 'Katalog',
    body: 'Lihat semua produk',
    tileBg: colors.accentSoft,
    tileFg: colors.accent,
  },
  {
    route: 'Akun',
    icon: 'person-outline',
    title: 'Akun',
    body: 'Masuk sebagai admin',
    tileBg: colors.tealSoft,
    tileFg: colors.teal,
  },
];

const STEPS = [
  {
    title: 'Buka katalog',
    body: 'Semua produk tampil dengan harga yang tersimpan di toko.',
  },
  {
    title: 'Susun keranjang',
    body: 'Atur jumlah barang sebelum lanjut ke checkout.',
  },
  {
    title: 'Checkout',
    body: 'Pesanan tercatat sebagai transaksi baru di database toko.',
  },
];

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>IZ</Text>
            </View>
            <View style={styles.brandTexts}>
              <Text style={styles.overline}>Izaa Store</Text>
              <Text style={styles.brandCaption}>Komponen PC & gadget</Text>
            </View>
          </View>

          <Text style={styles.headline}>Rakit PC tanpa tebak-tebakan harga.</Text>
          <Text style={styles.lead}>
            Pilih part dari katalog, cek totalnya, lalu checkout langsung dari aplikasi.
          </Text>
        </View>

        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroTexts}>
              <Text style={styles.heroOverline}>Mulai dari sini</Text>
              <Text style={styles.heroTitle}>Pilih part, susun rakitanmu</Text>
              <Text style={styles.heroBody}>
                Harga yang kamu lihat adalah harga yang tersimpan di toko. Tanpa potongan
                kejutan.
              </Text>
            </View>
            <View style={styles.sticker}>
              <Ionicons name="hardware-chip" size={26} color={colors.ink} />
            </View>
          </View>

          <Button
            title="Buka katalog"
            icon="pricetags-outline"
            onPress={() => navigation.navigate('Katalog')}
            accessibilityHint="Membuka tab katalog produk"
          />
        </Card>

        <View style={styles.shortcuts}>
          {SHORTCUTS.map((item) => (
            <PressableScale
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              accessibilityLabel={`${item.title}, ${item.body}`}
              style={styles.shortcut}
            >
              <View style={[styles.shortcutTile, { backgroundColor: item.tileBg }]}>
                <Ionicons name={item.icon} size={19} color={item.tileFg} />
              </View>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
              <Text style={styles.shortcutBody}>{item.body}</Text>
            </PressableScale>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Cara belanja</Text>
        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepTexts}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Izaa Store · data produk dan pesanan tersimpan di toko.
        </Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandTexts: {
    flex: 1,
  },
  overline: {
    ...type.overline,
    color: colors.ink,
  },
  brandCaption: {
    ...type.caption,
    marginTop: 1,
  },
  headline: {
    ...type.display,
  },
  lead: {
    ...type.body,
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  hero: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  heroTexts: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroOverline: {
    ...type.overline,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...type.title,
    marginBottom: spacing.sm,
  },
  heroBody: {
    ...type.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  sticker: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  shortcuts: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  shortcut: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  shortcutTile: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  shortcutTitle: {
    ...type.section,
    marginBottom: 2,
  },
  shortcutBody: {
    ...type.caption,
    fontWeight: '500',
  },
  sectionTitle: {
    ...type.section,
    marginBottom: spacing.md,
  },
  steps: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.ink,
  },
  stepTexts: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  stepBody: {
    ...type.caption,
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    ...type.caption,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
