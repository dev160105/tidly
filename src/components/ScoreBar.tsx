import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ScoreBarProps {
  value: number;    // 0–100
  color: string;
}

export const ScoreBar = ({ value, color }: ScoreBarProps) => {
  const { theme } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, { backgroundColor: theme.surface2 }]}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
