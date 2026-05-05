import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { Spacing, Radius } from '../constants/theme';
import { getTaskStatusLabel, getLeaderboard } from '../utils/helpers';

const AvatarCircle = ({
  initials, color, size = 52, showCrown = false, rank,
}: {
  initials: string;
  color: string;
  size?: number;
  showCrown?: boolean;
  rank?: number;
}) => (
  <View style={{ position: 'relative' }}>
    {showCrown && (
      <View style={styles.crownBadge}>
        <Text style={{ fontSize: 14 }}>👑</Text>
      </View>
    )}
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color + '22',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.3, fontWeight: '700', color }}>{initials}</Text>
    </View>
    {rank !== undefined && rank > 0 && (
      <View style={[styles.rankBadge]}>
        <Text style={styles.rankNum}>{rank + 1}</Text>
      </View>
    )}
  </View>
);

export const HomeScreen = ({ navigation }: any) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { tasks, members, group, currentUser, completeTask } = useApp();

  const myTasks = tasks.filter(t => {
    if (t.assigneeId !== currentUser.id) return false;
    const s = getTaskStatusLabel(t);
    return s === 'today' || s === 'overdue';
  });

  const leaderboard = getLeaderboard(members);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header row */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.groupPill, { backgroundColor: theme.surface }]}>
            <Text style={styles.sunEmoji}>☀️</Text>
            <Text style={[styles.groupName, { color: theme.text }]}>{group.name}</Text>
            <Feather name="chevron-down" size={13} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: theme.surface }]}
              onPress={toggleTheme}
            >
              <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surface }]}>
              <Feather name="bell" size={18} color={theme.textSecondary} />
              <View style={[styles.notifDot, { backgroundColor: theme.coral }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: theme.text }]}>
            Good morning, {currentUser.name.split(' ')[0]}! ☀️
          </Text>
          <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>
            Let's make today a productive one.
          </Text>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Tasks</Text>
            <View style={[styles.countPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.countText, { color: theme.textSecondary }]}>
                {myTasks.length} tasks
              </Text>
            </View>
          </View>

          {myTasks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
              <Text style={{ fontSize: 36 }}>🎉</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>All done!</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                No tasks due today
              </Text>
            </View>
          ) : (
            myTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                members={members}
                onComplete={completeTask}
              />
            ))
          )}
        </View>

        {/* This Week's Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              This Week's Leaderboard
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Members')}>
              <Text style={[styles.viewAll, { color: theme.accent }]}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.leaderCard, { backgroundColor: theme.surface }]}>
            {leaderboard.slice(0, 4).map((m, i) => (
              <View key={m.id} style={styles.leaderItem}>
                <AvatarCircle
                  initials={m.initials}
                  color={m.color}
                  size={52}
                  showCrown={i === 0}
                  rank={i > 0 ? i : undefined}
                />
                <Text style={[styles.leaderName, { color: theme.text }]}>
                  {m.isCurrentUser ? 'You' : m.name.split(' ')[0]}
                </Text>
                <Text style={[styles.leaderPts, { color: theme.yellow }]}>{m.score} pts</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Feather name="plus" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: 56 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerRight: { flexDirection: 'row', gap: Spacing.sm },

  groupPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sunEmoji: { fontSize: 16 },
  groupName: { fontSize: 15, fontWeight: '600' },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },

  greeting: { marginBottom: Spacing.xl },
  greetingText: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  greetingSub: { fontSize: 14, lineHeight: 20 },

  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  countPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  countText: { fontSize: 12, fontWeight: '500' },
  viewAll: { fontSize: 14, fontWeight: '500' },

  emptyCard: {
    alignItems: 'center',
    padding: 36,
    borderRadius: Radius.xl,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptySub: { fontSize: 13 },

  leaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg + 18,
    paddingBottom: Spacing.lg,
    borderRadius: Radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderItem: { alignItems: 'center', gap: 6, flex: 1 },
  crownBadge: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  rankNum: { fontSize: 9, fontWeight: '700', color: 'white' },
  leaderName: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  leaderPts: { fontSize: 12, fontWeight: '700' },

  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3ECFA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
