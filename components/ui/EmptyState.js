import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '../../theme';

export default function EmptyState({ icon = 'cube-outline', title, message, action, style }) {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={26} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...type.section,
    textAlign: 'center',
    marginBottom: spacing.xs + 2,
  },
  message: {
    ...type.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
