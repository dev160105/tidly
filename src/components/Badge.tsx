import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type BadgeVariant = 'overdue' | 'today' | 'soon' | 'done' | 'upcoming';

interface BadgeProps {
  variant: BadgeVariant;
}

export const Badge = ({ variant }: BadgeProps) => {
  const { theme } = useTheme();

  const config = {
    overdue: { label: 'OVERDUE', bg: theme.redLight, color: theme.red },
    today:   { label: 'TODAY',   bg: theme.accentLight, color: theme.accent },
    soon:    { label: 'SOON',    bg: theme.yellowLight, color: theme.yellow },
    done:    { label: 'DONE',    bg: theme.greenLight, color: theme.green },
    upcoming:{ label: 'UPCOMING',bg: theme.surface2, color: theme.textSecondary },
  };

  const c = config[variant];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.label, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
