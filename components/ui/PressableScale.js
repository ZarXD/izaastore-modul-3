import React, { useCallback, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import useReducedMotion from '../../hooks/useReducedMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PressableScale({
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  style,
  children,
  accessibilityRole = 'button',
  ...rest
}) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const animate = useCallback(
    (toValue) => {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        speed: 42,
        bounciness: 0,
      }).start();
    },
    [scale]
  );

  return (
    <AnimatedPressable
      accessibilityRole={accessibilityRole}
      onPressIn={(event) => {
        if (!reduced) animate(scaleTo);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (!reduced) animate(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
