import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PressableScale from '../ui/PressableScale';
import ProfileScreen from '../screens/ProfileScreen';
import KatalogScreen from '../screens/KatalogScreen';
import AkunScreen from '../screens/AkunScreen';
import { colors, radius, shadow, spacing } from '../../theme';

const Tab = createBottomTabNavigator();

const TAB_META = {
  Beranda: { label: 'Beranda', icon: 'home' },
  Katalog: { label: 'Katalog', icon: 'pricetags' },
  Akun: { label: 'Akun', icon: 'person' },
};

function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm + 2) }]}>
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        const focused = state.index === index;

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <PressableScale
            key={route.key}
            onPress={handlePress}
            accessibilityRole="tab"
            accessibilityLabel={meta.label}
            accessibilityState={{ selected: focused }}
            style={styles.tab}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Ionicons
                name={focused ? meta.icon : `${meta.icon}-outline`}
                size={20}
                color={focused ? colors.accent : colors.inkMuted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{meta.label}</Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen name="Beranda" component={ProfileScreen} />
      <Tab.Screen name="Katalog" component={KatalogScreen} />
      <Tab.Screen name="Akun" component={AkunScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.xs + 2,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.bar,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    minWidth: 82,
  },
  pillActive: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: colors.inkMuted,
    marginTop: 2,
  },
  labelActive: {
    color: colors.accent,
  },
});
