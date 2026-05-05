import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { Avatar } from '../components/Avatar';
import { Spacing, Radius, Typography } from '../constants/theme';
import { getTaskStatusLabel, getLeaderboard } from '../utils/helpers';

export const HomeScreen = ({ navigation }: any) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { tasks, members, group, currentUser, completeTask } = useApp();

  const myTasks = tasks.filter(t => {
    if (t.assigneeId !== currentUser.id) return false;
    const s = getTaskStatusLabel(t);
    return s === 'today' || s === 'overdue';
  });

  const leaderboard = getLeaderboard(members).slice(0, 3);
  const myRank = getLeaderboard(members).findIndex(m => m.id === currentUser.id) + 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Good morning ☀️
            </Text>
            <Text style={[styles.name, { color: theme.text }]}>
              {currentUser.name.split(' ')[0]}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.themeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={toggleTheme}
          >
            <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Group Card */}
        <View style={[styles.groupCard, { backgroundColor: theme.accent }]}>
          <View style={styles.groupCardInner}>
            <View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupSub}>
                {members.length} roommates · Week {group.weekNumber}
              </Text>
            </View>
            <View style={styles.avatarRow}>
              {members.slice(0, 3).map((m, i) => (
                <View key={m.id} style={[styles.avatarBadge, { marginLeft: i > 0 ? -8 : 0 }]}>
                  <View style={[styles.avatarCircle, { backgroundColor: m.color }]}>
                    <Text style={styles.avatarText}>{m.initials}</Text>
                  </View>
                </View>
              ))}
              {members.length > 3 && (
                <View style={[styles.avatarBadge, { marginLeft: -8 }]}>
                  <View style={[styles.avatarCircle, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                    <Text style={styles.avatarText}>+{members.length - 3}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Stats row inside card */}
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatVal}>{myTasks.length}</Text>
              <Text style={styles.cardStatLabel}>tasks today</Text>
            </View>
            <View style={styles.cardStatDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatVal}>#{myRank}</Text>
              <Text style={styles.cardStatLabel}>your rank</Text>
            </View>
            <View style={styles.cardStatDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatVal}>{currentUser.score}</Text>
              <Text style={styles.cardStatLabel}>points</Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              YOUR TASKS TODAY
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>See all →</Text>
            </TouchableOpacity>
          </View>

          {myTasks.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="check-circle" size={32} color={theme.green} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                All clear! No tasks due today.
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

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              LEADERBOARD
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Members')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>Full →</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {leaderboard.map((member, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <View
                  key={member.id}
                  style={[
                    styles.leaderRow,
                    { borderBottomColor: theme.border },
                    index === leaderboard.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={styles.medal}>{medals[index]}</Text>
                  <Avatar initials={member.initials} color={member.color} size={34} fontSize={12} />
                  <Text style={[styles.leaderName, { color: theme.text }]}>
                    {member.name.split(' ')[0]}{member.isCurrentUser ? ' (you)' : ''}
                  </Text>
                  <Text style={[styles.leaderScore, { color: member.color }]}>
                    {member.score} pts
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: 56 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.xl,
  },
  greeting: { fontSize: 13, fontWeight: '400', marginBottom: 2 },
  name: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  themeBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5,
  },

  groupCard: {
    borderRadius: Radius.xl, padding: Spacing.xl,
    marginBottom: Spacing.xl, overflow: 'hidden',
  },
  groupCardInner: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.xl,
  },
  groupName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 3 },
  groupSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  avatarRow: { flexDirection: 'row' },
  avatarBadge: { borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarCircle: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  cardStats: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.md, padding: Spacing.md,
  },
  cardStat: { flex: 1, alignItems: 'center' },
  cardStatVal: { fontSize: 20, fontWeight: '700', color: '#fff' },
  cardStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  cardStatDivider: { width: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' },

  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7 },
  seeAll: { fontSize: 13, fontWeight: '500' },

  emptyState: {
    alignItems: 'center', padding: Spacing.xxl,
    borderRadius: Radius.lg, borderWidth: 0.5, gap: Spacing.md,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },

  card: {
    borderRadius: Radius.lg, borderWidth: 0.5, overflow: 'hidden',
  },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  medal: { fontSize: 18, width: 24 },
  leaderName: { flex: 1, fontSize: 14, fontWeight: '500' },
  leaderScore: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },

  fab: {
    position: 'absolute', bottom: 90, right: Spacing.xl,
    width: 54, height: 54, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7C6AF5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
});
