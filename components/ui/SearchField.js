import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, radius, spacing } from '../../theme';

export default function SearchField({ value, onChangeText, placeholder = 'Cari…', style }) {
  return (
    <View style={[styles.box, style]}>
      <Ionicons name="search" size={18} color={colors.inkMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <PressableScale
          onPress={() => onChangeText('')}
          accessibilityLabel="Hapus pencarian"
          hitSlop={8}
          style={styles.clear}
        >
          <Ionicons name="close" size={15} color={colors.ink} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  clear: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
