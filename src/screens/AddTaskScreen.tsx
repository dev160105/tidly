import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { RepeatInterval, Task, TaskCategory } from '../types';
import { Spacing, Radius } from '../constants/theme';

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  category: TaskCategory;
  bg: string;
  bgDark: string;
  iconColor: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'cleaning', label: 'Cleaning',  icon: 'wind',          category: 'living',   bg: '#EEE8FF', bgDark: 'rgba(167,139,250,0.18)', iconColor: '#A78BFA' },
  { id: 'dishes',   label: 'Dishes',    icon: 'droplets',      category: 'kitchen',  bg: '#FFF0E8', bgDark: 'rgba(255,107,107,0.18)', iconColor: '#FF6B6B' },
  { id: 'laundry',  label: 'Laundry',   icon: 'layers',        category: 'laundry',  bg: '#FFF8E8', bgDark: 'rgba(255,179,71,0.18)',  iconColor: '#FFB347' },
  { id: 'trash',    label: 'Trash',     icon: 'trash-2',       category: 'outdoor',  bg: '#E8FFF5', bgDark: 'rgba(62,207,160,0.18)',  iconColor: '#3ECFA0' },
  { id: 'grocery',  label: 'Grocery',   icon: 'shopping-cart', category: 'shopping', bg: '#E8FFF5', bgDark: 'rgba(62,207,160,0.18)',  iconColor: '#3ECFA0' },
  { id: 'cooking',  label: 'Cooking',   icon: 'coffee',        category: 'kitchen',  bg: '#FFF0E8', bgDark: 'rgba(255,107,107,0.18)', iconColor: '#FF6B6B' },
  { id: 'plants',   label: 'Plants',    icon: 'sun',           category: 'outdoor',  bg: '#E8FFF5', bgDark: 'rgba(62,207,160,0.18)',  iconColor: '#3ECFA0' },
  { id: 'other',    label: 'Other',     icon: 'more-horizontal',category: 'other',   bg: '#F5F5F5', bgDark: 'rgba(150,150,150,0.18)', iconColor: '#999999' },
];

const REPEAT_OPTIONS: { key: RepeatInterval; label: string }[] = [
  { key: 'never',    label: 'One time'  },
  { key: 'daily',    label: 'Daily'     },
  { key: 'weekly',   label: 'Weekly'    },
  { key: 'monthly',  label: 'Custom'    },
];

export const AddTaskScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { members, currentUser, group, addTask } = useApp();

  const [taskName, setTaskName]         = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId]     = useState(currentUser.id);
  const [repeat, setRepeat]             = useState<RepeatInterval>('never');
  const [points, setPoints]             = useState(15);

  const selectedCat = CATEGORIES.find(c => c.id === selectedCatId);

  const handleCreate = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskName.trim() || selectedCat?.label || 'New task',
      icon: selectedCat?.icon || 'check-square',
      assigneeId,
      dueDate: new Date().toISOString(),
      dueTime: '20:00',
      status: 'pending',
      priority: 'medium',
      repeat,
      category: selectedCat?.category || 'other',
      points,
      createdBy: currentUser.id,
      groupId: group.id,
    };
    addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add Task</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Task Name */}
        <View style={styles.section}>
          <TextInput
            style={[styles.nameInput, {
              color: theme.text,
              borderBottomColor: theme.border2,
            }]}
            value={taskName}
            onChangeText={setTaskName}
            placeholder="What needs to be done?"
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        {/* Category Grid */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Choose a Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const isSelected = selectedCatId === cat.id;
              const bg = isDark ? cat.bgDark : cat.bg;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryBtn,
                    {
                      backgroundColor: theme.surface,
                      borderColor: isSelected ? cat.iconColor : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                      shadowColor: theme.shadow,
                    },
                  ]}
                  onPress={() => setSelectedCatId(isSelected ? null : cat.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.catIconWrap, { backgroundColor: bg }]}>
                    <Feather name={cat.icon as any} size={22} color={cat.iconColor} />
                  </View>
                  <Text style={[
                    styles.catLabel,
                    { color: isSelected ? cat.iconColor : theme.textSecondary },
                    isSelected && { fontWeight: '600' },
                  ]} numberOfLines={1}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Assign to */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Assign to</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.assigneeRow}
          >
            {members.map(m => {
              const isSelected = assigneeId === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={styles.assigneeItem}
                  onPress={() => setAssigneeId(m.id)}
                >
                  <View style={[
                    styles.assigneeAvatar,
                    { backgroundColor: m.color + '22' },
                    isSelected && { borderWidth: 2.5, borderColor: m.color },
                  ]}>
                    <Text style={[styles.assigneeInitials, { color: m.color }]}>
                      {m.initials}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkOverlay, { backgroundColor: m.color }]}>
                        <Feather name="check" size={10} color="white" />
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.assigneeName,
                    { color: isSelected ? m.color : theme.textSecondary },
                    isSelected && { fontWeight: '600' },
                  ]}>
                    {m.isCurrentUser ? 'You' : m.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Repeat */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Repeat</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Spacing.sm }}
          >
            {REPEAT_OPTIONS.map(opt => {
              const isSelected = repeat === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.repeatBtn,
                    {
                      backgroundColor: isSelected ? theme.accent : theme.surface,
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setRepeat(opt.key)}
                >
                  <Text style={[
                    styles.repeatLabel,
                    { color: isSelected ? 'white' : theme.textSecondary },
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Due Date</Text>
          <TouchableOpacity style={[styles.rowBtn, {
            backgroundColor: theme.surface,
            shadowColor: theme.shadow,
          }]}>
            <Feather name="calendar" size={16} color={theme.accent} />
            <Text style={[styles.rowBtnText, { color: theme.text }]}>Today</Text>
            <Feather name="chevron-right" size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Points */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Points</Text>
          <View style={styles.pointsRow}>
            <TouchableOpacity
              style={[styles.pointsBtn, {
                backgroundColor: theme.surface,
                shadowColor: theme.shadow,
              }]}
              onPress={() => setPoints(Math.max(1, points - 5))}
            >
              <Feather name="minus" size={18} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.pointsVal, { color: theme.text }]}>{points} pts</Text>
            <TouchableOpacity
              style={[styles.pointsBtn, {
                backgroundColor: theme.surface,
                shadowColor: theme.shadow,
              }]}
              onPress={() => setPoints(points + 5)}
            >
              <Feather name="plus" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: theme.accent }]}
          onPress={handleCreate}
        >
          <Text style={styles.createBtnText}>Create Task ✨</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },

  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  label: { fontSize: 15, fontWeight: '700', marginBottom: Spacing.md },

  nameInput: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 12,
    borderBottomWidth: 1.5,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryBtn: {
    width: '22%',
    aspectRatio: 0.9,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  catIconWrap: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: { fontSize: 11, textAlign: 'center' },

  assigneeRow: { gap: Spacing.md, paddingVertical: 4 },
  assigneeItem: { alignItems: 'center', gap: 6 },
  assigneeAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitials: { fontSize: 18, fontWeight: '700' },
  checkOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  assigneeName: { fontSize: 12 },

  repeatBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  repeatLabel: { fontSize: 13, fontWeight: '500' },

  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: Radius.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  rowBtnText: { flex: 1, fontSize: 15, fontWeight: '500' },

  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  pointsBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pointsVal: { fontSize: 18, fontWeight: '700', minWidth: 70, textAlign: 'center' },

  createBtn: {
    padding: 18,
    borderRadius: Radius.xl,
    alignItems: 'center',
    shadowColor: '#3ECFA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
