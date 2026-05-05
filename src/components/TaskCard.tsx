import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, Member } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import {
  getTaskStatusLabel,
  formatDueLabel,
  getCategoryColor,
  getCategoryBg,
  getMemberById,
} from '../utils/helpers';
import { Radius, Spacing } from '../constants/theme';

interface TaskCardProps {
  task: Task;
  members: Member[];
  onComplete: (id: string) => void;
  onPress?: (task: Task) => void;
}

export const TaskCard = ({ task, members, onComplete, onPress }: TaskCardProps) => {
  const { theme } = useTheme();
  const statusLabel = getTaskStatusLabel(task);
  const dueLabel = formatDueLabel(task);
  const assignee = getMemberById(members, task.assigneeId);
  const isDone = task.status === 'done';
  const iconColor = getCategoryColor(task.category, theme);
  const iconBg = getCategoryBg(task.category, theme);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: isDone ? 0.6 : 1,
        },
      ]}
      onPress={() => onPress?.(task)}
      activeOpacity={0.75}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Feather
          name={task.icon as any}
          size={18}
          color={iconColor}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            isDone && styles.strikethrough,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View style={styles.meta}>
          {assignee && (
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {assignee.isCurrentUser ? 'You' : assignee.name.split(' ')[0]}
            </Text>
          )}
          <Text style={[styles.metaDot, { color: theme.textTertiary }]}>·</Text>
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {dueLabel}
          </Text>
          {task.repeat !== 'never' && (
            <>
              <Text style={[styles.metaDot, { color: theme.textTertiary }]}>·</Text>
              <Feather name="repeat" size={10} color={theme.textTertiary} />
            </>
          )}
        </View>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        <Badge variant={statusLabel} />
        <TouchableOpacity
          style={[
            styles.check,
            {
              borderColor: isDone ? theme.green : theme.border2,
              backgroundColor: isDone ? theme.green : 'transparent',
            },
          ]}
          onPress={() => !isDone && onComplete(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isDone && <Feather name="check" size={12} color="#fff" />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
