import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../ui/Button';
import Field from '../ui/Field';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, type } from '../../theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const trimmed = email.trim();

    if (!trimmed) {
      setError('Isi email atau nama admin dulu ya.');
      return;
    }

    setError('');
    signIn(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={13} color={colors.accent} />
            <Text style={styles.badgeText}>Mode demo</Text>
          </View>

          <Text style={styles.title}>Masuk ke panel toko</Text>
          <Text style={styles.body}>
            Pakai email atau nama apa pun untuk membuka manajemen produk dan pelanggan.
          </Text>

          <Field
            label="Email / nama admin"
            icon="person-outline"
            placeholder="mis. admin@izaastore.id"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
            error={error}
            style={styles.field}
          />

          <Button
            title="Masuk sebagai admin"
            icon="arrow-forward"
            onPress={handleLogin}
            style={styles.button}
          />

          <View style={styles.note}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.inkMuted}
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              Tidak ada kata sandi. Sesi ini hanya untuk demo dan hilang saat aplikasi ditutup.
            </Text>
          </View>
        </Card>

        <Text style={styles.footer}>
          Katalog dan checkout tetap bisa dipakai tanpa masuk.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  badgeText: {
    ...type.overline,
    color: colors.accent,
    marginLeft: spacing.xs + 1,
  },
  title: {
    ...type.title,
    fontSize: 23,
    lineHeight: 29,
    marginBottom: spacing.xs + 2,
  },
  body: {
    ...type.body,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  button: {
    marginBottom: spacing.lg,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: spacing.xs + 2,
    marginTop: 1,
  },
  noteText: {
    ...type.caption,
    flex: 1,
  },
  footer: {
    ...type.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
