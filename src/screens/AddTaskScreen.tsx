import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { PRESET_TASKS } from '../constants/mockData';
import { PresetTask, RepeatInterval, Task } from '../types';
import { Spacing, Radius } from '../constants/theme';

const REPEAT_OPTIONS: { key: RepeatInterval; label: string }[] = [
  { key: 'never', label: 'Never' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'biweekly', label: 'Bi-weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export const AddTaskScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { members, currentUser, group, addTask } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<PresetTask | null>(PRESET_TASKS[0]);
  const [customTitle, setCustomTitle] = useState('Take out trash');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [repeat, setRepeat] = useState<RepeatInterval>('weekly');
  const [dueTime, setDueTime] = useState('20:00');

  const handleSelectPreset = (preset: PresetTask) => {
    setSelectedPreset(preset);
    setCustomTitle(preset.title);
    setRepeat(preset.defaultRepeat);
  };

  const handleCreate = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: customTitle.trim() || selectedPreset?.title || 'New task',
      icon: selectedPreset?.icon || 'check-square',
      assigneeId,
      dueDate: new Date().toISOString(),
      dueTime,
      status: 'pending',
      priority: 'medium',
      repeat,
      category: selectedPreset?.category || 'other',
      points: selectedPreset?.defaultPoints || 5,
      createdBy: currentUser.id,
      groupId: group.id,
    };
    addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.cancelBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="x" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>New Task</Text>
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: theme.accent }]}
          onPress={handleCreate}
        >
          <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Presets */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>QUICK PICK</Text>
          <View style={styles.presetGrid}>
            {PRESET_TASKS.map(preset => {
              const isSelected = selectedPreset?.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: isSelected ? theme.accentLight : theme.surface,
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => handleSelectPreset(preset)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={preset.icon as any}
                    size={20}
                    color={isSelected ? theme.accent : theme.textSecondary}
                  />
                  <Text style={[
                    styles.presetLabel,
                    { color: isSelected ? theme.accent : theme.text },
                  ]} numberOfLines={1}>
                    {preset.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>TASK NAME</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder="Or type a custom task..."
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        {/* Assign to */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>ASSIGN TO</Text>
          <View style={styles.assigneeRow}>
            {members.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.assigneeBtn,
                  {
                    backgroundColor: assigneeId === m.id ? m.color + '22' : theme.surface,
                    borderColor: assigneeId === m.id ? m.color : theme.border,
                  },
                ]}
                onPress={() => setAssigneeId(m.id)}
              >
                <View style={[styles.assigneeAvatar, { backgroundColor: m.color + '33' }]}>
                  <Text style={[styles.assigneeInitials, { color: m.color }]}>{m.initials}</Text>
                </View>
                <Text style={[
                  styles.assigneeName,
                  { color: assigneeId === m.id ? m.color : theme.textSecondary },
                ]}>
                  {m.isCurrentUser ? 'You' : m.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Repeat */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>REPEAT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
            {REPEAT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.repeatBtn,
                  {
                    backgroundColor: repeat === opt.key ? theme.accent : theme.surface,
                    borderColor: repeat === opt.key ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => setRepeat(opt.key)}
              >
                <Text style={[
                  styles.repeatLabel,
                  { color: repeat === opt.key ? '#fff' : theme.textSecondary },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Due time */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>DUE TIME</Text>
          <View style={styles.timeRow}>
            {['08:00', '12:00', '17:00', '20:00', '22:00'].map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.timeBtn,
                  {
                    backgroundColor: dueTime === t ? theme.accentLight : theme.surface,
                    borderColor: dueTime === t ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => setDueTime(t)}
              >
                <Text style={[
                  styles.timeLabel,
                  { color: dueTime === t ? theme.accent : theme.textSecondary },
                ]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notification note */}
        <View style={[styles.notifNote, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
          <Feather name="bell" size={14} color={theme.accent} />
          <Text style={[styles.notifText, { color: theme.textSecondary }]}>
            Reminders will fire silently at 8 AM and as an alert 1–2 hours before due time.
          </Text>
        </View>

        {/* Points preview */}
        {selectedPreset && (
          <View style={[styles.pointsNote, { backgroundColor: theme.accentLight }]}>
            <Feather name="award" size={14} color={theme.accent} />
            <Text style={[styles.pointsText, { color: theme.accent }]}>
              Completing this task earns {selectedPreset.defaultPoints} pts
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: 56, paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  cancelBtn: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 0.5,
  },
  createBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 9,
    borderRadius: Radius.full,
  },
  createBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  scroll: { paddingHorizontal: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, marginBottom: Spacing.sm },

  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  presetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderRadius: Radius.md, borderWidth: 0.5, minWidth: '47%', flex: 1,
  },
  presetLabel: { fontSize: 13, fontWeight: '500', flex: 1 },

  input: {
    borderWidth: 0.5, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: 15,
  },

  assigneeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  assigneeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 0.5,
  },
  assigneeAvatar: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  assigneeInitials: { fontSize: 10, fontWeight: '700' },
  assigneeName: { fontSize: 13, fontWeight: '500' },

  repeatBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 0.5,
  },
  repeatLabel: { fontSize: 13, fontWeight: '500' },

  timeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  timeBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.md, borderWidth: 0.5,
  },
  timeLabel: { fontSize: 13, fontFamily: 'monospace', fontWeight: '500' },

  notifNote: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.sm, padding: Spacing.md,
    borderRadius: Radius.md, borderWidth: 0.5, marginBottom: Spacing.sm,
  },
  notifText: { flex: 1, fontSize: 12, lineHeight: 18 },

  pointsNote: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, padding: Spacing.md,
    borderRadius: Radius.md,
  },
  pointsText: { fontSize: 13, fontWeight: '500' },
});
