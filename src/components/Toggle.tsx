import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export const Toggle = ({ value, onToggle }: ToggleProps) => {
  const { theme } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.surface3, theme.accent],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View style={[styles.track, { backgroundColor: bgColor }]}>
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
