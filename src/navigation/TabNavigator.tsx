import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { MembersScreen } from '../screens/MembersScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { MainTabParamList } from '../types';
import { View, Text, StyleSheet } from 'react-native';
import { getTaskStatusLabel } from '../utils/helpers';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabBarIcon = ({
  name, color, size, badge,
}: {
  name: string; color: string; size: number; badge?: number;
}) => (
  <View>
    <Feather name={name as any} size={size} color={color} />
    {badge && badge > 0 ? (
      <View style={[styles.badge, { backgroundColor: '#F56B6B' }]}>
        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    ) : null}
  </View>
);

export const TabNavigator = () => {
  const { theme } = useTheme();
  const { tasks, activity } = useApp();

  const overdueCount = tasks.filter(t => getTaskStatusLabel(t) === 'overdue').length;
  const unreadActivity = activity.slice(0, 3).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: 4,
          height: 72,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="check-square" color={color} size={size} badge={overdueCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Members"
        component={MembersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="users" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="bell" color={color} size={size} badge={unreadActivity} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -3, right: -6,
    width: 14, height: 14, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
});
