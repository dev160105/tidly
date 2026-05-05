import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { ScoreBar } from '../components/ScoreBar';
import { Spacing, Radius } from '../constants/theme';
import { getLeaderboard } from '../utils/helpers';

export const MembersScreen = () => {
  const { theme, isDark } = useTheme();
  const { members, tasks, currentUser } = useApp();
  const leaderboard = getLeaderboard(members);

  const highlights = [
    { emoji: '🧹', text: `${members.find(m => m.score === Math.max(...members.map(x => x.score)))?.name.split(' ')[0]} is leading with ${Math.max(...members.map(m => m.score))} points` },
    { emoji: '⚠️', text: `${members.find(m => m.score === Math.min(...members.map(x => x.score)))?.name.split(' ')[0]} needs to step it up this week` },
    { emoji: '✅', text: `${tasks.filter(t => t.status === 'done').length} tasks completed this week by the group` },
  ];

  const rankColors = [theme.yellow, theme.textSecondary, '#CD7F32'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Members</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Top 3 podium */}
        <View style={[styles.podiumCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.podiumTitle, { color: theme.textSecondary }]}>LEADERBOARD</Text>
          {leaderboard.map((member, i) => (
            <View
              key={member.id}
              style={[
                styles.memberRow,
                { borderBottomColor: theme.border },
                i === leaderboard.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.rankBadge, { backgroundColor: i < 3 ? rankColors[i] + '22' : theme.surface2 }]}>
                <Text style={[styles.rankText, { color: i < 3 ? rankColors[i] : theme.textTertiary }]}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </Text>
              </View>

              <Avatar initials={member.initials} color={member.color} size={42} fontSize={15} />

              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={[styles.memberName, { color: theme.text }]}>
                    {member.name}{member.isCurrentUser ? ' (you)' : ''}
                  </Text>
                  <Text style={[styles.memberScore, { color: member.color }]}>
                    {member.score} pts
                  </Text>
                </View>
                <Text style={[styles.memberSub, { color: theme.textSecondary }]}>
                  {member.tasksCompleted} done · {member.tasksAssigned} pending
                </Text>
                <ScoreBar value={member.score} color={member.color} />
              </View>
            </View>
          ))}
        </View>

        {/* Weekly highlights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            THIS WEEK
          </Text>
          <View style={[styles.highlightsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {highlights.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.highlightRow,
                  { borderBottomColor: theme.border },
                  i === highlights.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.highlightEmoji}>{h.emoji}</Text>
                <Text style={[styles.highlightText, { color: theme.text }]}>{h.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Group stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            GROUP STATS
          </Text>
          <View style={styles.statsGrid}>
            {[
              { label: 'Total tasks', value: tasks.length, icon: 'list', color: theme.accent },
              { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, icon: 'check-circle', color: theme.green },
              { label: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, icon: 'alert-circle', color: theme.red },
              { label: 'Total pts', value: members.reduce((s, m) => s + m.score, 0), icon: 'award', color: theme.yellow },
            ].map((stat, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '22' }]}>
                  <Feather name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={[styles.statVal, { color: theme.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.xl, paddingTop: 56, paddingBottom: Spacing.md,
  },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  scroll: { paddingHorizontal: Spacing.xl },

  podiumCard: {
    borderRadius: Radius.lg, borderWidth: 0.5,
    overflow: 'hidden', marginBottom: Spacing.xl,
  },
  podiumTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, padding: Spacing.md },
  memberRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  rankBadge: {
    width: 32, height: 32, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  rankText: { fontSize: 14, fontWeight: '700' },
  memberInfo: { flex: 1 },
  memberNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberName: { fontSize: 14, fontWeight: '500' },
  memberScore: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  memberSub: { fontSize: 12, marginTop: 2 },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, marginBottom: Spacing.md },

  highlightsCard: {
    borderRadius: Radius.lg, borderWidth: 0.5, overflow: 'hidden',
  },
  highlightRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  highlightEmoji: { fontSize: 16, marginTop: 1 },
  highlightText: { flex: 1, fontSize: 13, lineHeight: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    flex: 1, minWidth: '45%', borderRadius: Radius.lg,
    borderWidth: 0.5, padding: Spacing.md, gap: 4,
  },
  statIcon: {
    width: 34, height: 34, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  statVal: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  statLabel: { fontSize: 12 },
});
