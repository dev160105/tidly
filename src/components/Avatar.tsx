import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  fontSize?: number;
}

export const Avatar = ({ initials, color, size = 40, fontSize = 14 }: AvatarProps) => {
  const bgColor = color + '22';

  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size * 0.28, backgroundColor: bgColor }
    ]}>
      <Text style={[styles.text, { color, fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
