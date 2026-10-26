import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';

const VARIANTS = {
  success: {
    bg: colors.tealSoft,
    fg: colors.teal,
    icon: 'checkmark-circle',
  },
  error: {
    bg: colors.dangerSoft,
    fg: colors.danger,
    icon: 'alert-circle',
  },
  info: {
    bg: colors.surfaceMuted,
    fg: colors.ink,
    icon: 'information-circle',
  },
};

export default function Banner({ type = 'info', message, style }) {
  if (!message) return null;

  const variant = VARIANTS[type] ?? VARIANTS.info;

  return (
    <View
      accessibilityRole="alert"
      style={[styles.base, { backgroundColor: variant.bg }, style]}
    >
      <Ionicons name={variant.icon} size={18} color={variant.fg} style={styles.icon} />
      <Text style={[styles.text, { color: variant.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});
