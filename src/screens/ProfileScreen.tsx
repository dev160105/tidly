import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { ScoreBar } from '../components/ScoreBar';
import { Spacing, Radius } from '../constants/theme';

export const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentUser, tasks } = useApp();

  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const myDone = myTasks.filter(t => t.status === 'done');
  const completionRate = myTasks.length > 0
    ? Math.round((myDone.length / myTasks.length) * 100)
    : 0;

  const menuItems = [
    { icon: 'users', label: 'Manage group', sub: '4 members' },
    { icon: 'bell', label: 'Notification prefs', sub: 'Alerts & digests' },
    { icon: 'repeat', label: 'Recurring tasks', sub: `${tasks.filter(t => t.repeat !== 'never').length} active` },
    { icon: 'shield', label: 'Privacy & data', sub: '' },
    { icon: 'help-circle', label: 'Help & feedback', sub: '' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity
          style={[styles.themeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={toggleTheme}
        >
          <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Avatar initials={currentUser.initials} color={currentUser.color} size={64} fontSize={22} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{currentUser.name}</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{currentUser.email}</Text>
            <View style={[styles.scorePill, { backgroundColor: currentUser.color + '22' }]}>
              <Feather name="award" size={12} color={currentUser.color} />
              <Text style={[styles.scorePillText, { color: currentUser.color }]}>
                {currentUser.score} points
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>YOUR STATS</Text>
          <View style={styles.statsRow}>
            {[
              { label: 'Assigned', value: myTasks.length, color: theme.accent },
              { label: 'Completed', value: myDone.length, color: theme.green },
              { label: 'Completion', value: `${completionRate}%`, color: theme.yellow },
            ].map((stat, i) => (
              <View key={i} style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statVal, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Completion bar */}
        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>Weekly completion</Text>
            <Text style={[styles.progressPct, { color: theme.accent }]}>{completionRate}%</Text>
          </View>
          <ScoreBar value={completionRate} color={theme.accent} />
          <Text style={[styles.progressSub, { color: theme.textSecondary }]}>
            {myDone.length} of {myTasks.length} tasks done
          </Text>
        </View>

        {/* Settings menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SETTINGS</Text>
          <View style={[styles.menuCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.menuRow,
                  { borderBottomColor: theme.border },
                  i === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: theme.surface2 }]}>
                  <Feather name={item.icon as any} size={16} color={theme.textSecondary} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                  {item.sub ? (
                    <Text style={[styles.menuSub, { color: theme.textTertiary }]}>{item.sub}</Text>
                  ) : null}
                </View>
                <Feather name="chevron-right" size={16} color={theme.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App info */}
        <Text style={[styles.appInfo, { color: theme.textTertiary }]}>
          Tidly v1.0.0 · Made with 🧹 in Montreal
        </Text>

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
  themeBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 0.5,
  },
  scroll: { paddingHorizontal: Spacing.xl },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.xl, borderRadius: Radius.xl,
    borderWidth: 0.5, gap: Spacing.xl, marginBottom: Spacing.xl,
  },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  profileEmail: { fontSize: 13 },
  scorePill: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full, alignSelf: 'flex-start', marginTop: 4,
  },
  scorePillText: { fontSize: 12, fontWeight: '600' },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, marginBottom: Spacing.md },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statBox: {
    flex: 1, borderRadius: Radius.lg, borderWidth: 0.5,
    padding: Spacing.md, alignItems: 'center', gap: 4,
  },
  statVal: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  statLabel: { fontSize: 11 },

  progressCard: {
    padding: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 0.5, marginBottom: Spacing.xl,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 14, fontWeight: '500' },
  progressPct: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  progressSub: { fontSize: 12, marginTop: 6 },

  menuCard: { borderRadius: Radius.lg, borderWidth: 0.5, overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '500' },
  menuSub: { fontSize: 12, marginTop: 2 },

  appInfo: { fontSize: 12, textAlign: 'center', marginBottom: Spacing.md },
});
