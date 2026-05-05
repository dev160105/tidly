import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { Spacing, Radius } from '../constants/theme';
import { getTaskStatusLabel } from '../utils/helpers';
import { Task } from '../types';

type FilterTab = 'all' | 'mine' | 'overdue' | 'done';

export const TasksScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { tasks, members, currentUser, completeTask } = useApp();
  const [filter, setFilter] = useState<FilterTab>('mine');

  const filtered = tasks.filter(t => {
    if (filter === 'mine') return t.assigneeId === currentUser.id;
    if (filter === 'overdue') return getTaskStatusLabel(t) === 'overdue';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const overdue = filtered.filter(t => getTaskStatusLabel(t) === 'overdue');
  const today = filtered.filter(t => getTaskStatusLabel(t) === 'today');
  const upcoming = filtered.filter(t => !['overdue', 'today', 'done'].includes(getTaskStatusLabel(t)));
  const done = filtered.filter(t => t.status === 'done');

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'mine', label: 'Mine' },
    { key: 'all', label: 'All' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'done', label: 'Done' },
  ];

  const Section = ({ title, items, accent }: { title: string; items: Task[]; accent?: string }) => {
    if (items.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: accent || theme.textSecondary }]}>
          {title.toUpperCase()}
        </Text>
        {items.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            members={members}
            onComplete={completeTask}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Tasks</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.accentLight }]}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Feather name="plus" size={18} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === tab.key ? theme.accent : theme.surface,
                borderColor: filter === tab.key ? theme.accent : theme.border,
              },
            ]}
            onPress={() => setFilter(tab.key)}
          >
            <Text style={[
              styles.filterLabel,
              { color: filter === tab.key ? '#fff' : theme.textSecondary },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Feather name="inbox" size={36} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nothing here yet
            </Text>
          </View>
        ) : (
          <>
            <Section title="Overdue" items={overdue} accent={theme.red} />
            <Section title="Today" items={today} />
            <Section title="Upcoming" items={upcoming} />
            <Section title="Done" items={done} accent={theme.green} />
          </>
        )}
        <View style={{ height: 100 }} />
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
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  addBtn: {
    width: 38, height: 38, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  tabsContainer: {
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md, gap: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 0.5,
  },
  filterLabel: { fontSize: 13, fontWeight: '500' },
  scroll: { paddingHorizontal: Spacing.xl },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, marginBottom: Spacing.sm },
  empty: {
    alignItems: 'center', padding: 40, borderRadius: Radius.lg,
    borderWidth: 0.5, gap: Spacing.md, marginTop: Spacing.xl,
  },
  emptyText: { fontSize: 14 },
});
