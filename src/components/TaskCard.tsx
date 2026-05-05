import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, Member } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getTaskStatusLabel, getMemberById } from '../utils/helpers';
import { Radius, Spacing } from '../constants/theme';

const CATEGORY_STYLE: Record<string, { bg: string; iconColor: string }> = {
  kitchen:  { bg: '#FFF0E8', iconColor: '#FF6B6B' },
  bathroom: { bg: '#E8F4FF', iconColor: '#60A5FA' },
  living:   { bg: '#F0EEFF', iconColor: '#A78BFA' },
  outdoor:  { bg: '#E8FFF5', iconColor: '#3ECFA0' },
  laundry:  { bg: '#FFFAE8', iconColor: '#FFB347' },
  shopping: { bg: '#E8FFF5', iconColor: '#3ECFA0' },
  other:    { bg: '#F5F5F5', iconColor: '#999999' },
};

const DARK_CATEGORY_STYLE: Record<string, { bg: string; iconColor: string }> = {
  kitchen:  { bg: 'rgba(255,107,107,0.15)', iconColor: '#FF6B6B' },
  bathroom: { bg: 'rgba(96,165,250,0.15)',  iconColor: '#60A5FA' },
  living:   { bg: 'rgba(167,139,250,0.15)', iconColor: '#A78BFA' },
  outdoor:  { bg: 'rgba(62,207,160,0.15)',  iconColor: '#3ECFA0' },
  laundry:  { bg: 'rgba(255,179,71,0.15)',  iconColor: '#FFB347' },
  shopping: { bg: 'rgba(62,207,160,0.15)',  iconColor: '#3ECFA0' },
  other:    { bg: 'rgba(150,150,150,0.15)', iconColor: '#999999' },
};

const CATEGORY_NAMES: Record<string, string> = {
  kitchen:  'Kitchen',
  bathroom: 'Bathroom',
  living:   'Living Room',
  outdoor:  'Outdoor',
  laundry:  'Laundry',
  shopping: 'Groceries',
  other:    'Other',
};

interface TaskCardProps {
  task: Task;
  members: Member[];
  onComplete: (id: string) => void;
}

export const TaskCard = ({ task, members, onComplete }: TaskCardProps) => {
  const { theme, isDark } = useTheme();
  const assignee = getMemberById(members, task.assigneeId);
  const isDone = task.status === 'done';

  const catStyle = isDark
    ? DARK_CATEGORY_STYLE[task.category] || DARK_CATEGORY_STYLE.other
    : CATEGORY_STYLE[task.category] || CATEGORY_STYLE.other;

  const catName = CATEGORY_NAMES[task.category] || 'Other';

  return (
    <View style={[styles.card, {
      backgroundColor: theme.surface,
      shadowColor: theme.shadow,
      opacity: isDone ? 0.55 : 1,
    }]}>
      {/* Category icon */}
      <View style={[styles.iconWrap, { backgroundColor: catStyle.bg }]}>
        <Feather name={task.icon as any} size={20} color={catStyle.iconColor} />
      </View>

      {/* Title + category + assignee */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }, isDone && styles.done]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={[styles.catLabel, { color: theme.textSecondary }]} numberOfLines={1}>
          {catName}
        </Text>
        {assignee && (
          <View style={styles.assigneeRow}>
            <Feather name="user" size={11} color={theme.textTertiary} />
            <Text style={[styles.assigneeText, { color: theme.textSecondary }]}>
              {assignee.isCurrentUser ? 'You' : assignee.name.split(' ')[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Points + checkbox */}
      <View style={styles.right}>
        <Text style={[styles.pts, { color: theme.yellow }]}>{task.points} pts</Text>
        <TouchableOpacity
          style={[styles.check, {
            borderColor: isDone ? theme.accent : theme.border2,
            backgroundColor: isDone ? theme.accent : 'transparent',
          }]}
          onPress={() => !isDone && onComplete(task.id)}
        >
          {isDone && <Feather name="check" size={13} color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.xl,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 1 },
  done: { textDecorationLine: 'line-through' },
  catLabel: { fontSize: 11, fontWeight: '400', marginBottom: 3 },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  assigneeText: { fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  pts: { fontSize: 12, fontWeight: '700' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
