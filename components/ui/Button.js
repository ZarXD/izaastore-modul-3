import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, radius, spacing } from '../../theme';

const TONES = {
  primary: { bg: colors.accent, fg: colors.white, border: colors.accent },
  secondary: { bg: colors.surface, fg: colors.ink, border: colors.border },
  soft: { bg: colors.accentSoft, fg: colors.accent, border: colors.accentSoft },
  ghost: { bg: 'transparent', fg: colors.inkMuted, border: 'transparent' },
  danger: { bg: colors.danger, fg: colors.white, border: colors.danger },
};

export default function Button({
  title,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const tone = TONES[variant] ?? TONES.primary;
  const isDisabled = disabled || loading;
  const label = title ?? children;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.fg} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={tone.fg}
              style={styles.icon}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              size === 'sm' ? styles.labelSm : styles.labelMd,
              { color: tone.fg },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  md: {
    minHeight: 52,
  },
  sm: {
    minHeight: 40,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  labelMd: {
    fontSize: 15,
  },
  labelSm: {
    fontSize: 13,
  },
});
