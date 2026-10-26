import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, radius, spacing } from '../../theme';

export default function Chip({ label, active = false, icon, onPress, style }) {
  const fg = active ? colors.white : colors.ink;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.base, active ? styles.active : styles.idle, style]}
    >
      {icon ? (
        <Ionicons name={icon} size={13} color={fg} style={styles.icon} />
      ) : null}
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  idle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  icon: {
    marginRight: spacing.xs + 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
