import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, radius, spacing, type } from '../../theme';

export default function ScreenHeader({ title, subtitle, overline, onBack, right, style }) {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.row}>
        {onBack ? (
          <PressableScale
            onPress={onBack}
            accessibilityLabel="Kembali"
            hitSlop={8}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={19} color={colors.ink} />
          </PressableScale>
        ) : null}
        <View style={styles.texts}>
          {overline ? <Text style={styles.overline}>{overline}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  texts: {
    flex: 1,
  },
  overline: {
    ...type.overline,
    marginBottom: 2,
  },
  title: {
    ...type.title,
  },
  subtitle: {
    ...type.body,
    marginTop: 2,
  },
  right: {
    marginLeft: spacing.md,
  },
});
