import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Toggle } from '../components/Toggle';
import { Spacing, Radius } from '../constants/theme';
import { formatRelativeTime, getTaskStatusLabel } from '../utils/helpers';

export const AlertsScreen = () => {
  const { theme, isDark } = useTheme();
  const { activity, members, tasks, notificationSettings, toggleNotification } = useApp();

  const overdueCount = tasks.filter(t => getTaskStatusLabel(t) === 'overdue').length;
  const todayCount = tasks.filter(t => getTaskStatusLabel(t) === 'today').length;

  const notifBanners = [
    overdueCount > 0 && {
      icon: 'alert-circle' as const,
      iconColor: theme.red,
      iconBg: theme.redLight,
      title: `${overdueCount} task${overdueCount > 1 ? 's' : ''} overdue`,
      body: 'These need attention right now.',
    },
    todayCount > 0 && {
      icon: 'clock' as const,
      iconColor: theme.accent,
      iconBg: theme.accentLight,
      title: `${todayCount} task${todayCount > 1 ? 's' : ''} due today`,
      body: 'Check your list and knock them out.',
    },
  ].filter(Boolean) as any[];

  const activityConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
    completed: { icon: 'check-circle', label: 'completed', color: theme.green, bg: theme.greenLight },
    added: { icon: 'plus-circle', label: 'added', color: theme.accent, bg: theme.accentLight },
    missed: { icon: 'x-circle', label: 'missed', color: theme.red, bg: theme.redLight },
    settled: { icon: 'award', label: 'settled', color: theme.yellow, bg: theme.yellowLight },
  };

  const notifSettings = [
    {
      key: 'morningDigest' as const,
      label: 'Morning digest',
      sub: 'Silent · 8:00 AM daily',
      icon: 'sunrise',
    },
    {
      key: 'oneHourWarning' as const,
      label: '1-hour warning',
      sub: 'Alert · 1–2 hrs before due',
      icon: 'bell',
    },
    {
      key: 'overdueReminder' as const,
      label: 'Overdue reminders',
      sub: 'Alert · every 2 hours',
      icon: 'alert-triangle',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Alerts</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Urgent banners */}
        {notifBanners.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>NOW</Text>
            {notifBanners.map((b: any, i: number) => (
              <View
                key={i}
                style={[
                  styles.banner,
                  { backgroundColor: theme.surface, borderColor: theme.border, borderLeftColor: b.iconColor },
                ]}
              >
                <View style={[styles.bannerIcon, { backgroundColor: b.iconBg }]}>
                  <Feather name={b.icon} size={16} color={b.iconColor} />
                </View>
                <View style={styles.bannerText}>
                  <Text style={[styles.bannerTitle, { color: theme.text }]}>{b.title}</Text>
                  <Text style={[styles.bannerBody, { color: theme.textSecondary }]}>{b.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Activity feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACTIVITY</Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {activity.map((item, i) => {
              const member = members.find(m => m.id === item.memberId);
              const cfg = activityConfig[item.type];
              return (
                <View
                  key={item.id}
                  style={[
                    styles.activityRow,
                    { borderBottomColor: theme.border },
                    i === activity.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={[styles.activityIcon, { backgroundColor: cfg.bg }]}>
                    <Feather name={cfg.icon as any} size={16} color={cfg.color} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityText, { color: theme.text }]}>
                      <Text style={{ fontWeight: '600' }}>
                        {member?.isCurrentUser ? 'You' : member?.name.split(' ')[0]}
                      </Text>
                      {' '}{cfg.label}{' '}
                      <Text style={{ fontStyle: 'italic' }}>"{item.taskTitle}"</Text>
                    </Text>
                    <Text style={[styles.activityTime, { color: theme.textTertiary }]}>
                      {formatRelativeTime(item.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            NOTIFICATION SETTINGS
          </Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {notifSettings.map((s, i) => (
              <View
                key={s.key}
                style={[
                  styles.settingRow,
                  { borderBottomColor: theme.border },
                  i === notifSettings.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.settingIcon, { backgroundColor: theme.surface2 }]}>
                  <Feather name={s.icon as any} size={16} color={theme.textSecondary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>{s.label}</Text>
                  <Text style={[styles.settingSub, { color: theme.textTertiary }]}>{s.sub}</Text>
                </View>
                <Toggle
                  value={notificationSettings[s.key]}
                  onToggle={() => toggleNotification(s.key)}
                />
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
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.7, marginBottom: Spacing.md },

  banner: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, borderRadius: Radius.md,
    borderWidth: 0.5, borderLeftWidth: 3,
    gap: Spacing.md, marginBottom: Spacing.sm,
  },
  bannerIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  bannerBody: { fontSize: 12 },

  card: { borderRadius: Radius.lg, borderWidth: 0.5, overflow: 'hidden' },

  activityRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  activityIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 13, lineHeight: 19 },
  activityTime: { fontSize: 11, marginTop: 3, fontFamily: 'monospace' },

  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 0.5,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  settingSub: { fontSize: 12 },
});
