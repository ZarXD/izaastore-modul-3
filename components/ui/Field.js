import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';

export default function Field({
  label,
  icon,
  error,
  hint,
  onFocus,
  onBlur,
  style,
  inputStyle,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.box,
          focused && styles.boxFocused,
          hasError && styles.boxError,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={hasError ? colors.danger : colors.inkMuted}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.inkMuted}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
      </View>
      {hasError ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxFocused: {
    borderColor: colors.accent,
  },
  boxError: {
    borderColor: colors.danger,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  error: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.danger,
    marginTop: spacing.xs + 2,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.inkMuted,
    marginTop: spacing.xs + 2,
  },
});
