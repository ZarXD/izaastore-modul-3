import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme';

export default function Card({ children, style, padded = true }) {
  return (
    <View style={[styles.base, padded && styles.padded, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: {
    padding: spacing.lg,
  },
});
