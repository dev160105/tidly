import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { ScoreBar } from '../components/ScoreBar';
import { Spacing, Radius } from '../constants/theme';
import { getLeaderboard } from '../utils/helpers';

const TROPHY_COLORS = ['#FFB347', '#C0C0C0', '#CD7F32'];
const TABS = ['This Week', 'This Month', 'All Time'] as const;
type Tab = typeof TABS[number];

export const MembersScreen = () => {
  const { theme, isDark } = useTheme();
  const { members } = useApp();
  const leaderboard = getLeaderboard(members);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const [activeTab, setActiveTab] = useState<Tab>('This Week');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Leaderboard</Text>
        <View style={[styles.tabRow, { backgroundColor: theme.surface2 }]}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: theme.accent },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? 'white' : theme.textSecondary },
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Podium */}
        <View style={styles.podium}>

          {/* 2nd place */}
          <View style={[styles.podiumItem, { marginTop: 32 }]}>
            <View style={[
              styles.podiumAvatar,
              { backgroundColor: top3[1]?.color + '22', borderColor: TROPHY_COLORS[1] },
            ]}>
              <Text style={[styles.podiumInitials, { color: top3[1]?.color }]}>
                {top3[1]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumTrophy}>🥈</Text>
            <Text style={[styles.podiumName, { color: theme.text }]}>
              {top3[1]?.name.split(' ')[0]}
            </Text>
            <Text style={[styles.podiumPts, { color: TROPHY_COLORS[1] }]}>
              {top3[1]?.score} pts
            </Text>
          </View>

          {/* 1st place */}
          <View style={styles.podiumItem}>
            <Text style={styles.crown}>👑</Text>
            <View style={[
              styles.podiumAvatar,
              styles.podiumAvatarLg,
              { backgroundColor: top3[0]?.color + '22', borderColor: TROPHY_COLORS[0] },
            ]}>
              <Text style={[styles.podiumInitials, styles.podiumInitialsLg, { color: top3[0]?.color }]}>
                {top3[0]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumTrophy}>🥇</Text>
            <Text style={[styles.podiumName, styles.podiumNameLg, { color: theme.text }]}>
              {top3[0]?.name.split(' ')[0]}
            </Text>
            <Text style={[styles.podiumPts, styles.podiumPtsLg, { color: theme.accent }]}>
              {top3[0]?.score} pts
            </Text>
          </View>

          {/* 3rd place */}
          <View style={[styles.podiumItem, { marginTop: 56 }]}>
            <View style={[
              styles.podiumAvatar,
              { backgroundColor: top3[2]?.color + '22', borderColor: TROPHY_COLORS[2] },
            ]}>
              <Text style={[styles.podiumInitials, { color: top3[2]?.color }]}>
                {top3[2]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumTrophy}>🥉</Text>
            <Text style={[styles.podiumName, { color: theme.text }]}>
              {top3[2]?.name.split(' ')[0]}
            </Text>
            <Text style={[styles.podiumPts, { color: TROPHY_COLORS[2] }]}>
              {top3[2]?.score} pts
            </Text>
          </View>
        </View>

        {/* Rest of list */}
        {rest.length > 0 && (
          <View style={[styles.listCard, {
            backgroundColor: theme.surface,
            shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)',
          }]}>
            {rest.map((member, i) => (
              <View
                key={member.id}
                style={[
                  styles.listRow,
                  { borderBottomColor: theme.border },
                  i === rest.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={[styles.listRank, { color: theme.textTertiary }]}>{i + 4}</Text>
                <View style={[styles.listAvatar, { backgroundColor: member.color + '22' }]}>
                  <Text style={[styles.listInitials, { color: member.color }]}>{member.initials}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text style={[styles.listName, { color: theme.text }]}>
                    {member.name}{member.isCurrentUser ? ' (you)' : ''}
                  </Text>
                  <ScoreBar value={member.score} color={member.color} />
                </View>
                <Text style={[styles.listPts, { color: member.color }]}>{member.score} pts</Text>
              </View>
            ))}
          </View>
        )}

        {/* Motivational card */}
        <View style={[styles.motivCard, { backgroundColor: theme.yellowLight }]}>
          <Text style={{ fontSize: 22 }}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.motivTitle, { color: theme.text }]}>You've got this!</Text>
            <Text style={[styles.motivSub, { color: theme.textSecondary }]}>
              Climb the ranks and keep the house happy.
            </Text>
          </View>
          <Text style={{ fontSize: 28 }}>🌿</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 4,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  tabText: { fontSize: 13, fontWeight: '600' },

  scroll: { paddingHorizontal: Spacing.xl },

  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 24,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  podiumItem: { alignItems: 'center', gap: 4 },
  crown: { fontSize: 26, marginBottom: -2 },

  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  podiumAvatarLg: { width: 82, height: 82, borderRadius: 41 },

  podiumInitials: { fontSize: 20, fontWeight: '700' },
  podiumInitialsLg: { fontSize: 26 },
  podiumTrophy: { fontSize: 22, marginTop: 4 },
  podiumName: { fontSize: 13, fontWeight: '600' },
  podiumNameLg: { fontSize: 15 },
  podiumPts: { fontSize: 13, fontWeight: '700' },
  podiumPtsLg: { fontSize: 15 },

  listCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: Spacing.xl,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
  },
  listRank: { fontSize: 14, fontWeight: '600', width: 22, textAlign: 'center' },
  listAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInitials: { fontSize: 14, fontWeight: '700' },
  listInfo: { flex: 1 },
  listName: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  listPts: { fontSize: 14, fontWeight: '700' },

  motivCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    gap: Spacing.md,
  },
  motivTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  motivSub: { fontSize: 12 },
});
